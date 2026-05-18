import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const args = new Set(process.argv.slice(2));

const contractPath = 'apps/android-shell/twa.contract.json';
const defaultOutputDir = '.runtime/android-twa';
const bubblewrapVersion = '1.24.1';
const outputDir = path.resolve(rootDir, getArgValue('--output', defaultOutputDir));
const shouldGenerate = args.has('--generate') || args.has('--build');
const shouldBuild = args.has('--build');
const validateOnly = args.has('--validate-only') || (!shouldGenerate && !shouldBuild);
const testSigning = args.has('--test-signing') || process.env.TWA_TEST_SIGNING === '1';
const skipSigning = !testSigning && (args.has('--skip-signing') || process.env.TWA_SKIP_SIGNING === '1');
const isCi = process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true';
const testSigningPassword = 'myblogtest';

const contract = readJson(contractPath);
let configuredJdkPath = '';
let configuredAndroidSdkPath = '';

await verifyLocalPwaSurface();
const online = await verifyOnlinePwaSurface(contract).catch((error) => {
  if (!isCi) throw error;
  console.warn(`Online PWA validation unavailable in CI, using local TWA surface: ${error.message}`);
  return verifyLocalTwaSurface(contract);
});
const twaManifest = createTwaManifest(contract, online.manifest);

if (validateOnly) {
  console.log(JSON.stringify({
    status: 'android-twa-validation-passed',
    manifestUrl: contract.manifestUrl,
    packageId: twaManifest.packageId,
    outputDir: path.relative(rootDir, outputDir).replaceAll('\\', '/'),
    bubblewrapVersion
  }, null, 2));
  process.exit(0);
}

ensureInsideRoot(outputDir);
fs.mkdirSync(outputDir, { recursive: true });
writeJson(path.join(outputDir, 'twa-manifest.json'), twaManifest);

configureBubblewrap();

runBubblewrap(['update', '--skipVersionUpgrade', `--manifest=${path.join(outputDir, 'twa-manifest.json')}`, `--directory=${outputDir}`]);
patchGeneratedGradleProject();
if (testSigning) {
  ensureTestSigningKey();
}

if (shouldBuild) {
  runBubblewrap([
    'build',
    ...(skipSigning || testSigning ? ['--skipSigning'] : []),
    '--skipPwaValidation',
    `--manifest=${path.join(outputDir, 'twa-manifest.json')}`,
    `--directory=${outputDir}`
  ]);
  if (testSigning) {
    signApkWithTestKey();
  }
}

console.log(JSON.stringify({
  status: shouldBuild ? 'android-twa-build-finished' : 'android-twa-generated',
  manifestUrl: contract.manifestUrl,
  outputDir: path.relative(rootDir, outputDir).replaceAll('\\', '/'),
  apk: shouldBuild ? path.relative(rootDir, path.join(outputDir, skipSigning ? 'app-release-unsigned-aligned.apk' : 'app-release-signed.apk')).replaceAll('\\', '/') : null,
  appBundle: shouldBuild ? path.relative(rootDir, path.join(outputDir, skipSigning ? 'app/build/outputs/bundle/release/app-release.aab' : 'app-release-bundle.aab')).replaceAll('\\', '/') : null,
  signing: testSigning ? 'test-signed' : (skipSigning ? 'skipped' : 'required')
}, null, 2));

async function verifyLocalPwaSurface() {
  run(commandName('npm'), ['run', 'check:pwa']);
}

