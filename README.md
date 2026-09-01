# CareChina 国际患者服务网站

CareChina 是面向计划性来华医疗的国际患者协调服务原型。

在线地址：<https://beidaomitu233.github.io/carechina-prototype/>

## 发布结构

这是一个只包含可发布网站内容的静态仓库。仓库根目录就是网站根目录，无需安装依赖、编译或复制到 `dist/`：

- `index.html`：首页
- `hospitals.html`：医院目录
- `care-plan.html`：诊疗路径
- `cost-estimate.html`：费用估算
- `tcm-wellness.html`：中医调养
- `consultation.html`：咨询说明
- `assets/`：公共样式、脚本和图片
- `.github/workflows/pages.yml`：GitHub Pages 自动发布配置
- `.nojekyll`：让 GitHub Pages 按原始静态文件发布

设计过程、调研资料、截图、本地 QA 工具及临时文件只保留在开发电脑中。`.gitignore` 采用发布白名单：默认忽略所有内容，仅放行根目录 HTML、`assets/` 和必要的 GitHub 配置，避免后续误上传。

## 部署

任何静态托管平台均可直接选择仓库根目录作为发布目录：

- 构建命令：留空
- 发布目录：`.`（仓库根目录）
- 入口文件：`index.html`

GitHub Pages 由 `.github/workflows/pages.yml` 自动部署。推送到 `main` 后会自动发布根目录中的最新网站。

如果在其他平台连接本仓库，只需启用“跟随 `main` 分支自动部署”，无需改变目录结构。

## 本地查看

在仓库根目录运行任意静态服务器，例如：

```powershell
python -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/`。

## 重要说明

这是用于产品和设计评审的静态原型，不提供医疗诊断、急救、医院接诊保证或正式费用报价。医院官网图片与公开案例在正式商业发布前仍需确认授权。
