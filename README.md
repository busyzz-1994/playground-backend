# prisma-node

Node.js + TypeScript + Prisma + PostgreSQL 项目。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

如遇网络问题，可使用国内镜像：

```bash
npm install --registry=https://registry.npmmirror.com
```

### 2. 配置数据库连接

编辑 `.env` 文件，将连接字符串修改为你本地 PostgreSQL 的实际配置：

```env
DATABASE_URL="postgresql://用户名:密码@localhost:5432/数据库名?schema=public"
```

### 3. 初始化数据库

确保 PostgreSQL 已启动，然后运行迁移：

```bash
npm run db:migrate
```

### 4. 运行项目

```bash
npm run dev
```

## 常用命令

| 命令                  | 描述                                |
| --------------------- | ----------------------------------- |
| `npm run dev`         | 开发模式运行                        |
| `npm run build`       | 编译 TypeScript                     |
| `npm run start`       | 运行编译后的代码                    |
| `npm run db:migrate`  | 执行数据库迁移                      |
| `npm run db:generate` | 重新生成 Prisma Client              |
| `npm run db:studio`   | 打开 Prisma Studio 可视化管理数据库 |
| `npm run db:push`     | 直接同步 schema 到数据库（开发用）  |