async function verifyOnlinePwaSurface(twaContract) {
  const [manifestResponse, serviceWorkerResponse, homeResponse, assetLinksResponse] = await Promise.all([
    fetch(twaContract.manifestUrl),
    fetch(new URL('/sw.js', twaContract.runtimeUrl)),
    fetch(twaContract.runtimeUrl),
    fetch(new URL('/.well-known/assetlinks.json', twaContract.runtimeUrl))
  ]);

  if (manifestResponse.status !== 200) {
    throw new Error(`Manifest request failed: ${twaContract.manifestUrl} -> ${manifestResponse.status}`);
  }

  const manifestContentType = manifestResponse.headers.get('content-type') || '';
  if (!manifestContentType.includes('application/manifest+json') && !manifestContentType.includes('application/json')) {
    throw new Error(`Manifest content-type is not installable JSON: ${manifestContentType}`);
  }

  if (serviceWorkerResponse.status !== 200) {
    throw new Error(`/sw.js request failed: ${serviceWorkerResponse.status}`);
  }

  if (assetLinksResponse.status !== 200) {
    throw new Error(`assetlinks.json request failed: ${assetLinksResponse.status}`);
  }

  const manifest = await manifestResponse.json();
  const serviceWorkerSource = await serviceWorkerResponse.text();
  const html = await homeResponse.text();
  const assetLinksContentType = assetLinksResponse.headers.get('content-type') || '';
  const assetLinks = await assetLinksResponse.json().catch(() => {
    throw new Error(`assetlinks.json is not valid JSON; content-type was ${assetLinksContentType}`);
  });

  assertEqual(manifest.start_url, '/', 'online manifest start_url');
  assertEqual(manifest.scope, '/', 'online manifest scope');
  assertEqual(manifest.display, 'standalone', 'online manifest display');

  const icon512 = findIcon(manifest, '512x512');
  if (!icon512) {
    throw new Error('online manifest is missing 512x512 PNG icon');
  }

  for (const boundary of [
    "url.pathname.startsWith('/api/')",
    "url.pathname.startsWith('/openlist/')",
    "request.headers.has('range')"
  ]) {
    if (!serviceWorkerSource.includes(boundary)) {
      throw new Error(`online service worker boundary missing: ${boundary}`);
    }
  }

  if (!html.includes('rel="manifest" href="/manifest.webmanifest"')) {
    throw new Error('home page is missing manifest link');
  }

  if (!html.includes("serviceWorker.register('/sw.js'")) {
    throw new Error('home page is missing service worker registration');
  }

  assertAssetLinks(twaContract, assetLinks);

  return { manifest, icon512 };
}

function verifyLocalTwaSurface(twaContract) {
  const manifest = readJson('apps/web/public/manifest.webmanifest');
  const serviceWorkerSource = fs.readFileSync(path.resolve(rootDir, 'apps/web/public/sw.js'), 'utf8');
  const homeSource = fs.readFileSync(path.resolve(rootDir, 'apps/web/src/layouts/BaseLayout.astro'), 'utf8');
  const assetLinks = readJson('apps/web/public/.well-known/assetlinks.json');

  assertEqual(manifest.start_url, '/', 'local manifest start_url');
  assertEqual(manifest.scope, '/', 'local manifest scope');
  assertEqual(manifest.display, 'standalone', 'local manifest display');

  const icon512 = findIcon(manifest, '512x512');
  if (!icon512) {
    throw new Error('local manifest is missing 512x512 PNG icon');
  }

  for (const boundary of [
    "url.pathname.startsWith('/api/')",
    "url.pathname.startsWith('/openlist/')",
    "request.headers.has('range')"
  ]) {
    if (!serviceWorkerSource.includes(boundary)) {
      throw new Error(`local service worker boundary missing: ${boundary}`);
    }
  }

  if (!homeSource.includes('rel="manifest" href={withBase(\'/manifest.webmanifest\')}')) {
    throw new Error('BaseLayout is missing manifest link');
  }

  if (!homeSource.includes("navigator.serviceWorker.register('/sw.js'")) {
    throw new Error('BaseLayout is missing service worker registration');
  }

  assertAssetLinks(twaContract, assetLinks);
  return { manifest, icon512 };
}

