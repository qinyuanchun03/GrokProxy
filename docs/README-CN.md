# Grok API Transform - 中文文档

一个使用 Deno 和 CloudFlare Workers 通过自定义域名转发请求到 Xai API（Grok）的代理服务。

## 概述

本项目提供了一个简单的代理，将 API 请求从您的自定义域名转发到 Xai API 端点 `https://api.xai.com/v1/chat/completions`。它允许您通过自己的域名使用 Grok 的 API，而不强制执行特定的模型配置，使您能够在本地聊天软件中灵活配置模型。

## 特点

- 将请求从您的自定义域名转发到 Xai API
- 保留所有请求头和请求体
- 允许客户端模型配置
- 简单部署到 CloudFlare Workers
- 使用 TypeScript 为 Deno 编写

## 部署

### 前提条件

- CloudFlare 账户
- 安装 Wrangler CLI（`npm install -g wrangler`）
- 在 CloudFlare 中配置的自定义域名

### 部署到 CloudFlare Workers

1. 克隆此仓库：
   ```
   git clone https://github.com/yourusername/GrokAPITransform.git
   cd GrokAPITransform
   ```

2. 使用 Wrangler 部署：
   ```
   cd deploy-deno
   wrangler publish grok-api-proxy.ts
   ```

3. 在 CloudFlare 控制面板中配置您的自定义域名指向您的 worker。

### 本地开发

要在本地测试代理：

1. 安装 Deno：https://deno.land/manual/getting_started/installation

2. 运行本地开发服务器：
   ```
   cd deploy-deno
   deno run --allow-net local-dev.ts
   ```

3. 服务器将在 http://localhost:8000 启动

## 使用方法

部署后，您可以向您的自定义域名（例如 `https://api-grok.yourdomain.com/v1/chat/completions`）发送请求，这些请求将被转发到 Xai API。

示例请求：

```bash
curl -X POST https://api-grok.yourdomain.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_XAI_API_KEY" \
  -d '{
    "model": "grok-1",
    "messages": [
      {
        "role": "user",
        "content": "你好，你好吗？"
      }
    ]
  }'
```

## 配置

代理设计为简单透明，不修改地转发请求。不需要配置选项，因为目标是允许您的客户端应用程序处理所有模型配置。

## 许可证

[MIT 许可证](../LICENSE)
