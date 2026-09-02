# 华医安 HUAYIAN CARE TRIP 国际患者服务网站

华医安面向国际患者协调来华计划性医疗，连接医院评估、医疗翻译、在华行程与返程交接。

在线地址：<https://beidaomitu233.github.io/carechina-prototype/>

## 发布结构

这是一个只包含可发布网站内容的静态仓库。仓库根目录就是网站根目录，无需安装依赖、编译或复制到 `dist/`：

- `index.html`：首页
- `hospitals.html`：医院目录
- `treatments.html` / `treatment.html`：医疗方向目录与详情
- `process.html`：六步诊疗流程
- `cases.html` / `case.html`：就医案例列表与详情
- `guide.html`：患者指南
- `tcm-wellness.html`：中医调养
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

华医安提供计划性医疗协调，不提供医疗诊断或急救。医院接诊、治疗方案、疗程与费用以医院评估和实际诊疗为准。医院官网图片与公开案例在商业使用前需确认授权。

## 数据口径

医院目录包含 103 家医院、22 座城市和 14 个专科方向。医院排名、病例量、国际服务和专科能力描述来自历史研究资料，展示为能力参考，不等同于当前合作关系或平台推荐。正式上线前应逐家通过医院官网或院方联系人复核，并完成 Logo、实景图片和案例图片的商业使用授权。

视觉与交互规范见 [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)。