function createTwaManifest(twaContract, webManifest) {
  const runtimeUrl = new URL(twaContract.runtimeUrl);
  const icon512 = findIcon(webManifest, '512x512');
  const icon192 = findIcon(webManifest, '192x192');
  const versionCode = Number(process.env.TWA_VERSION_CODE || process.env.GITHUB_RUN_NUMBER || 1);
  const versionName = process.env.TWA_VERSION_NAME || webManifest.version || `1.${versionCode}`;

  return {
    packageId: twaContract.packageId || 'com.tengokukk.myblog',
    host: runtimeUrl.host,
    name: twaContract.androidName || webManifest.name || 'MyBlog Runtime',
    launcherName: twaContract.launcherName || webManifest.short_name || 'MyBlog',
    display: 'standalone',
    themeColor: webManifest.theme_color || '#6B2D5C',
    themeColorDark: twaContract.themeColorDark || '#1E1B18',
    navigationColor: twaContract.navigationColor || '#1E1B18',
    navigationColorDark: twaContract.navigationColorDark || '#000000',
    navigationDividerColor: twaContract.navigationDividerColor || '#00000000',
    navigationDividerColorDark: twaContract.navigationDividerColorDark || '#00000000',
    backgroundColor: webManifest.background_color || '#F5F1E8',
    enableNotifications: false,
    enableSiteSettingsShortcut: true,
    startUrl: '/',
    iconUrl: new URL(icon512.src, twaContract.manifestUrl).toString(),
    maskableIconUrl: icon512.purpose?.includes('maskable') ? new URL(icon512.src, twaContract.manifestUrl).toString() : undefined,
    monochromeIconUrl: undefined,
    splashScreenFadeOutDuration: 300,
    signingKey: {
      path: './android.keystore',
      alias: 'myblog'
    },
    appVersion: versionName,
    appVersionCode: versionCode,
    shortcuts: (webManifest.shortcuts || []).slice(0, 4).map((shortcut) => ({
      name: shortcut.name,
      shortName: shortcut.short_name || shortcut.name,
      url: shortcut.url,
      chosenIconUrl: new URL(shortcut.icons?.[0]?.src || icon192?.src || icon512.src, twaContract.manifestUrl).toString(),
      chosenMaskableIconUrl: new URL(shortcut.icons?.[0]?.src || icon192?.src || icon512.src, twaContract.manifestUrl).toString()
    })),
    generatorApp: 'myblog-android-twa-generator',
    webManifestUrl: twaContract.manifestUrl,
    fallbackType: twaContract.fallbackType || 'customtabs',
    features: {},
    alphaDependencies: {
      enabled: false
    },
    isChromeOSOnly: false,
    isMetaQuest: false,
    fullScopeUrl: new URL('/', twaContract.runtimeUrl).toString(),
    minSdkVersion: 23,
    orientation: webManifest.orientation || 'default',
    fingerprints: twaContract.sha256CertFingerprints || [],
    additionalTrustedOrigins: [],
    retainedBundles: [],
    displayOverride: Array.isArray(webManifest.display_override) ? webManifest.display_override : []
  };
}

function findIcon(manifest, size) {
  return (manifest.icons || []).find((icon) => icon.sizes === size && icon.type === 'image/png');
}

function configureBubblewrap() {
  const jdkPath = resolveJdkPath();
  const androidSdkPath = prepareBubblewrapAndroidSdk(resolveAndroidSdkPath());
  if (!jdkPath || !androidSdkPath) {
    throw new Error('Bubblewrap config requires JAVA_HOME and ANDROID_HOME or ANDROID_SDK_ROOT');
  }

  const bubblewrapHome = process.env.HOME || process.env.USERPROFILE;
  if (!bubblewrapHome) {
    throw new Error('Cannot resolve user home for Bubblewrap config');
  }

  const configDir = path.join(bubblewrapHome, '.bubblewrap');
  fs.mkdirSync(configDir, { recursive: true });
  writeJson(path.join(configDir, 'config.json'), { jdkPath, androidSdkPath });
  configuredJdkPath = jdkPath;
  configuredAndroidSdkPath = androidSdkPath;
}

