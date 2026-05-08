# Deploy Graph

```text
Local source repo
  -> npm run check
  -> npm run build
  -> apps/web/dist
  -> npm run deploy:site
  -> /srv/myblog/site
  -> Nginx static routes
```

## Static Route Rule

MyBlog is an Astro static site. Nginx must serve generated routes only:

```nginx
try_files $uri $uri/index.html =404;
```

Unknown routes must return 404. They must not fall through to `/index.html`.
