# 项目说明

## 项目目标

在空仓内从零实现一个简单的用户管理系统后端服务，满足以下能力：

- 创建用户
- 分页查询用户列表
- 查询用户详情
- 更新用户信息
- 软删除用户

## 项目结构说明

```text
src/
├─ modules/
│  └─ users/
│     ├─ user.controller.ts
│     ├─ user.repository.ts
│     ├─ user.route.ts
│     ├─ user.service.ts
│     ├─ user.types.ts
│     └─ user.validation.ts
└─ shared/
   ├─ config/
   ├─ db/
   ├─ errors/
   ├─ middleware/
   ├─ swagger/
   └─ utils/
```

## 模块职责

- `controller`：处理请求和响应
- `service`：承接业务逻辑和异常语义
- `repository`：负责 MySQL 数据读写
- `validation`：负责请求参数校验
- `shared`：通用配置、数据库连接、错误处理中间件、Swagger 配置

## 任务拆解

1. 初始化 Node.js + TypeScript 项目
2. 接入 Express、MySQL、Zod、Swagger
3. 设计用户表并输出 SQL 文件
4. 实现 5 个核心接口
5. 补充 README、接口示例和 AI 使用说明
6. 使用 `pnpm` 进行本地构建验证

## AI 如何协助

- 辅助明确交付边界和最小可运行方案
- 生成基础项目结构和样板代码
- 协助整理接口设计、SQL 初始化脚本和 Swagger 文档
- 协助归纳 README 与交付说明

## 本次验证

- 已执行 `pnpm install`
- 已执行 `pnpm build`
- 已完成应用启动级自检，确认服务可正常创建并监听端口
- 可继续通过 Swagger 和 curl 完成数据库相关手工接口验证

## 开发约定

- 采用轻量分层结构，避免过度设计
- 删除操作使用软删除
- 统一响应结构为 `code + message + data`
- 统一错误处理为 `400/404/409/500`