function runBubblewrap(bubblewrapArgs) {
  run(commandName('npx'), ['-y', `@bubblewrap/cli@${bubblewrapVersion}`, ...bubblewrapArgs], {
    cwd: outputDir,
    env: {
      ...process.env,
      ANDROID_HOME: configuredAndroidSdkPath || process.env.ANDROID_HOME,
      ANDROID_SDK_ROOT: configuredAndroidSdkPath || process.env.ANDROID_SDK_ROOT,
      BUBBLEWRAP_KEYSTORE_PASSWORD: testSigning ? testSigningPassword : (process.env.BUBBLEWRAP_KEYSTORE_PASSWORD || ''),
      BUBBLEWRAP_KEY_PASSWORD: testSigning ? testSigningPassword : (process.env.BUBBLEWRAP_KEY_PASSWORD || '')
    }
  });
}

function patchGeneratedGradleProject() {
  const wrapperPropertiesPath = path.join(outputDir, 'gradle/wrapper/gradle-wrapper.properties');
  const distributionUrl = process.env.TWA_GRADLE_DISTRIBUTION_URL ||
    (process.platform === 'win32' ? 'https://mirrors.cloud.tencent.com/gradle/gradle-8.11.1-bin.zip' : '');
  if (fs.existsSync(wrapperPropertiesPath) && distributionUrl) {
    const source = fs.readFileSync(wrapperPropertiesPath, 'utf8');
    const escapedUrl = distributionUrl.replace('https://', 'https\\://');
    fs.writeFileSync(
      wrapperPropertiesPath,
      source
        .replace(/^distributionUrl=.*$/m, `distributionUrl=${escapedUrl}`)
        .replace(/^networkTimeout=.*$/m, 'networkTimeout=60000')
    );
  }

  const androidManifestPath = path.join(outputDir, 'app/src/main/AndroidManifest.xml');
  if (fs.existsSync(androidManifestPath)) {
    let source = fs.readFileSync(androidManifestPath, 'utf8');
      if (!source.includes('android.support.customtabs.action.CustomTabsService')) {
        source = source.replace(
        /(<manifest\b[^>]*>\s*)/,
        `$1
    <queries>
        <intent>
            <action android:name="android.support.customtabs.action.CustomTabsService" />
        </intent>
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="https" />
        </intent>
    </queries>

`
      );
    }

    source = patchLauncherActivityBrowserMetadata(source);
    source = patchLauncherActivityTheme(source);
    fs.writeFileSync(androidManifestPath, source);
  }

  patchWebViewShellLauncherActivity();
}

function patchLauncherActivityBrowserMetadata(source) {
  const providerPackage = contract.preferredTwaProviderPackage;
  if (!providerPackage || source.includes('android.support.customtabs.trusted.START_CHROME_BEFORE_ANIMATION_COMPLETE')) {
    return source;
  }

  return source.replace(
    /(<activity android:name="LauncherActivity"[\s\S]*?<meta-data android:name="android\.support\.customtabs\.trusted\.DEFAULT_URL"[\s\S]*?\/>)/,
    `$1

            <meta-data
                android:name="android.support.customtabs.trusted.START_CHROME_BEFORE_ANIMATION_COMPLETE"
                android:value="true" />`
  );
}

function patchLauncherActivityTheme(source) {
  if (contract.launcherMode !== 'webview-shell') {
    return source;
  }

  return source.replace(
    'android:theme="@android:style/Theme.Translucent.NoTitleBar"',
    'android:theme="@android:style/Theme.Material.NoActionBar"'
  );
}

