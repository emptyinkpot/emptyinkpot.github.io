# Deploy Graph

```text
Remote source repo (/srv/myblog/repo)
  -> npm run check:workspace
  -> npm run check
  -> npm run build
  -> apps/web/dist
  -> npm run deploy:site
  -> /srv/myblog/site
  -> Nginx static routes
  -> https://blog.tengokukk.com/
```

## Static Route Rule

MyBlog is an Astro static site. Nginx must serve generated routes only:

```nginx
try_files $uri $uri/index.html =404;
```

Unknown routes must return 404. They must not fall through to `/index.html`.

## Authority Rule

Only a workspace that passes `tools/deploy-guard.mjs` may write to `/srv/myblog/site`. The current deploy-authoritative source workspace is `/srv/myblog/repo`.
