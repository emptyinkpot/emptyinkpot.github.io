# Evidence Library / 史料素材库体系计划

> 本目录是 MyBlog 中“史料素材库”板块的公开与机器可读真源之一。
> 人类优先读本文件；程序优先读 `evidence-library-plan.json`。

## 1. 目标定位

MyBlog 后续不只做普通博客，还要承接“历史影像生成系统”的素材管理层：

```text
史料 / 视频 / 图片 / 地图 / 文件扫描
  -> OpenList 大文件存储
  -> MyBlog Evidence Library 元数据与标注
  -> Remotion evidence manifest
  -> 历史视频生成
```

这个系统的核心目标是让视频生成从：

```text
文本 -> 想象 -> 画面
```

升级为：

```text
文本 -> 证据 -> 画面
```

## 2. 系统分工

### MyBlog

MyBlog 负责内容平台、公开展示、素材元数据、人工标注和导出清单。

```text
apps/web
  公开展示：史料库说明、公开素材、专题案例

apps/admin-next
  后台管理：素材扫描、标注、clip 切分、manifest 导出

public-data/evidence-library
  机器数据：计划、schema、索引、导出 manifest
```

### OpenList

OpenList 负责大文件存储和网盘挂载，不负责史料语义。

```text
OpenList URL: http://127.0.0.1:5244
active mount: /夸克网盘
useful API:
  POST /api/fs/list
  POST /api/fs/get
```

OpenList 只提供文件位置、目录结构、下载/预览能力。实体、年代、来源、版权、适用片段等信息必须保存在 MyBlog 的 Evidence Library。

### Remotion

Remotion 只读取导出的 manifest，不直接猜测网盘文件语义。

```text
asset-source/evidence-manifest.json
```

## 3. 最小可用版本

第一阶段只做三件事：

1. 在 MyBlog 建立 `evidence-library` 公开板块。
2. 在 `public-data/evidence-library/` 保存计划和机器 JSON。
3. 约定素材元数据格式，后续 admin 和 Remotion 都按它对接。

## 4. 素材数据模型

### Evidence Asset

```ts
type EvidenceAsset = {
  id: string;
  title: string;
  assetType: "document" | "image" | "video" | "audio" | "map" | "newspaper";
  openlistPath: string;
  publicUrl?: string;
  localMirrorPath?: string;
  sourceUrl?: string;
  license: "public_domain" | "cc" | "fair_use" | "private_research" | "unknown";
  era?: string;
  entities: string[];
  locations: string[];
  organizations: string[];
  events: string[];
  visualKinds: string[];
  bestFor: string[];
  avoidFor: string[];
  mustNotShow: string[];
  notes?: string;
  visibility: "private" | "listed" | "public";
};
```

### Evidence Clip

视频素材必须拆成可调用片段：

```ts
type EvidenceClip = {
  id: string;
  assetId: string;
  startMs: number;
  endMs: number;
  title: string;
  description: string;
  visualKinds: string[];
  mood: string[];
  motion: string[];
  bestFor: string[];
  avoidFor: string[];
  loopable: boolean;
  entities: string[];
  mustNotShow: string[];
};
```

## 5. 标注原则

素材库准确度来自结构化标注，而不是文件数量。

必须优先标：

```text
entities       这个素材真实对应哪些人物、地点、文件、事件
era            年代
sourceUrl      来源
license        使用边界
visualKinds    可承接的画面类型
bestFor        最适合哪些叙事角色
avoidFor       不适合哪些场景
mustNotShow    禁止误配条件
```

视频素材还必须标：

```text
startMs / endMs
loopable
mood
motion
```

## 6. 调用规则

Remotion 调用素材时必须执行：

```text
segment.semanticCard
  -> evidenceNeed
  -> Evidence Library asset/clip match
  -> OpenList/local path resolve
  -> Remotion scene props
```

硬规则：

```text
出现文件/条约/档案：先找真实扫描或图片
出现人物：先找真实照片/肖像
出现地点/铁路/战场：先找地图、照片或 footage
找不到真实素材：才允许程序动画，并标记 fallback_used
```

## 7. 板块路线

### Phase 1: Public Plan

- 新建公开路由 `/evidence-library/`
- 发布本计划
- 发布 `evidence-library-plan.json`

### Phase 2: Local Index

- 从 OpenList 扫描指定目录
- 生成待标注素材清单
- 支持手动补 `entities / visualKinds / sourceUrl / license`

### Phase 3: Clip Labeling

- 对视频素材建立 clip
- 支持 `startMs / endMs / mood / loopable`
- 导出 Remotion 可用片段

### Phase 4: Remotion Integration

- 导出 `asset-source/evidence-manifest.json`
- Remotion Evidence Resolver 优先读本地 manifest
- OpenList 只作为大文件访问层

### Phase 5: Public Showcase

- 对 `visibility=public` 的素材生成公开展示页
- 对历史专题生成“史料 -> 画面 -> 视频”的制作说明

## 8. 目录约定

```text
public-data/evidence-library/
  README.md
  evidence-library-plan.json
  manifests/
  schemas/
  exports/

apps/web/src/pages/evidence-library/
  index.astro

apps/admin-next/app/admin/evidence-library/
  page.jsx
```

## 9. 当前边界

当前只落地公开计划、JSON 和站点分区。后台标注 UI、OpenList 扫描器、Remotion manifest 自动导出属于后续阶段。