function patchWebViewShellLauncherActivity() {
  if (contract.launcherMode !== 'webview-shell') {
    return;
  }

  const launcherActivityPath = path.join(
    outputDir,
    'app/src/main/java',
    ...(twaManifest.packageId || contract.packageId).split('.'),
    'LauncherActivity.java'
  );

  if (!fs.existsSync(launcherActivityPath)) {
    return;
  }

  const launchUrl = new URL('/', contract.runtimeUrl).toString();
  fs.writeFileSync(launcherActivityPath, `package ${twaManifest.packageId || contract.packageId};

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class LauncherActivity extends Activity {
    private static final String LAUNCH_URL = "${launchUrl}";
    private WebView webView;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(30, 27, 24));
        getWindow().setNavigationBarColor(Color.BLACK);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(245, 241, 232));
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("blog.tengokukk.com".equals(uri.getHost())) {
                    return false;
                }
                return false;
            }
        });

        setContentView(webView);
        webView.loadUrl(LAUNCH_URL);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
`);
}

function ensureTestSigningKey() {
  const keyPath = path.join(outputDir, 'android.keystore');
  if (fs.existsSync(keyPath)) {
    return;
  }

  const keytool = findExecutable(path.join(configuredJdkPath, 'bin'), 'keytool');
  if (!fs.existsSync(keytool)) {
    throw new Error(`Cannot find keytool for test signing: ${keytool}`);
  }

  run(keytool, [
    '-genkeypair',
    '-v',
    '-keystore', keyPath,
    '-storepass', testSigningPassword,
    '-keypass', testSigningPassword,
    '-alias', 'myblog',
    '-keyalg', 'RSA',
    '-keysize', '2048',
    '-validity', '10000',
    '-dname', 'CN=MyBlog Runtime, OU=MyBlog, O=TengokuKK, L=Shanghai, S=Shanghai, C=CN'
  ], { cwd: outputDir });
}

function findExecutable(directory, name) {
  const candidates = process.platform === 'win32'
    ? [`${name}.exe`, `${name}.cmd`, `${name}.bat`, name]
    : [name];
  return candidates.map((candidate) => path.join(directory, candidate)).find((candidate) => fs.existsSync(candidate)) || path.join(directory, commandName(name));
}

function signApkWithTestKey() {
  const java = findExecutable(path.join(configuredJdkPath, 'bin'), 'java');
  const apksignerJar = path.join(configuredAndroidSdkPath, 'build-tools', '34.0.0', 'lib', 'apksigner.jar');
  const unsignedApk = path.join(outputDir, 'app-release-unsigned-aligned.apk');
  const signedApk = path.join(outputDir, 'app-release-signed.apk');
  const keyPath = path.join(outputDir, 'android.keystore');

  for (const filePath of [java, apksignerJar, unsignedApk, keyPath]) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Cannot sign test APK; missing ${filePath}`);
    }
  }

  fs.rmSync(signedApk, { force: true });
  run(java, [
    '-Xmx1024M',
    '-Xss1m',
    '-jar',
    apksignerJar,
    'sign',
    '--ks', keyPath,
    '--ks-key-alias', 'myblog',
    '--ks-pass', `pass:${testSigningPassword}`,
    '--key-pass', `pass:${testSigningPassword}`,
    '--out', signedApk,
    unsignedApk
  ], { cwd: outputDir });

  run(java, [
    '-jar',
    apksignerJar,
    'verify',
    signedApk
  ], { cwd: outputDir });
}

function run(command, commandArgs, options = {}) {
  const cwd = options.cwd || rootDir;
  const env = options.env || process.env;
  const result = process.platform === 'win32' && isDirectWindowsExecutable(command)
    ? spawnSync(command, commandArgs, {
      cwd,
      env,
      stdio: 'inherit',
      shell: false
    })
    : process.platform === 'win32'
    ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', [command, ...commandArgs].map(quoteWindowsArg).join(' ')], {
      cwd,
      env,
      stdio: 'inherit',
      shell: false
    })
    : spawnSync(command, commandArgs, {
      cwd,
      env,
      stdio: 'inherit',
      shell: false
    });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${commandArgs.join(' ')}`);
  }
}

