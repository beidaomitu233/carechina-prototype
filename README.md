# CareChina 国际患者服务原型

CareChina 是面向计划性来华医疗的国际患者协调服务原型。当前仓库保留两个可比较版本：

- `v02`：视觉设计基线，强调大图、少文字、真实医院场景和统一医疗绿色。
- `v03`：患者决策链版本，在 v02 设计语言上重组“是否适合来华—服务流程—医院匹配—案例—预约、费用与时间”。

默认页面位于 `设计稿/index.html`。GitHub Pages 通过 `.github/workflows/pages.yml` 自动部署 `设计稿` 目录，推送到 `main` 后会更新在线原型。

## 本地查看

直接打开 `设计稿/index.html`，或运行：

```powershell
node 设计稿/qa/serve-static.js
```

然后访问 `http://127.0.0.1:4173/`。

## 版本切换

```powershell
git switch --detach v02
git switch --detach v03
```

返回最新开发版本：

```powershell
git switch main
```

## 重要说明

这是用于产品和设计评审的静态原型，不提供医疗诊断、急救、医院接诊保证或正式费用报价。医院官网图片与公开案例当前仅用于内部原型研究；正式商业发布前必须确认图片、病例与品牌素材授权。
