# emptyinkpot.github.io

基于 Hexo 搭建的个人博客源码仓库，部署目标为 GitHub Pages：
`https://emptyinkpot.github.io/`

## 本地开发

安装依赖：

```bash
npm install
```

启动本地预览：

```bash
npm run server
```

默认访问地址：

```text
http://localhost:4000/
```

## 常用命令

新建文章：

```bash
npm run new "文章标题"
```

生成静态文件：

```bash
npm run build
```

清理缓存：

```bash
npm run clean
```

## GitHub Pages 发布

这个仓库已经包含 GitHub Actions 工作流。只要把更改推送到 `main` 分支，GitHub 就会自动构建并发布站点。

首次使用时，请在仓库设置中确认：

1. 打开 `Settings`
2. 进入 `Pages`
3. `Source` 选择 `GitHub Actions`

## 目录说明

- `source/_posts/`：博客文章
- `source/about/`：关于页面
- `_config.yml`：站点主配置
- `_config.landscape.yml`：当前主题覆盖配置
- `.github/workflows/pages.yml`：自动部署配置