function quoteWindowsArg(value) {
  const text = String(value);
  if (!/[()\s&|<>^"]/.test(text)) {
    return text;
  }
  return `"${text.replaceAll('"', '\\"')}"`;
}

function isDirectWindowsExecutable(command) {
  return path.isAbsolute(command) && command.toLowerCase().endsWith('.exe');
}

function commandName(name) {
  return process.platform === 'win32' ? `${name}.cmd` : name;
}

function resolveJdkPath() {
  const candidates = [
    process.env.JAVA_HOME,
    'C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.18.8-hotspot'
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(path.join(candidate, 'bin'))) || '';
}

function resolveAndroidSdkPath() {
  const candidates = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    'E:\\Android\\Sdk'
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(path.join(candidate, 'platform-tools'))) || '';
}

function prepareBubblewrapAndroidSdk(androidSdkPath) {
  if (!androidSdkPath) {
    return '';
  }

  if (hasAny(androidSdkPath, sdkManagerRelativePaths()) || fs.existsSync(path.join(androidSdkPath, 'tools'))) {
    return androidSdkPath;
  }

  const cmdlineLatest = path.join(androidSdkPath, 'cmdline-tools', 'latest');
  if (!hasAny(cmdlineLatest, sdkManagerRelativePaths())) {
    return androidSdkPath;
  }

  const compatRoot = process.platform === 'win32'
    ? path.resolve(path.parse(androidSdkPath).root, 'Android/BubblewrapSdkCompat')
    : path.resolve(rootDir, '.runtime/android-sdk-bubblewrap');
  if (process.platform !== 'win32') {
    ensureInsideRoot(compatRoot);
  }
  fs.mkdirSync(compatRoot, { recursive: true });

  for (const entry of ['bin', 'lib', 'source.properties', 'NOTICE.txt']) {
    mirrorEntry(path.join(cmdlineLatest, entry), path.join(compatRoot, entry));
  }

  for (const entry of ['build-tools', 'platform-tools', 'platforms', 'licenses']) {
    mirrorEntry(path.join(androidSdkPath, entry), path.join(compatRoot, entry));
  }

  return compatRoot;
}

function mirrorEntry(source, destination) {
  if (!fs.existsSync(source)) {
    return;
  }

  fs.rmSync(destination, { recursive: true, force: true });

  try {
    const type = fs.statSync(source).isDirectory() ? 'junction' : 'file';
    fs.symlinkSync(source, destination, type);
  } catch {
    fs.cpSync(source, destination, { recursive: true });
  }
}

function sdkManagerRelativePaths() {
  return process.platform === 'win32'
    ? ['bin/sdkmanager.bat', 'bin/sdkmanager.cmd', 'bin/sdkmanager.exe', 'bin/sdkmanager']
    : ['bin/sdkmanager'];
}

function hasAny(basePath, relativePaths) {
  return relativePaths.some((relativePath) => fs.existsSync(path.join(basePath, relativePath)));
}

function getArgValue(name, fallback) {
  const prefix = `${name}=`;
  const value = process.argv.slice(2).find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.resolve(rootDir, relativePath), 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertAssetLinks(twaContract, assetLinks) {
  if (!Array.isArray(assetLinks)) {
    throw new Error('assetlinks.json must be a JSON array');
  }

  const fingerprints = twaContract.sha256CertFingerprints || [];
  if (!fingerprints.length) {
    throw new Error('TWA contract must declare sha256CertFingerprints');
  }

  const expectedPackage = twaContract.packageId || 'com.tengokukk.myblog';
  const matched = assetLinks.some((statement) => {
    const target = statement?.target || {};
    const relations = statement?.relation || [];
    const actualFingerprints = target.sha256_cert_fingerprints || [];
    return target.namespace === 'android_app' &&
      target.package_name === expectedPackage &&
      relations.includes('delegate_permission/common.handle_all_urls') &&
      fingerprints.every((fingerprint) => actualFingerprints.includes(fingerprint));
  });

  if (!matched) {
    throw new Error(`assetlinks.json does not trust ${expectedPackage} with the configured SHA256 fingerprint`);
  }
}

function ensureInsideRoot(target) {
  const relative = path.relative(rootDir, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Output directory must stay inside repo: ${target}`);
  }
}
