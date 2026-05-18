import { QuartzTransformerPlugin } from "../types"
import { h } from "preact"

const myblogCss = `
:root {
  --myblog-page-bg: #f3efe7;
  --myblog-page-bg-strong: #ede7dd;
  --myblog-surface: rgba(255, 255, 255, 0.74);
  --myblog-surface-strong: rgba(255, 255, 255, 0.9);
  --myblog-border: rgba(87, 74, 60, 0.14);
  --myblog-text: #201b16;
  --myblog-muted: #6f6257;
  --myblog-accent: #1f4a5f;
  --myblog-accent-2: #6b2d5c;
  --myblog-green: #2f5d50;
  --myblog-shadow: 0 22px 70px rgba(64, 49, 32, 0.08);
  --myblog-focus: rgba(47, 93, 80, 0.42);
}

html {
  background: var(--myblog-page-bg);
}

body {
  background:
    linear-gradient(90deg, rgba(107, 45, 92, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(47, 93, 80, 0.028) 1px, transparent 1px),
    linear-gradient(180deg, #f7f4ee 0%, var(--myblog-page-bg) 100%);
  background-size: 44px 44px, 44px 44px, auto;
  color: var(--myblog-text);
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 0%, rgba(207, 221, 226, 0.42), transparent 34%),
    radial-gradient(circle at 86% 4%, rgba(235, 225, 210, 0.62), transparent 28%);
  z-index: -1;
}

.page {
  max-width: 1480px;
}

.page > #quartz-body .sidebar {
  padding-top: 1.4rem;
}

.left.sidebar {
  border-right: 1px solid var(--myblog-border);
}

.right.sidebar {
  border-left: 1px solid var(--myblog-border);
}

.page-title {
  border-bottom: 1px solid var(--myblog-border);
  padding-bottom: 0.9rem;
  font-family: var(--headerFont);
  letter-spacing: 0;
}

.page-title a {
  color: var(--myblog-text);
}

.page-title a::after {
  content: "Quartz Garden";
  display: block;
  margin-top: 0.25rem;
  color: var(--myblog-muted);
  font-family: var(--bodyFont);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.search > .search-button,
.darkmode,
.readermode {
  border: 1px solid var(--myblog-border);
  background: var(--myblog-surface);
  box-shadow: none;
}

.explorer,
.graph,
.backlinks,
.toc,
.recent-notes {
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: var(--myblog-surface);
  box-shadow: var(--myblog-shadow);
  backdrop-filter: blur(18px);
}

.explorer {
  padding: 0.85rem;
}

.graph,
.backlinks,
.toc {
  padding: 0.9rem;
}

.center {
  min-width: 0;
}

.center > article {
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: var(--myblog-surface-strong);
  box-shadow: var(--myblog-shadow);
  padding: clamp(1.2rem, 3vw, 2.4rem);
}

.popover-hint {
  border-bottom: 1px solid var(--myblog-border);
  margin-bottom: 1.4rem;
  padding-bottom: 1rem;
}

.article-title {
  color: var(--myblog-text);
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.08;
  letter-spacing: 0;
}

.content-meta {
  color: var(--myblog-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tags {
  gap: 0.45rem;
}

a.internal,
a.tag-link,
.tags a {
  border: 1px solid rgba(31, 74, 95, 0.12);
  border-radius: 999px;
  background: rgba(31, 74, 95, 0.08);
  color: var(--myblog-accent);
}

article p,
article li {
  line-height: 1.85rem;
}

article h2 {
  border-top: 1px solid var(--myblog-border);
  padding-top: 1rem;
}

blockquote {
  border-left-color: var(--myblog-accent);
  background: rgba(255, 255, 255, 0.52);
  padding: 0.6rem 0 0.6rem 1rem;
}

pre,
figure[data-rehype-pretty-code-figure] {
  border-radius: 8px;
  box-shadow: none;
}

code {
  border: 1px solid rgba(31, 74, 95, 0.1);
  background: rgba(31, 74, 95, 0.075);
  color: #244a5a;
}

img,
video,
audio {
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
}

footer {
  color: var(--myblog-muted);
}

.myblog-source-line {
  margin: 0.35rem 0 0;
  color: var(--myblog-muted);
  font-family: var(--bodyFont);
  font-size: 0.78rem;
  line-height: 1.5;
}

.myblog-source-line a {
  color: var(--myblog-accent);
}

.myblog-reading-progress {
  position: fixed;
  inset: 0 auto auto 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--myblog-accent), var(--myblog-accent-2));
  z-index: 9999;
  transition: width 120ms ease;
}

.myblog-topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: var(--myblog-surface-strong);
  box-shadow: var(--myblog-shadow);
  padding: 0.75rem;
}

.myblog-topnav__brand {
  display: grid;
  gap: 0.1rem;
  min-width: 10rem;
  color: var(--myblog-text);
}

.myblog-topnav__brand span,
.myblog-kicker,
.myblog-channel span,
.myblog-feed-card span,
.myblog-runtime-page__links span {
  color: var(--myblog-muted);
  font-family: var(--bodyFont);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.myblog-topnav__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.35rem;
}

.myblog-topnav__links a,
.myblog-home__actions a,
.myblog-home__actions button,
.myblog-runtime-page__status a,
.myblog-runtime-page__status span {
  border: 1px solid rgba(31, 74, 95, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  color: var(--myblog-accent);
  padding: 0.45rem 0.7rem;
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}

.myblog-topnav__links a.is-active,
.myblog-home__actions a {
  background: var(--myblog-accent);
  color: #fffaf2;
}

body[data-slug="index"] .left.sidebar,
body[data-slug="index"] .right.sidebar {
  display: none;
}

body[data-slug="index"] #quartz-body {
  grid-template-columns: minmax(0, 1fr);
}

body[data-slug="index"] .center {
  max-width: none;
}

body[data-slug="index"] .page-header .popover-hint {
  display: none;
}

.myblog-home,
.myblog-runtime-page {
  display: grid;
  gap: 1.25rem;
}

.myblog-home__hero,
.myblog-runtime-page__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
  gap: 1rem;
  align-items: stretch;
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: var(--myblog-surface-strong);
  box-shadow: var(--myblog-shadow);
  padding: clamp(1.2rem, 3vw, 2rem);
}

.myblog-home h1,
.myblog-runtime-page h1 {
  margin: 0.25rem 0 0;
  color: var(--myblog-text);
  font-size: clamp(2.2rem, 6vw, 5rem);
  line-height: 0.98;
  letter-spacing: 0;
}

.myblog-home__hero-copy > p:not(.myblog-kicker),
.myblog-runtime-page__hero > p:not(.myblog-kicker),
.myblog-channel p,
.myblog-feed-card p,
.myblog-runtime-page__panel p,
.myblog-runtime-page__panel li {
  color: var(--myblog-muted);
  line-height: 1.75;
}

.myblog-home__actions,
.myblog-runtime-page__status {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1rem;
}

.myblog-home__signal {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.myblog-home__signal div,
.myblog-channel,
.myblog-feed-card,
.myblog-side-panel,
.myblog-runtime-page__panel {
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.58);
  padding: 1rem;
}

.myblog-home__signal span,
.myblog-home__signal strong,
.myblog-channel strong,
.myblog-channel small,
.myblog-feed-card strong,
.myblog-feed-card small,
.myblog-runtime-page__links strong {
  display: block;
}

.myblog-home__signal strong {
  margin-top: 0.3rem;
  color: var(--myblog-text);
  font-size: 1.4rem;
}

.myblog-section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.myblog-section-head h2,
.myblog-side-panel h2,
.myblog-runtime-page__panel h2 {
  margin: 0;
  color: var(--myblog-text);
  font-size: clamp(1.25rem, 2vw, 1.8rem);
}

.myblog-channel-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.7rem;
}

.myblog-channel,
.myblog-feed-card,
.myblog-runtime-page__links a {
  color: inherit;
  text-decoration: none;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    background 160ms ease;
}

.myblog-channel:hover,
.myblog-feed-card:hover,
.myblog-runtime-page__links a:hover {
  border-color: rgba(31, 74, 95, 0.28);
  background: rgba(255, 255, 255, 0.82);
  transform: translateY(-2px);
}

.myblog-channel strong,
.myblog-feed-card strong {
  margin-top: 0.35rem;
  color: var(--myblog-text);
  font-size: 1rem;
}

.myblog-channel small,
.myblog-feed-card small {
  color: var(--myblog-accent);
  font-size: 0.76rem;
  font-weight: 800;
}

.myblog-home__body,
.myblog-runtime-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.36fr);
  gap: 1rem;
}

.myblog-feed__list,
.myblog-runtime-page__links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
}

.myblog-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.myblog-tag-cloud a {
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  border: 1px solid rgba(31, 74, 95, 0.12);
  border-radius: 999px;
  background: rgba(31, 74, 95, 0.07);
  color: var(--myblog-accent);
  padding: 0.35rem 0.55rem;
  font-size: 0.8rem;
}

.myblog-runtime-page__links a {
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.48);
  padding: 0.75rem;
}

.myblog-command-layer {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: grid;
  place-items: start center;
  padding: 10vh 1rem;
  background: rgba(24, 20, 16, 0.32);
  backdrop-filter: blur(8px);
}

.myblog-command-layer[hidden] {
  display: none;
}

.myblog-command-panel {
  width: min(760px, 100%);
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: var(--myblog-surface-strong);
  box-shadow: var(--myblog-shadow);
  padding: 0.75rem;
}

.myblog-command-panel input {
  width: 100%;
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: #fffaf2;
  padding: 0.85rem;
  color: var(--myblog-text);
  font: inherit;
}

.myblog-command-results {
  display: grid;
  gap: 0.35rem;
  max-height: 55vh;
  overflow: auto;
  margin-top: 0.65rem;
}

.myblog-command-results a {
  display: grid;
  gap: 0.2rem;
  border-radius: 8px;
  padding: 0.7rem;
  color: var(--myblog-text);
}

.myblog-command-results a:hover,
.myblog-command-results a.is-active {
  background: rgba(31, 74, 95, 0.08);
}

:focus-visible {
  outline: 2px solid var(--myblog-focus);
  outline-offset: 3px;
}

@media (max-width: 800px) {
  .left.sidebar,
  .right.sidebar {
    border: 0;
  }

  .center > article {
    padding: 1rem;
  }

  .myblog-topnav,
  .myblog-home__hero,
  .myblog-runtime-page__hero,
  .myblog-home__body,
  .myblog-runtime-page__grid {
    grid-template-columns: 1fr;
  }

  .myblog-channel-grid,
  .myblog-feed__list,
  .myblog-runtime-page__links {
    grid-template-columns: 1fr;
  }
}

body[data-slug="index"] {
  overflow: hidden;
}

body[data-slug="index"] .page {
  max-width: none;
}

body[data-slug="index"] .center > article {
  border: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

body[data-slug="index"] .myblog-topnav {
  display: none;
}

.myblog-home--workbench {
  --home-accent: #660874;
  --home-accent-soft: #ece5f0;
  --home-line: #d8d0dd;
  --home-panel: rgba(255, 255, 255, 0.7);
  --home-panel-strong: rgba(255, 255, 255, 0.86);
  --home-ink: #201b16;
  --home-muted: #6f6257;
  --runtime-depth-overlay: 120;
  --runtime-depth-command: 160;
  min-height: 100dvh;
  width: min(100%, 1600px);
  margin: 0 auto;
  color: var(--home-ink);
}

.home-feed-shell {
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 14px;
  width: min(1560px, calc(100vw - 24px));
  height: calc(100dvh - 24px);
  min-height: 680px;
  margin: 12px auto;
}

.home-feed-rail,
.home-feed-main {
  min-width: 0;
  min-height: 0;
}

.home-feed-rail {
  position: relative;
  display: grid;
  align-content: start;
  gap: 12px;
  overflow: auto;
  scrollbar-width: none;
}

.home-feed-rail::-webkit-scrollbar,
.home-feed-main::-webkit-scrollbar,
.home-article-drawer__body::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.home-sidebar-collapse {
  position: sticky;
  top: 8px;
  z-index: 3;
  justify-self: end;
  width: 30px;
  height: 30px;
  border: 1px solid var(--myblog-border);
  border-radius: 999px;
  background: var(--home-panel-strong);
  color: var(--home-accent);
  cursor: pointer;
}

.home-feed-profile,
.home-feed-rail-card,
.home-feed-toolbar,
.home-feed-card,
.home-hero-banner,
.home-activity-marquee,
.knowledge-search-panel,
.home-article-drawer,
.seal-palette__panel {
  border: 1px solid rgba(92, 77, 61, 0.15);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.64));
  box-shadow: 0 18px 48px rgba(50, 42, 32, 0.1);
  backdrop-filter: blur(22px) saturate(1.12);
}

.home-feed-profile,
.home-feed-rail-card {
  display: grid;
  gap: 10px;
  border-radius: 8px;
  padding: 14px;
}

.home-feed-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--home-accent);
  font-weight: 850;
  text-decoration: none;
}

.home-feed-brand__logo,
.home-sidebar-item b,
.home-feed-avatar {
  display: grid;
  place-items: center;
  background: var(--home-accent);
  color: #fff7fb;
}

.home-feed-brand__logo,
.home-sidebar-item b {
  width: 24px;
  height: 24px;
  border-radius: 6px;
}

.home-feed-avatar {
  justify-self: center;
  width: 92px;
  height: 92px;
  border: 4px solid white;
  border-radius: 999px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.home-feed-profile h1 {
  margin: 0;
  text-align: center;
  font-size: 1.05rem;
}

.home-feed-profile p,
.home-feed-profile small,
.home-feed-rail-card > span,
.home-feed-stat-grid small {
  color: var(--home-muted);
  font-size: 0.72rem;
}

.home-sidebar-nav {
  gap: 7px;
}

.home-sidebar-item {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  min-height: 38px;
  border-radius: 999px;
  padding: 6px 9px;
  background: rgba(255, 255, 255, 0.58);
  color: rgba(45, 30, 56, 0.82);
  text-decoration: none;
  transition:
    background 150ms ease,
    color 150ms ease,
    transform 150ms ease;
}

.home-sidebar-item:hover {
  background: rgba(102, 8, 116, 0.09);
  color: var(--home-accent);
  transform: translateX(3px);
}

.home-feed-memory ul,
.home-feed-stats ul {
  display: grid;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.home-feed-memory button,
.home-feed-stats button {
  width: 100%;
  border: 0;
  border-radius: 8px;
  background: rgba(47, 93, 80, 0.06);
  padding: 8px;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.home-feed-stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.home-feed-stat-grid div {
  border-radius: 8px;
  background: rgba(107, 45, 92, 0.07);
  padding: 8px;
}

.home-feed-stat-grid b {
  display: block;
  margin-top: 2px;
  color: var(--home-accent);
  font-size: 1.25rem;
}

.home-feed-main {
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr);
  gap: 12px;
  overflow: auto;
  padding-right: 2px;
  scrollbar-width: none;
}

.home-hero-banner {
  position: relative;
  min-height: clamp(260px, 36vh, 430px);
  overflow: hidden;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(102, 8, 116, 0.24), rgba(47, 93, 80, 0.14)),
    linear-gradient(90deg, rgba(102, 8, 116, 0.05) 1px, transparent 1px),
    linear-gradient(180deg, rgba(47, 93, 80, 0.04) 1px, transparent 1px),
    #f7f2ea;
  background-size: auto, 42px 42px, 42px 42px, auto;
}

.home-hero-banner__layer {
  position: absolute;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.56);
  background: rgba(255, 255, 255, 0.34);
  box-shadow: 0 18px 44px rgba(50, 42, 32, 0.1);
  transform: translate3d(var(--hero-x, 0), var(--hero-y, 0), 0);
  transition: transform 420ms cubic-bezier(.16, 1, .3, 1);
}

.home-hero-banner__layer--bg {
  inset: 8% 8% auto auto;
  width: 42%;
  height: 44%;
  border-radius: 999px;
  background: rgba(102, 8, 116, 0.1);
}

.home-hero-banner__layer--mid {
  right: 7%;
  bottom: 9%;
  width: 28%;
  height: 32%;
  border-radius: 8px;
  background: rgba(47, 93, 80, 0.1);
}

.home-hero-banner__layer--front {
  left: 6%;
  bottom: 10%;
  width: 18%;
  height: 22%;
  border-radius: 8px;
  background: rgba(201, 162, 39, 0.12);
}

.home-hero-banner__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(247, 244, 238, 0.92), rgba(247, 244, 238, 0.36));
}

.home-hero-banner__content {
  position: relative;
  z-index: 1;
  display: grid;
  align-content: end;
  gap: 14px;
  min-height: inherit;
  padding: clamp(22px, 5vw, 48px);
}

.home-hero-banner__content > span,
.home-feed-toolbar span,
.home-feed-card__meta span,
.bookmark span,
.seal-palette header span,
.reader-memory-panel span {
  color: var(--home-accent);
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.home-hero-banner h1 {
  margin: 0;
  max-width: 820px;
  color: #17110d;
  font-size: clamp(3.4rem, 10vw, 8rem);
  line-height: 0.84;
  letter-spacing: 0;
}

.home-hero-banner p {
  margin: 0;
  color: var(--home-muted);
  font-size: clamp(1rem, 2vw, 1.4rem);
}

.home-hero-banner__metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  max-width: 760px;
}

.home-hero-banner__metrics div {
  border: 1px solid rgba(92, 77, 61, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.58);
  padding: 10px;
}

.home-hero-banner__metrics span {
  display: block;
  color: var(--home-accent);
  font-size: 1.45rem;
  font-weight: 900;
}

.home-hero-banner__metrics small {
  color: var(--home-muted);
  font-size: 0.68rem;
  text-transform: uppercase;
}

.home-activity-marquee {
  overflow: hidden;
  border-radius: 8px;
  padding: 10px 0;
}

.home-activity-marquee div {
  display: flex;
  gap: 24px;
  width: max-content;
  animation: myblog-marquee 34s linear infinite;
}

.home-activity-marquee span {
  color: var(--home-muted);
  font-size: 0.82rem;
  white-space: nowrap;
}

.home-feed-toolbar {
  display: grid;
  grid-template-columns: minmax(180px, 0.24fr) minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  border-radius: 8px;
  padding: 10px 12px;
}

.home-feed-toolbar strong {
  display: block;
  font-size: 1.15rem;
}

.home-feed-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.home-feed-tab,
.home-feed-tabs a {
  border: 1px solid rgba(107, 45, 92, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.58);
  color: var(--home-accent);
  padding: 6px 10px;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.home-feed-tab.is-active {
  background: var(--home-accent);
  color: #fff7fb;
}

.home-feed-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-flow: dense;
  gap: 12px;
  padding-bottom: 12px;
}

.home-feed-card {
  position: relative;
  min-height: 220px;
  overflow: hidden;
  border-radius: 8px;
  color: var(--home-ink);
}

.home-feed-card--tall {
  grid-row: span 2;
  min-height: 454px;
}

.home-feed-card--standard {
  grid-column: span 2;
}

.home-feed-card--compact {
  min-height: 220px;
}

.home-feed-card__open {
  display: grid;
  gap: 14px;
  width: 100%;
  height: 100%;
  min-height: inherit;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 16px;
  text-align: left;
  cursor: pointer;
}

.home-feed-card__mark {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--feed-accent, var(--home-accent)) 18%, white);
  color: var(--feed-accent, var(--home-accent));
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
}

.home-feed-card__body {
  align-self: end;
}

.home-feed-card__meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.home-feed-card__meta small {
  color: var(--home-muted);
  font-size: 0.7rem;
}

.home-feed-card h2 {
  margin: 8px 0 0;
  color: #17110d;
  font-size: clamp(1.08rem, 2vw, 1.65rem);
  line-height: 1.08;
}

.home-feed-card p {
  margin: 8px 0 0;
  color: var(--home-muted);
  font-size: 0.88rem;
  line-height: 1.55;
}

.home-feed-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.home-feed-card__tags span {
  border-radius: 999px;
  background: rgba(47, 93, 80, 0.08);
  color: #2f5d50;
  padding: 4px 7px;
  font-size: 0.68rem;
  font-weight: 800;
}

.bookmark {
  position: absolute;
  top: 0;
  left: 14px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 38px;
  min-height: 58px;
  background: var(--feed-accent, var(--home-accent));
  color: #fff7fb;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%);
}

.bookmark span {
  color: inherit;
  writing-mode: vertical-rl;
  font-size: 0.58rem;
}

.card-paperclip {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 34px;
  border: 2px solid rgba(107, 45, 92, 0.28);
  border-left-color: transparent;
  border-radius: 999px;
  transform: rotate(18deg);
}

.seal-trigger {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 5;
  border: 1px solid rgba(107, 45, 92, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.74);
  color: var(--home-accent);
  padding: 5px 8px;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 850;
  cursor: pointer;
}

.home-article-layer,
.knowledge-search-layer,
.seal-palette {
  position: fixed;
  inset: 0;
  z-index: var(--runtime-depth-overlay);
}

.home-article-layer[hidden],
.knowledge-search-layer[hidden],
.seal-palette[hidden],
.selection-toolbar[hidden] {
  display: none;
}

.home-article-backdrop,
.knowledge-search-backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(30, 27, 24, 0.34);
  backdrop-filter: blur(8px);
}

.home-article-drawer {
  position: absolute;
  inset: 18px 18px 18px auto;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: min(920px, calc(100vw - 36px));
  border-radius: 8px;
  overflow: hidden;
}

.reading-progress {
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 3px;
  background: var(--home-accent);
  transform: scaleX(0);
  transform-origin: left center;
}

.home-article-drawer__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid rgba(92, 77, 61, 0.12);
  padding: 16px;
}

.home-article-drawer__header span {
  color: var(--home-accent);
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.home-article-drawer__header h2 {
  margin: 3px 0 0;
  font-size: clamp(1.2rem, 2vw, 1.7rem);
}

.home-article-drawer__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}

.home-article-drawer__actions button,
.home-article-drawer__actions a,
.reader-theme-switch button,
.selection-toolbar button,
.seal-palette button {
  border: 1px solid rgba(47, 93, 80, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.64);
  color: #2f5d50;
  padding: 6px 10px;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.home-article-drawer__body {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 18px;
  overflow: auto;
  padding: 16px;
  scrollbar-width: none;
}

.reader-memory-panel {
  position: sticky;
  top: 0;
  align-self: start;
  display: grid;
  gap: 10px;
  border: 1px solid rgba(92, 77, 61, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.58);
  padding: 12px;
}

.reader-memory-panel section {
  display: grid;
  gap: 6px;
}

.reader-memory-panel button {
  border: 0;
  border-radius: 7px;
  background: rgba(107, 45, 92, 0.06);
  padding: 7px;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.home-article-content {
  max-width: 74ch;
  color: #2c251f;
  font-size: var(--reader-font-size, 18px);
  line-height: var(--reader-line-height, 1.9);
}

.home-article-content h1,
.home-article-content h2 {
  color: #17110d;
  line-height: 1.12;
}

.home-article-content p {
  margin: 0 0 var(--reader-paragraph-gap, 16px);
}

:root[data-reader-theme="dark"] .home-article-drawer {
  background: rgba(27, 25, 23, 0.92);
  color: #f5efe6;
}

:root[data-reader-theme="dark"] .home-article-content,
:root[data-reader-theme="dark"] .home-article-content h1,
:root[data-reader-theme="dark"] .home-article-content h2 {
  color: #f5efe6;
}

:root[data-reader-theme="sepia"] .home-article-drawer {
  background: rgba(239, 229, 211, 0.96);
}

.reader-highlight {
  border-radius: 4px;
  padding: 0 2px;
}

.reader-highlight--gold {
  background: rgba(201, 162, 39, 0.34);
}

.reader-highlight--purple {
  background: rgba(107, 45, 92, 0.2);
}

.reader-highlight--green {
  background: rgba(47, 93, 80, 0.22);
}

.reader-highlight--focus {
  outline: 2px solid var(--home-accent);
}

.selection-toolbar {
  position: fixed;
  z-index: var(--runtime-depth-command);
  display: flex;
  gap: 6px;
  border: 1px solid rgba(92, 77, 61, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 44px rgba(30, 27, 24, 0.12);
  padding: 6px;
}

.knowledge-search-layer {
  z-index: var(--runtime-depth-command);
  display: grid;
  place-items: start center;
  padding: 9vh 16px;
}

.knowledge-search-panel {
  position: relative;
  width: min(760px, 100%);
  border-radius: 12px;
  overflow: hidden;
}

.knowledge-search-input-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  border-bottom: 1px solid rgba(92, 77, 61, 0.12);
  padding: 14px;
}

.knowledge-search-input-row input {
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 1rem;
}

.knowledge-search-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 14px;
}

.knowledge-search-tabs button {
  border: 1px solid rgba(107, 45, 92, 0.14);
  border-radius: 999px;
  background: rgba(107, 45, 92, 0.06);
  color: var(--home-accent);
  padding: 5px 8px;
  font-size: 0.72rem;
  font-weight: 850;
}

.knowledge-search-tabs button.is-active {
  background: var(--home-accent);
  color: #fff7fb;
}

.knowledge-search-results {
  display: grid;
  gap: 6px;
  max-height: 55vh;
  overflow: auto;
  padding: 10px;
}

.knowledge-search-result {
  display: grid;
  gap: 3px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  padding: 10px;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.knowledge-search-result:hover {
  background: rgba(47, 93, 80, 0.08);
}

.knowledge-search-result span {
  color: var(--home-accent);
  font-size: 0.68rem;
  font-weight: 850;
  text-transform: uppercase;
}

.knowledge-search-result small,
.knowledge-search-empty {
  color: var(--home-muted);
}

.seal-palette {
  pointer-events: none;
  z-index: var(--runtime-depth-command);
}

.seal-palette__panel {
  position: absolute;
  left: var(--seal-palette-x, 24px);
  top: var(--seal-palette-y, 24px);
  pointer-events: auto;
  display: grid;
  gap: 10px;
  width: min(360px, calc(100vw - 32px));
  border-radius: 12px;
  padding: 12px;
}

.seal-palette header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.seal-palette__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.knowledge-seal {
  position: absolute;
  left: var(--seal-x, 78%);
  top: var(--seal-y, 14%);
  z-index: 4;
  display: grid;
  place-items: center;
  width: 78px;
  height: 78px;
  border: 3px solid var(--seal-color, #9e2a2b);
  border-radius: 999px;
  color: var(--seal-color, #9e2a2b);
  opacity: 0.84;
  transform: translate(-50%, -50%) rotate(var(--seal-rotation, -7deg));
  pointer-events: none;
  mix-blend-mode: multiply;
}

.seal-palette__option.knowledge-seal {
  position: relative;
  left: auto;
  top: auto;
  width: 64px;
  height: 64px;
  transform: none;
  pointer-events: auto;
  background: transparent;
  padding: 0;
}

.knowledge-seal--square {
  border-radius: 10px;
}

.knowledge-seal--oval {
  width: 88px;
  height: 58px;
}

.knowledge-seal--vertical {
  width: 52px;
  height: 88px;
  border-radius: 10px;
}

.knowledge-seal--ticket {
  width: 92px;
  height: 54px;
  border-radius: 8px;
}

.knowledge-seal--rough {
  filter: contrast(1.2);
}

.knowledge-seal--aged {
  opacity: 0.72;
}

.knowledge-seal--ink {
  box-shadow: inset 0 0 0 2px currentColor;
}

.knowledge-seal__inner {
  display: grid;
  place-items: center;
  line-height: 1;
  text-align: center;
}

.knowledge-seal__inner strong {
  font-size: 0.9rem;
  letter-spacing: 0.08em;
}

.knowledge-seal__inner em {
  font-size: 0.48rem;
  font-style: normal;
  font-weight: 900;
}

.knowledge-seal--stamp-in {
  animation: myblog-stamp 280ms cubic-bezier(.16, 1, .3, 1);
}

@keyframes myblog-stamp {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--seal-rotation, -7deg)) scale(1.7);
  }
  to {
    opacity: 0.84;
    transform: translate(-50%, -50%) rotate(var(--seal-rotation, -7deg)) scale(1);
  }
}

@keyframes myblog-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 1100px) {
  body[data-slug="index"] {
    overflow: auto;
  }

  .home-feed-shell {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 0;
  }

  .home-feed-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-feed-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .home-feed-shell {
    width: calc(100vw - 12px);
    margin: 6px auto;
  }

  .home-feed-grid,
  .home-feed-toolbar,
  .home-article-drawer__body,
  .home-article-drawer__header,
  .home-hero-banner__metrics,
  .home-feed-rail {
    grid-template-columns: 1fr;
  }

  .home-feed-card--standard,
  .home-feed-card--tall {
    grid-column: auto;
    grid-row: auto;
  }

  .home-article-drawer {
    inset: 8px;
    width: auto;
  }
}
`

