# CloudFlare Workers 部署指南

本指南将帮助您将 Grok API 代理部署到 CloudFlare Workers，并配置自定义域名。

## 前提条件

1. 一个 CloudFlare 账户
2. 一个已在 CloudFlare 上管理的域名
3. Node.js 和 npm 已安装（用于 Wrangler CLI）

## 步骤 1：安装 Wrangler CLI

Wrangler 是 CloudFlare 的命令行工具，用于部署和管理 Workers。

```bash
npm install -g wrangler
```

## 步骤 2：登录到 CloudFlare

```bash
wrangler login
```

这将打开浏览器窗口，要求您授权 Wrangler 访问您的 CloudFlare 账户。

## 步骤 3：配置 wrangler.toml

编辑 `deploy-deno/wrangler.toml` 文件，配置您的自定义域名：

```toml
name = "grok-api-proxy"
main = "grok-api-proxy.ts"
compatibility_date = "2023-12-01"

# 配置您的自定义域名路由
routes = [
  { pattern = "api-grok.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

将 `yourdomain.com` 替换为您的实际域名，将 `api-grok` 替换为您想要的子域名。

## 步骤 4：部署 Worker

```bash
cd deploy-deno
wrangler deploy
```

## 步骤 5：配置 DNS

在 CloudFlare 控制面板中，为您的子域名添加一个 CNAME 记录：

1. 登录到 CloudFlare 控制面板
2. 选择您的域名
3. 点击 "DNS" 选项卡
4. 添加一个新的 CNAME 记录：
   - 名称：`api-grok`（或您选择的子域名）
   - 目标：`your-worker.your-subdomain.workers.dev`（部署后 Wrangler 会显示这个地址）
   - 代理状态：已代理（橙色云图标）

## 步骤 6：测试您的代理

使用 curl 或其他工具测试您的代理：

```bash
curl -X POST https://api-grok.yourdomain.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_XAI_API_KEY" \
  -d '{
    "model": "grok-1",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ]
  }'
```

## 故障排除

### 问题：部署失败

- 确保您已登录到 Wrangler
- 检查 `wrangler.toml` 文件中的语法错误
- 尝试运行 `wrangler whoami` 确认您已正确登录

### 问题：DNS 配置问题

- 确保 CNAME 记录已正确设置
- 等待 DNS 传播（最多可能需要 24 小时，但通常只需几分钟）
- 确保 CloudFlare 代理已启用（橙色云图标）

### 问题：API 请求失败

- 确保您的 Xai API 密钥有效
- 检查请求格式是否正确
- 查看 CloudFlare Workers 日志以获取更多信息

## 高级配置

### 添加自定义域名

如果您想使用多个自定义域名，可以在 `wrangler.toml` 中添加多个路由：

```toml
routes = [
  { pattern = "api-grok.yourdomain.com/*", zone_name = "yourdomain.com" },
  { pattern = "grok-api.anotherdomain.com/*", zone_name = "anotherdomain.com" }
]
```

### 添加速率限制

CloudFlare 提供了速率限制功能，可以防止 API 滥用：

1. 在 CloudFlare 控制面板中，转到 "Security" > "WAF" > "Rate limiting rules"
2. 创建一个新规则，限制对您的 Worker 的请求数量

### 监控和分析

CloudFlare 提供了详细的分析和监控工具：

1. 在 CloudFlare 控制面板中，转到 "Analytics" > "Workers"
2. 查看您的 Worker 的请求数量、CPU 使用情况和错误率

## 重要说明

- 此代理不在本地存储任何信息，它只是将请求转发到 Xai API 端点
- 所有认证和授权都由 Xai API 处理，您需要在请求中包含有效的 API 密钥
- 此代理不会修改请求或响应的内容，它只是简单地转发它们
