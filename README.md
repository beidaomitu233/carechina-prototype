# CareChina 国际患者服务网站

CareChina 是面向计划性来华医疗的国际患者协调服务原型。

在线地址：<https://beidaomitu233.github.io/carechina-prototype/>

## 网站结构

仓库根目录就是可发布的网站目录，无需构建：

- `index.html`：首页
- `hospitals.html`：医院目录
- `care-plan.html`：诊疗路径
- `cost-estimate.html`：费用估算
- `tcm-wellness.html`：中医调养
- `consultation.html`：咨询说明
- `assets/`：公共样式、脚本和图片

设计过程、参考资料和本地 QA 工具保留在开发电脑中，并通过 `.gitignore` 排除，不会上传到 GitHub。

## 部署

任何静态托管平台均可直接选择仓库根目录作为发布目录，不需要安装依赖或填写构建命令。

GitHub Pages 由 `.github/workflows/pages.yml` 自动部署。推送到 `main` 后会自动发布根目录中的最新网站。

## 本地查看

在仓库根目录运行任意静态服务器，例如：

```powershell
python -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/`。

## 重要说明

这是用于产品和设计评审的静态原型，不提供医疗诊断、急救、医院接诊保证或正式费用报价。医院官网图片与公开案例在正式商业发布前仍需确认授权。