const myblogScript = `
(() => {
  if (window.__myblogQuartzRuntimeLoaded) return
  window.__myblogQuartzRuntimeLoaded = true

  const storageKeys = {
    history: "emptyinkpot-reading-history",
    bookmarks: "emptyinkpot-reader-bookmarks",
    highlights: "emptyinkpot-reader-highlights",
    annotations: "emptyinkpot-reader-annotations",
    seals: "emptyinkpot-reader-seals",
    stickers: "emptyinkpot-stickers",
    readerTheme: "emptyinkpot-reader-theme",
    sidebarCollapsed: "emptyinkpot-home-sidebar-collapsed",
    visualSettings: "emptyinkpot-visual-settings",
  }

  const readJson = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
    } catch {
      return fallback
    }
  }

  const writeJson = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Local runtime state is best-effort in private browsing contexts.
    }
  }

  const toRoute = (slug) => {
    const normalized = String(slug || "")
    if (!normalized || normalized === "index") return "/"
    if (normalized.endsWith("/index")) return "/" + normalized.slice(0, -"/index".length) + "/"
    return normalized.startsWith("/") ? normalized : "/" + normalized
  }

  const escapeHtml = (value) =>
    String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")

  const readHomeData = () => {
    try {
      return JSON.parse(document.getElementById("myblog-home-data")?.textContent || "{}")
    } catch {
      return {}
    }
  }

  let homeData = readHomeData()
  let currentArticle = null
  let selectedRange = null
  let searchKind = "all"
  let sealContext = null

  const ensureProgress = () => {
    let bar = document.querySelector(".myblog-reading-progress")
    if (!bar) {
      bar = document.createElement("div")
      bar.className = "myblog-reading-progress"
      document.body.prepend(bar)
    }
    return bar
  }

  const updateProgress = () => {
    const bar = ensureProgress()
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - window.innerHeight
    const progress = height > 0 ? Math.min(1, Math.max(0, scrollTop / height)) : 0
    bar.style.width = progress * 100 + "%"
  }

  const addSourceLine = () => {
    const header = document.querySelector(".popover-hint")
    if (!header || header.querySelector(".myblog-source-line")) return
    const source = document.querySelector("meta[name='myblog-source-path']")?.getAttribute("content")
    const openlist = document.querySelector("meta[name='myblog-openlist-url']")?.getAttribute("content")
    if (!source && !openlist) return

    const line = document.createElement("p")
    line.className = "myblog-source-line"
    if (openlist) {
      const link = document.createElement("a")
      link.href = openlist
      link.textContent = source || "OpenList source"
      line.append("Source: ", link)
    } else {
      line.textContent = "Source: " + source
    }
    header.append(line)
  }

  const homeFeedItems = () => Array.isArray(homeData.feedItems) ? homeData.feedItems : []
  const homeSeals = () => Array.isArray(homeData.seals) ? homeData.seals : []

  const feedItemById = (id) => homeFeedItems().find((item) => item.id === id)

  const renderSidebarList = (target, items, emptyText, type) => {
    if (!target) return
    if (!items.length) {
      const empty = document.createElement("li")
      empty.textContent = emptyText
      target.replaceChildren(empty)
      return
    }
    target.replaceChildren(
      ...items.slice(0, 4).map((item) => {
        const row = document.createElement("li")
        const button = document.createElement("button")
        const targetId = type === "highlight" || type === "annotation" ? item.articleId : item.id
        button.type = "button"
        button.dataset.sidebarDrawer = targetId || ""
        if (item.highlightId || item.id) button.dataset.sidebarHighlight = item.highlightId || item.id
        button.innerHTML = "<span></span><small></small>"
        button.querySelector("span").textContent =
          type === "highlight" ? item.text || "Untitled highlight" : item.title || item.body || "Untitled"
        button.querySelector("small").textContent =
          type === "history" ? Math.round(Number(item.progress || 0) * 100) + "%" : type
        row.append(button)
        return row
      }),
    )
  }

  const renderSidebarState = () => {
    const history = readJson(storageKeys.history, [])
    const bookmarks = readJson(storageKeys.bookmarks, [])
    const highlights = readJson(storageKeys.highlights, [])
    const annotations = readJson(storageKeys.annotations, [])
    document.querySelectorAll("[data-sidebar-stat]").forEach((node) => {
      const map = { history, bookmarks, highlights, annotations }
      node.textContent = String(map[node.dataset.sidebarStat]?.length ?? 0)
    })
    renderSidebarList(document.querySelector("[data-sidebar-history]"), history, "暂无记录", "history")
    renderSidebarList(
      document.querySelector("[data-sidebar-bookmarks]"),
      bookmarks.length ? bookmarks : highlights,
      bookmarks.length ? "暂无收藏" : "暂无标记",
      bookmarks.length ? "bookmark" : "highlight",
    )
  }

  const createReaderMemoryPanel = () => {
    const panel = document.createElement("aside")
    panel.className = "reader-memory-panel"
    const groups = [
      ["最近阅读", readJson(storageKeys.history, []), "history"],
      ["收藏", readJson(storageKeys.bookmarks, []), "bookmark"],
      ["标记", readJson(storageKeys.highlights, []), "highlight"],
      ["批注", readJson(storageKeys.annotations, []), "annotation"],
    ]
    for (const [title, items, type] of groups) {
      const section = document.createElement("section")
      const heading = document.createElement("span")
      heading.textContent = title
      section.append(heading)
      if (!items.length) {
        const empty = document.createElement("p")
        empty.textContent = "暂无记录"
        section.append(empty)
      } else {
        for (const item of items.slice(0, 4)) {
          const button = document.createElement("button")
          button.type = "button"
          button.dataset.memoryDrawer = type === "highlight" || type === "annotation" ? item.articleId : item.id
          button.dataset.memoryHighlight = item.highlightId || item.id || ""
          button.textContent =
            type === "highlight" ? item.text || "Untitled highlight" : item.title || item.body || "Untitled"
          section.append(button)
        }
      }
      panel.append(section)
    }
    return panel
  }

  const saveHistory = (item, scrollTop = 0, progress = 0) => {
    if (!item?.id) return
    const list = readJson(storageKeys.history, [])
    const previous = list.find((entry) => entry.id === item.id) || {}
    const record = {
      ...previous,
      id: item.id,
      title: item.title,
      href: toRoute(item.href),
      timestamp: Date.now(),
      scrollTop,
      progress,
    }
    writeJson(storageKeys.history, [record, ...list.filter((entry) => entry.id !== item.id)].slice(0, 50))
    renderSidebarState()
  }

  const updateDrawerProgress = () => {
    const body = document.querySelector("[data-article-body]")
    const progress = document.querySelector("[data-reading-progress]")
    if (!body || !progress || !currentArticle) return
    const max = body.scrollHeight - body.clientHeight
    const ratio = max > 0 ? body.scrollTop / max : 0
    progress.style.transform = "scaleX(" + Math.max(0, Math.min(1, ratio)) + ")"
    saveHistory(currentArticle, body.scrollTop, ratio)
  }

  const articleHtml = (item) => {
    const tags = (item.tags || []).map((tag) => '<button type="button" data-mini-tag="' + escapeHtml(tag) + '">' + escapeHtml(tag) + "</button>").join("")
    return (
      '<article class="home-article-content" data-current-article="' +
      escapeHtml(item.id) +
      '">' +
      '<header class="home-article-intro" data-seal-surface data-seal-target="' +
      escapeHtml(item.id) +
      '" data-seal-title="' +
      escapeHtml(item.title) +
      '" data-seal-kind="' +
      escapeHtml(item.type) +
      '">' +
      "<p>" +
      escapeHtml(item.kicker) +
      "</p><h1>" +
      escapeHtml(item.title) +
      "</h1><p>" +
      escapeHtml(item.summary) +
      "</p></header>" +
      '<section class="reader-mini-graph" data-reader-mini-graph><strong>知识网络</strong><div>' +
      tags +
      "</div><div data-mini-highlights><p>暂无本地标记</p></div></section>" +
      "<p>" +
      escapeHtml(item.summary) +
      "</p><p>这个阅读抽屉是 Quartz-native runtime。它保留原 MyBlog 的阅读记忆、高亮、批注、收藏、印章和搜索对象模型，同时内容入口由 Quartz emitter 和组件生成。</p>" +
      "<p>后续 OpenList、DataBase、PDF/EPUB 和 GitHub live 数据会作为 bridge 接回，而不是恢复旧 Astro 或 Next 外壳。</p>" +
      "</article>"
    )
  }

  const applyStoredHighlights = () => {
    const body = document.querySelector("[data-article-body]")
    const root = body?.querySelector(".home-article-content")
    if (!body || !root || !currentArticle) return
    const highlights = readJson(storageKeys.highlights, []).filter((item) => item.articleId === currentArticle.id)
    for (const item of highlights) {
      if (!item.text || root.querySelector('[data-highlight-id="' + CSS.escape(item.id) + '"]')) continue
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) {
        const index = node.nodeValue.indexOf(item.text)
        if (index >= 0) {
          const range = document.createRange()
          range.setStart(node, index)
          range.setEnd(node, index + item.text.length)
          const mark = document.createElement("mark")
          mark.className = "reader-highlight reader-highlight--" + (item.color || "gold")
          mark.dataset.highlightId = item.id
          mark.append(range.extractContents())
          range.insertNode(mark)
          break
        }
        node = walker.nextNode()
      }
    }
    renderReaderMiniGraph()
  }

  const renderReaderMiniGraph = () => {
    if (!currentArticle) return
    const target = document.querySelector("[data-mini-highlights]")
    if (!target) return
    const highlights = readJson(storageKeys.highlights, []).filter((item) => item.articleId === currentArticle.id)
    const annotations = readJson(storageKeys.annotations, []).filter((item) => item.articleId === currentArticle.id)
    const items = [...highlights.map((item) => ({ ...item, label: item.text })), ...annotations.map((item) => ({ ...item, label: item.body }))].slice(0, 5)
    if (!items.length) {
      target.innerHTML = "<p>暂无本地标记</p>"
      return
    }
    target.replaceChildren(
      ...items.map((item) => {
        const button = document.createElement("button")
        button.type = "button"
        button.dataset.memoryDrawer = item.articleId
        button.dataset.memoryHighlight = item.highlightId || item.id
        button.textContent = item.label || "Untitled memory"
        return button
      }),
    )
  }

  const openDrawer = (id, trigger, options = {}) => {
    const item = feedItemById(id)
    const layer = document.querySelector("[data-article-layer]")
    const body = document.querySelector("[data-article-body]")
    if (!item || !layer || !body) return
    currentArticle = item
    document.querySelector("[data-article-title]").textContent = item.title
    document.querySelector("[data-article-kicker]").textContent = item.kicker
    const full = document.querySelector("[data-article-full]")
    if (full) full.href = toRoute(item.href)
    body.replaceChildren(createReaderMemoryPanel())
    const wrap = document.createElement("div")
    wrap.innerHTML = articleHtml(item)
    body.append(wrap.firstElementChild)
    layer.hidden = false
    document.body.classList.add("has-home-article-drawer")
    const stored = readJson(storageKeys.history, []).find((entry) => entry.id === item.id)
    requestAnimationFrame(() => {
      if (stored?.scrollTop && !options.highlightId) body.scrollTop = stored.scrollTop
      applyStoredHighlights()
      updateBookmarkButton()
      updateDrawerProgress()
      renderSeals()
      if (options.highlightId) scrollToHighlight(options.highlightId)
    })
    saveHistory(item)
    trigger?.focus?.({ preventScroll: true })
  }

  const closeDrawer = () => {
    const layer = document.querySelector("[data-article-layer]")
    if (!layer) return
    hideSelectionToolbar()
    layer.hidden = true
    document.body.classList.remove("has-home-article-drawer")
    currentArticle = null
  }

  const getBookmarks = () => readJson(storageKeys.bookmarks, [])
  const updateBookmarkButton = () => {
    const button = document.querySelector("[data-reader-bookmark]")
    if (!button || !currentArticle) return
    const active = getBookmarks().some((item) => item.id === currentArticle.id)
    button.classList.toggle("is-active", active)
    button.textContent = active ? "已收藏" : "收藏"
  }

  const toggleBookmark = () => {
    if (!currentArticle) return
    const list = getBookmarks()
    const exists = list.some((item) => item.id === currentArticle.id)
    const next = exists
      ? list.filter((item) => item.id !== currentArticle.id)
      : [{ id: currentArticle.id, title: currentArticle.title, href: toRoute(currentArticle.href), createdAt: Date.now() }, ...list]
    writeJson(storageKeys.bookmarks, next)
    updateBookmarkButton()
    renderSidebarState()
  }

  const showSelectionToolbar = () => {
    const toolbar = document.querySelector("[data-selection-toolbar]")
    const body = document.querySelector("[data-article-body]")
    const selection = window.getSelection()
    const text = selection?.toString().trim() || ""
    if (!toolbar || !body || !currentArticle || text.length < 6 || text.length > 260 || !selection.rangeCount) {
      hideSelectionToolbar()
      return
    }
    const range = selection.getRangeAt(0)
    if (!body.contains(range.commonAncestorContainer)) {
      hideSelectionToolbar()
      return
    }
    selectedRange = range.cloneRange()
    const rect = range.getBoundingClientRect()
    toolbar.hidden = false
    toolbar.style.left = Math.min(window.innerWidth - toolbar.offsetWidth - 12, Math.max(12, rect.left)) + "px"
    toolbar.style.top = Math.max(12, rect.top - toolbar.offsetHeight - 10) + "px"
  }

  const hideSelectionToolbar = () => {
    const toolbar = document.querySelector("[data-selection-toolbar]")
    if (toolbar) toolbar.hidden = true
    selectedRange = null
  }

  const saveSelectionHighlight = (color = "gold", note = "") => {
    const selection = window.getSelection()
    const range = selectedRange || (selection?.rangeCount ? selection.getRangeAt(0) : null)
    const text = range?.toString().trim() || ""
    const root = document.querySelector(".home-article-content")
    if (!currentArticle || !range || !root || !root.contains(range.commonAncestorContainer) || text.length < 6) return
    const record = {
      id: currentArticle.id + ":" + Date.now(),
      articleId: currentArticle.id,
      title: currentArticle.title,
      text,
      color,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const mark = document.createElement("mark")
    mark.className = "reader-highlight reader-highlight--" + color
    mark.dataset.highlightId = record.id
    try {
      mark.append(range.extractContents())
      range.insertNode(mark)
      selection?.removeAllRanges()
    } catch {
      return
    }
    writeJson(storageKeys.highlights, [record, ...readJson(storageKeys.highlights, [])])
    if (note.trim()) {
      writeJson(storageKeys.annotations, [
        {
          id: "annotation:" + record.id,
          articleId: currentArticle.id,
          highlightId: record.id,
          body: note.trim(),
          color,
          tags: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...readJson(storageKeys.annotations, []),
      ])
    }
    hideSelectionToolbar()
    renderSidebarState()
    renderReaderMiniGraph()
  }

  const scrollToHighlight = (id) => {
    if (!id) return
    const mark = document.querySelector('[data-highlight-id="' + CSS.escape(id) + '"]')
    if (!mark) return
    mark.scrollIntoView({ block: "center", behavior: "smooth" })
    mark.classList.add("reader-highlight--focus")
    setTimeout(() => mark.classList.remove("reader-highlight--focus"), 1200)
  }

  const sealDefinitionMap = () => Object.fromEntries(homeSeals().map((item) => [item.id, item]))
  const getSeals = () => readJson(storageKeys.seals, [])
  const latestSealFor = (targetId) =>
    getSeals()
      .filter((item) => item.targetId === targetId)
      .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))[0]

  const createSealElement = (record, animateId = "") => {
    const definitions = sealDefinitionMap()
    const definition = definitions[record.sealId || record.type] || homeSeals()[0] || {}
    const seal = document.createElement("span")
    seal.className = "knowledge-seal knowledge-seal--" + (record.shape || definition.shape || "circle") + " knowledge-seal--" + (record.texture || definition.texture || "clean")
    if (record.id === animateId) seal.classList.add("knowledge-seal--stamp-in")
    seal.dataset.renderedSeal = record.id
    seal.style.setProperty("--seal-color", record.color || definition.color || "#9E2A2B")
    seal.style.setProperty("--seal-rotation", (record.rotation || -7) + "deg")
    seal.style.setProperty("--seal-x", Math.max(4, Math.min(96, (record.x ?? 0.78) * 100)) + "%")
    seal.style.setProperty("--seal-y", Math.max(4, Math.min(96, (record.y ?? 0.14) * 100)) + "%")
    seal.innerHTML = '<span class="knowledge-seal__inner"><strong></strong><em></em></span>'
    seal.querySelector("strong").textContent = record.label || definition.label || "精选"
    seal.querySelector("em").textContent = record.subLabel || definition.subLabel || "SELECTED"
    return seal
  }

  const renderSeals = (animateId = "") => {
    document.querySelectorAll("[data-rendered-seal]").forEach((node) => node.remove())
    document.querySelectorAll("[data-seal-target], [data-drawer-id]").forEach((surface) => {
      const targetId = surface.dataset.sealTarget || surface.dataset.drawerId
      if (!targetId) return
      const record = latestSealFor(targetId)
      if (record) surface.append(createSealElement(record, animateId))
    })
  }

  const openSealPalette = (target, anchor) => {
    const palette = document.querySelector("[data-seal-palette]")
    if (!palette || !target?.targetId) return
    sealContext = target
    const title = document.querySelector("[data-seal-target-title]")
    if (title) title.textContent = target.title || "选择判断"
    const rect = anchor?.getBoundingClientRect?.()
    palette.style.setProperty("--seal-palette-x", Math.min(window.innerWidth - 380, Math.max(12, rect?.left || 24)) + "px")
    palette.style.setProperty("--seal-palette-y", Math.min(window.innerHeight - 280, Math.max(12, (rect?.bottom || 24) + 8)) + "px")
    palette.hidden = false
  }

  const closeSealPalette = () => {
    const palette = document.querySelector("[data-seal-palette]")
    if (palette) palette.hidden = true
    sealContext = null
  }

  const saveSeal = (type) => {
    if (!sealContext?.targetId) return
    const definition = sealDefinitionMap()[type] || homeSeals()[0]
    if (!definition) return
    const records = getSeals()
    const previous = records.find((item) => item.targetId === sealContext.targetId)
    const now = Date.now()
    const record = {
      id: previous?.id || "seal:" + sealContext.targetId + ":" + now,
      sealId: definition.id,
      type,
      label: definition.label,
      subLabel: definition.subLabel,
      color: definition.color,
      shape: definition.shape,
      texture: definition.texture,
      targetId: sealContext.targetId,
      targetType: sealContext.targetType || "card",
      title: sealContext.title || "Untitled",
      kind: sealContext.kind || "post",
      href: sealContext.href || "",
      drawerId: sealContext.drawerId || "",
      rotation: previous?.rotation ?? Math.round(Math.random() * 14 - 7),
      x: sealContext.x ?? previous?.x ?? 0.78,
      y: sealContext.y ?? previous?.y ?? 0.14,
      createdAt: previous?.createdAt || now,
      updatedAt: now,
    }
    writeJson(storageKeys.seals, [record, ...records.filter((item) => item.targetId !== record.targetId)])
    renderSeals(record.id)
    closeSealPalette()
  }

  const removeSeal = () => {
    if (!sealContext?.targetId) return
    writeJson(storageKeys.seals, getSeals().filter((item) => item.targetId !== sealContext.targetId))
    renderSeals()
    closeSealPalette()
  }

  const allSearchDocs = () => {
    const highlights = readJson(storageKeys.highlights, []).map((item) => ({
      id: item.id,
      type: "highlight",
      title: item.title,
      content: item.text,
      drawerId: item.articleId,
      highlightId: item.id,
    }))
    const annotations = readJson(storageKeys.annotations, []).map((item) => ({
      id: item.id,
      type: "annotation",
      title: "批注 · " + item.articleId,
      content: item.body,
      drawerId: item.articleId,
      highlightId: item.highlightId,
    }))
    const seals = getSeals().map((item) => ({
      id: item.id,
      type: "seal",
      title: item.label + " · " + item.title,
      content: [item.label, item.subLabel, item.title, item.kind].join(" "),
      drawerId: item.drawerId || item.targetId,
    }))
    return [
      ...homeFeedItems().map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        content: [item.summary, item.kicker, item.meta, ...(item.tags || [])].join(" "),
        drawerId: item.id,
        href: toRoute(item.href),
      })),
      ...highlights,
      ...annotations,
      ...seals,
    ]
  }

  const renderSearch = () => {
    const input = document.querySelector("[data-search-input]")
    const results = document.querySelector("[data-search-results]")
    if (!input || !results) return
    const query = input.value.trim().toLowerCase()
    const docs = allSearchDocs()
      .filter((doc) => searchKind === "all" || doc.type === searchKind)
      .filter((doc) => !query || [doc.title, doc.content, doc.type].join(" ").toLowerCase().includes(query))
      .slice(0, 24)
    if (!docs.length) {
      results.innerHTML = '<p class="knowledge-search-empty">没有匹配结果。</p>'
      return
    }
    results.replaceChildren(
      ...docs.map((doc) => {
        const button = document.createElement("button")
        button.type = "button"
        button.className = "knowledge-search-result"
        button.innerHTML = "<span></span><strong></strong><small></small>"
        button.querySelector("span").textContent = doc.type
        button.querySelector("strong").textContent = doc.title || "Untitled"
        button.querySelector("small").textContent = String(doc.content || doc.href || "").slice(0, 160)
        button.addEventListener("click", () => {
          if (doc.drawerId && feedItemById(doc.drawerId)) {
            openDrawer(doc.drawerId, button, { highlightId: doc.highlightId })
            closeSearch()
          } else if (doc.href) {
            window.location.href = doc.href
          }
        })
        return button
      }),
    )
  }

  const openSearch = () => {
    const layer = document.querySelector("[data-search-layer]")
    const input = document.querySelector("[data-search-input]")
    if (!layer || !input) return
    layer.hidden = false
    input.focus()
    renderSearch()
  }

  const closeSearch = () => {
    const layer = document.querySelector("[data-search-layer]")
    if (layer) layer.hidden = true
  }

  const setupCommand = async () => {
    const triggers = [...document.querySelectorAll("[data-myblog-command-open]")]
    if (!triggers.length || document.querySelector(".myblog-command-layer")) return
    let runtime = null
    try {
      const response = await fetch("/static/myblog-runtime.json")
      runtime = response.ok ? await response.json() : null
    } catch {
      runtime = null
    }

    const layer = document.createElement("div")
    layer.className = "myblog-command-layer"
    layer.hidden = true
    layer.innerHTML = '<section class="myblog-command-panel" role="dialog" aria-modal="true"><input aria-label="Search MyBlog runtime" placeholder="搜索文章、入口、标签" /><div class="myblog-command-results"></div></section>'
    document.body.append(layer)
    const input = layer.querySelector("input")
    const results = layer.querySelector(".myblog-command-results")
    const docs = [
      ...homeFeedItems().map((item) => ({ title: item.title, description: item.summary, href: toRoute(item.href), kind: item.type })),
      ...(runtime?.channels || []).map((item) => ({ title: item.title, description: item.description, href: toRoute(item.slug), kind: item.kicker })),
      ...(runtime?.content || []).map((item) => ({ title: item.title || item.slug, description: item.description || "", href: toRoute(item.slug), kind: (item.tags || [])[0] || "content" })),
    ]

    const render = () => {
      const query = input.value.trim().toLowerCase()
      const matched = docs.filter((item) => [item.title, item.description, item.kind].join(" ").toLowerCase().includes(query)).slice(0, 12)
      results.replaceChildren(
        ...matched.map((item) => {
          const link = document.createElement("a")
          link.href = item.href
          link.innerHTML = "<span></span><strong></strong><small></small>"
          link.querySelector("span").textContent = item.kind || "MyBlog"
          link.querySelector("strong").textContent = item.title || "Untitled"
          link.querySelector("small").textContent = item.description || item.href
          return link
        }),
      )
    }

    const open = () => {
      layer.hidden = false
      input.focus()
      render()
    }
    const close = () => {
      layer.hidden = true
    }
    triggers.forEach((trigger) => trigger.addEventListener("click", open))
    input.addEventListener("input", render)
    layer.addEventListener("click", (event) => {
      if (event.target === layer) close()
    })
    window.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        open()
      }
      if (event.key === "Escape" && !layer.hidden) close()
    })
  }

  const applyReaderTheme = (theme) => {
    const next = ["light", "sepia", "dark"].includes(theme) ? theme : "light"
    document.documentElement.dataset.readerTheme = next
    try {
      localStorage.setItem(storageKeys.readerTheme, next)
    } catch {}
    document.querySelectorAll("[data-reader-theme]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.readerTheme === next)
    })
  }

  const initHomeRuntime = () => {
    homeData = readHomeData()
    renderSidebarState()
    renderSeals()
    applyReaderTheme(localStorage.getItem(storageKeys.readerTheme) || "light")

    document.querySelector("[data-sidebar-collapse]")?.addEventListener("click", () => {
      const shell = document.querySelector("[data-myblog-workbench]")
      shell?.classList.toggle("is-sidebar-collapsed")
      try {
        localStorage.setItem(storageKeys.sidebarCollapsed, shell?.classList.contains("is-sidebar-collapsed") ? "true" : "false")
      } catch {}
    })
    if (localStorage.getItem(storageKeys.sidebarCollapsed) === "true") {
      document.querySelector("[data-myblog-workbench]")?.classList.add("is-sidebar-collapsed")
    }

    document.querySelector("[data-hero-banner]")?.addEventListener("mousemove", (event) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      event.currentTarget.style.setProperty("--hero-x", x * 16 + "px")
      event.currentTarget.style.setProperty("--hero-y", y * 16 + "px")
    })

    document.querySelectorAll("[data-feed-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const kind = button.dataset.feedFilter || "all"
        document.querySelectorAll("[data-feed-filter]").forEach((item) => item.classList.toggle("is-active", item === button))
        document.querySelectorAll("[data-feed-card]").forEach((card) => {
          card.hidden = kind !== "all" && card.dataset.feedKind !== kind
        })
      })
    })

    document.addEventListener("click", (event) => {
      const open = event.target instanceof Element ? event.target.closest("[data-drawer-open]") : null
      if (open) {
        openDrawer(open.dataset.drawerOpen, open)
        return
      }
      if (event.target instanceof Element && event.target.closest("[data-article-close]")) {
        closeDrawer()
        return
      }
      if (event.target instanceof Element && event.target.closest("[data-search-open]")) {
        openSearch()
        return
      }
      if (event.target instanceof Element && event.target.closest("[data-search-close]")) {
        closeSearch()
        return
      }
      const sealTrigger = event.target instanceof Element ? event.target.closest("[data-seal-trigger], [data-reader-seal]") : null
      if (sealTrigger) {
        event.preventDefault()
        event.stopPropagation()
        const surface = sealTrigger.closest("[data-seal-target], [data-drawer-id]") || (currentArticle ? document.querySelector('[data-current-article="' + CSS.escape(currentArticle.id) + '"]') : null)
        const targetId = surface?.dataset.sealTarget || surface?.dataset.drawerId || currentArticle?.id
        openSealPalette(
          {
            targetId,
            targetType: currentArticle && targetId === currentArticle.id ? "article" : "card",
            title: surface?.dataset.sealTitle || currentArticle?.title || "Untitled",
            kind: surface?.dataset.sealKind || currentArticle?.type || "post",
            href: currentArticle?.href || "",
            drawerId: currentArticle?.id || targetId,
          },
          sealTrigger,
        )
        return
      }
      const memory = event.target instanceof Element ? event.target.closest("[data-memory-drawer], [data-sidebar-drawer]") : null
      if (memory) {
        openDrawer(memory.dataset.memoryDrawer || memory.dataset.sidebarDrawer, memory, { highlightId: memory.dataset.memoryHighlight || memory.dataset.sidebarHighlight })
      }
    })

    document.querySelector("[data-article-body]")?.addEventListener("scroll", updateDrawerProgress, { passive: true })
    document.querySelector("[data-article-body]")?.addEventListener("mouseup", () => setTimeout(showSelectionToolbar, 0))
    document.querySelector("[data-reader-bookmark]")?.addEventListener("click", toggleBookmark)
    document.querySelectorAll("[data-reader-theme]").forEach((button) => {
      button.addEventListener("click", () => applyReaderTheme(button.dataset.readerTheme))
    })
    document.querySelector("[data-search-input]")?.addEventListener("input", renderSearch)
    document.querySelectorAll("[data-search-kind]").forEach((button) => {
      button.addEventListener("click", () => {
        searchKind = button.dataset.searchKind || "all"
        document.querySelectorAll("[data-search-kind]").forEach((item) => item.classList.toggle("is-active", item === button))
        renderSearch()
      })
    })
    document.querySelectorAll("[data-highlight-color]").forEach((button) => {
      button.addEventListener("click", () => saveSelectionHighlight(button.dataset.highlightColor || "gold"))
    })
    document.querySelector("[data-open-annotation]")?.addEventListener("click", () => {
      const note = window.prompt("写下这条标记的批注")
      if (note !== null) saveSelectionHighlight("gold", note)
    })
    document.querySelector("[data-copy-selection]")?.addEventListener("click", async () => {
      const text = selectedRange?.toString().trim()
      if (text) {
        try {
          await navigator.clipboard.writeText(text)
        } catch {}
      }
      hideSelectionToolbar()
    })
    document.querySelector("[data-seal-close]")?.addEventListener("click", closeSealPalette)
    document.querySelector("[data-seal-remove]")?.addEventListener("click", removeSeal)
    document.querySelectorAll("[data-seal-type]").forEach((button) => {
      button.addEventListener("click", () => saveSeal(button.dataset.sealType))
    })
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSearch()
        closeSealPalette()
        if (!document.querySelector("[data-article-layer]")?.hidden) closeDrawer()
      }
    })
  }

  document.addEventListener("nav", () => {
    addSourceLine()
    updateProgress()
    initHomeRuntime()
  })
  window.addEventListener("scroll", updateProgress, { passive: true })
  window.addEventListener("resize", updateProgress)
  addSourceLine()
  updateProgress()
  setupCommand()
  initHomeRuntime()
})()
`

export const MyBlogStyle: QuartzTransformerPlugin = () => ({
  name: "MyBlogStyle",
  externalResources() {
    return {
      css: [{ content: myblogCss, inline: true }],
      js: [
        {
          loadTime: "afterDOMReady",
          contentType: "inline",
          script: myblogScript,
          spaPreserve: true,
        },
      ],
      additionalHead: [
        (pageData) =>
          h("meta", {
            name: "myblog-source-path",
            content: String(pageData.frontmatter?.sourcePath ?? ""),
          }),
        (pageData) =>
          h("meta", {
            name: "myblog-openlist-url",
            content: String(pageData.frontmatter?.openlistUrl ?? ""),
          }),
        () => h("meta", { name: "theme-color", content: "#f3efe7" }),
      ],
    }
  },
})
