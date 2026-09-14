# Stella Dating Events

角色邀约事件的可视化查询工具，支持多语言数据、星级 / 职业 / 地点筛选。

## 数据来源

图像资源与数据接口来自 [StellaSoraAPI](https://github.com/torikushiii/StellaSoraAPI)。

## 数据结构

默认从项目根目录 `data/` 读取：

```
data/
├── dating-events.json
└── changelog.json    # 可选
```

### `dating-events.json`

```json
{ 
  // region
  "CN": {
    // character id
    "103": {
      // landmark id
      "8": {
        "charId": 103,
        "eventId": 103301,
        "branchTag": 1,
        "landmarkId": 8,
        "charName": "琥珀",
        "charGrade": 4,
        "enCharName": "Amber",
        "charColor": "#99d2d9",
        "charJob": "先锋",
        "charTagColor": "#db6893",
        "eventCg": "DatingSPCG_103301",
        "landmarkName": "港口",
        "eventName": "偶遇猫咪",
        "eventClue": "在港口的话，或许会发现些什么……",
        "eventOption": "要不要现在来一场夜钓？"
      }
    }
  },
  "EN": { "...": {} }
}
```

### `changelog.json`（可选）

```json
{
  "added": [103301, 103303],
  "modified": [103305]
}
```

文件不存在或字段为空时，新增 / 修改筛选自动隐藏。

## 数据目录覆盖

CI 或本地开发时若数据不在 `data/`，用环境变量指定：

```bash
DATA_DIR=/abs/path/to/data npm run build
```

## 本地开发

```bash
npm install
npm run dev          # http://localhost:4321/ss-dating/
npm run check        # 类型检查
npm run build && npm run preview
```

## 部署

推到 `main` 分支后由 GitHub Actions 自动构建并发布到 GitHub Pages。

- 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**
- `astro.config.mjs` 里 `site` 和 `base` 按实际仓库改好

## 许可

仅供学习交流，图像与数据版权归原游戏及数据提供方所有。