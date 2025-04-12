# Grok API Transform

A proxy service for forwarding requests to the Xai API (Grok) through custom domains using Deno and CloudFlare Workers.

## Documentation

- [English Documentation](./docs/README-EN.md)
- [中文文档](./docs/README-CN.md)

## Overview

This project provides a simple proxy that forwards API requests from your custom domain to the Xai API endpoint at `https://api.xai.com/v1/chat/completions`. It allows you to use Grok's API through your own domain without enforcing specific model configurations, giving you the flexibility to configure models in your local chat software.

**IMPORTANT NOTE**: This proxy does not store any information locally. It only forwards requests to the Xai API endpoint and returns the response. All authentication and authorization are handled by the Xai API, and you need to include a valid API key in your requests.

## Deployment Guides

- [CloudFlare Deployment Guide (English)](./docs/CLOUDFLARE-DEPLOYMENT-EN.md)
- [CloudFlare 部署指南 (中文)](./docs/CLOUDFLARE-DEPLOYMENT.md)

## Quick Start

See the documentation in your preferred language for detailed instructions on deployment and usage.
