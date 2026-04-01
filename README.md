# AI 热点追踪平台 - 前端项目

## 技术栈

- **框架**: Nuxt.js 3 (Vue 3)
- **语言**: TypeScript 5.x
- **UI**: Tailwind CSS + shadcn/ui
- **状态管理**: Pinia
- **HTTP**: Axios + Nuxt Fetch
- **构建工具**: Vite

## 项目结构

```
hot-ai-frontend/
├── app/
│   ├── (public)/           # 公开页面
│   │   ├── page.tsx        # 首页
│   │   ├── articles/       # 文章列表/详情
│   │   ├── professions/    # 职业列表/详情
│   │   ├── learning-paths/ # 学习路径
│   │   └── tools/          # 工具库
│   ├── admin/              # 管理后台
│   ├── components/         # 组件
│   ├── composables/        # 组合式函数
│   ├── layouts/            # 布局
│   └── public/             # 静态资源
├── assets/
│   └── css/
├── components/
│   ├── ui/                 # UI 组件
│   ├── article/            # 文章相关组件
│   ├── profession/         # 职业相关组件
│   └── layout/             # 布局组件
├── composables/
│   ├── useArticle.ts       # 文章相关逻辑
│   ├── useProfession.ts    # 职业相关逻辑
│   └── useAuth.ts          # 认证逻辑
├── stores/
│   ├── article.ts          # 文章状态
│   ├── profession.ts       # 职业状态
│   └── user.ts             # 用户状态
├── lib/
│   ├── api.ts              # API 客户端
│   └── utils.ts            # 工具函数
└── public/
    └── images/
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

### 3. 构建生产版本

```bash
pnpm build
```

### 4. 预览生产构建

```bash
pnpm preview
```

## 环境配置

复制 `.env.example` 到 `.env.local`：

```bash
cp .env.example .env.local
```

配置环境变量：

```env
# API 地址
NUXT_PUBLIC_API_URL=http://192.168.40.15:8000/api

# 站点配置
NUXT_SITE_NAME=HOU-AI 热点追踪平台
NUXT_SITE_DESCRIPTION=AI 时代的职业导航仪
```

## 功能模块

### 第一期
- ✅ 资讯列表页
- ✅ 资讯详情页
- ✅ 职业列表页
- ✅ 职业详情页
- ✅ SSE 实时推送

### 第二期
- ⏳ 搜索功能
- ⏳ 学习路径
- ⏳ 工具库
- ⏳ 用户系统

### 第三期
- ⏳ 管理后台
- ⏳ 个人中心
- ⏳ 收藏功能

## 代码规范

- ESLint + Prettier
- TypeScript 严格模式
- Vue 3 Composition API

## 部署

前端项目部署到 Vercel：

```bash
pnpm vercel
```

或者使用 Docker 部署：

```bash
docker build -t hot-ai-frontend .
docker run -p 3000:3000 hot-ai-frontend
```

## API 对接

后端 API 地址：http://192.168.40.15:8000/api

主要接口：
- `GET /api/v1/articles` - 获取文章列表
- `GET /api/v1/articles/:id` - 获取文章详情
- `GET /api/v1/professions` - 获取职业列表
- `GET /api/v1/professions/:id` - 获取职业详情
- `GET /api/v1/stream` - SSE 实时推送

## 许可证

MIT License
