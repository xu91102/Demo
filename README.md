# User Management Service

一个基于 `Node.js + Express + TypeScript + MySQL` 的轻量用户管理系统后端服务，支持创建用户、分页查询、查询详情、更新用户、软删除用户，并提供 Swagger 接口文档。

## 功能列表

- 创建用户
- 分页查询用户列表
- 查询用户详情
- 更新用户信息
- 软删除用户
- Swagger 在线接口文档

## 环境要求

- Node.js 20+
- pnpm 10+
- MySQL 8+

## 项目结构

```text
.
├─ sql/
│  └─ init.sql
├─ src/
│  ├─ modules/users/
│  └─ shared/
├─ .env.example
├─ agents.md
├─ package.json
└─ README.md
```

## 本地启动

1. 安装依赖

```bash
pnpm install
```

2. 初始化数据库

执行 `sql/init.sql` 创建数据库和数据表。

3. 配置环境变量

复制 `.env.example` 为 `.env`，然后根据本地 MySQL 配置修改：

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=user_management_db
```

4. 启动开发服务

```bash
pnpm dev
```

5. 编译生产代码

```bash
pnpm build
```

6. 启动生产服务

```bash
pnpm start
```

## 接口文档

- Swagger 地址：`http://localhost:3000/api-docs`
- 健康检查：`GET http://localhost:3000/health`

## 接口验证示例

### 1. 创建用户

```bash
curl -X POST "http://localhost:3000/api/users" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"alice\",\"email\":\"alice@example.com\",\"nickname\":\"Alice\",\"phone\":\"13800138000\",\"status\":1}"
```

### 2. 查询用户列表

```bash
curl "http://localhost:3000/api/users?page=1&pageSize=10&keyword=ali"
```

### 3. 查询用户详情

```bash
curl "http://localhost:3000/api/users/1"
```

### 4. 更新用户

```bash
curl -X PUT "http://localhost:3000/api/users/1" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"alice.updated@example.com\",\"nickname\":\"Alice Updated\",\"status\":1}"
```

### 5. 删除用户（软删除）

```bash
curl -X DELETE "http://localhost:3000/api/users/1"
```

## 返回结构

成功响应统一格式：

```json
{
  "code": 200,
  "message": "Users fetched successfully",
  "data": {}
}
```

列表接口 `data` 示例：

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## 软删除说明

- 删除接口不会物理删除数据
- 仅将 `deleted_at` 更新为当前时间
- 列表查询和详情查询默认过滤已删除用户

## AI 工具与模型说明

- AI 工具：Codex
- 使用模型：GPT-5
- AI 参与环节：
  - 代码生成与整理
  - Swagger 文档与 README 编写
  - 本地构建验证辅助

## 可选验证清单

- 创建用户成功
- 重复用户名或邮箱返回 `409`
- 分页列表返回正确的 `items` 和 `pagination`
- 用户详情返回正确数据
- 更新用户后字段发生变化
- 软删除后列表不再出现该用户，详情返回 `404`
