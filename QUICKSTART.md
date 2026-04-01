# 🚀 快速启动指南

## 第一步：安装依赖

```bash
pnpm install
```

如果遇到问题，可以尝试删除 `node_modules` 和 `package-lock.json` 后重新安装：

```bash
rm -rf node_modules package-lock.json
pnpm install
```

## 第二步：配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
echo "NUXT_PUBLIC_API_URL=http://192.168.40.15:8000/api" > .env.local
```

或者手动创建文件并添加内容：

```env
NUXT_PUBLIC_API_URL=http://192.168.40.15:8000/api
NUXT_SITE_NAME=HOT-AI 热点追踪平台
```

**重要**：确保后端服务运行在 `http://192.168.40.15:8000/api`

## 第三步：启动开发服务器

```bash
pnpm dev
```

启动成功后，访问：http://localhost:3000

## 第四步：测试 API

### 方式一：使用测试页面（推荐）

访问：http://localhost:3000/api-test

测试页面提供了完整的 API 测试功能：
1. ✅ 发送注册验证码
2. ✅ 用户注册
3. ✅ 用户登录
4. ✅ 获取用户信息
5. ✅ 用户登出

### 方式二：手动测试完整流程

#### 1. 注册账号

访问：http://localhost:3000/register

步骤：
- 输入昵称
- 输入邮箱地址
- 点击"获取验证码"（需要后端支持邮件发送）
- 输入收到的验证码
- 设置密码（至少 8 位）
- 确认密码
- 点击"注册"

#### 2. 登录

访问：http://localhost:3000/login

步骤：
- 输入注册的邮箱
- 输入密码
- 点击"登录"

#### 3. 查看个人中心

登录后访问：http://localhost:3000/profile

可以：
- 查看个人信息
- 修改个人资料
- 更新偏好设置
- 修改密码
- 退出登录

## 🔍 故障排查

### 问题 1：无法连接到后端 API

**症状**：API 调用失败，显示网络错误

**解决方案**：
1. 确认后端服务已启动
2. 检查后端服务是否运行在 `http://192.168.40.15:8000/api`
3. 检查 `.env.local` 文件中的 `NUXT_PUBLIC_API_URL` 配置
4. 重启开发服务器：`pnpm dev`

### 问题 2：TypeScript 类型错误

**症状**：IDE 显示大量 TypeScript 错误

**解决方案**：
```bash
# 让 Nuxt 重新生成类型定义
pnpm nuxt prepare

# 或者运行类型检查
pnpm typecheck
```

这些错误通常是正常的，Nuxt 会在运行时提供全局类型。

### 问题 3：页面 404

**症状**：访问某些页面显示 404

**解决方案**：
1. 清除浏览器缓存
2. 硬刷新页面（Ctrl+Shift+R）
3. 检查路由配置，Nuxt 基于文件系统自动生成路由

### 问题 4：认证状态丢失

**症状**：刷新页面后登录状态丢失

**解决方案**：
这是正常的，因为认证信息存储在 localStorage 中。确保：
1. 浏览器没有禁用 localStorage
2. 没有在无痕模式下运行
3. `useAuth.restoreAuth()` 在应用启动时被调用

## 📱 测试账号

如果后端提供了测试账号，可以直接使用测试账号登录。

如果没有，需要通过注册流程创建新账号。

## 🧪 完整的端到端测试流程

```
1. 访问 http://localhost:3000/register
   ↓
2. 输入测试邮箱，获取验证码
   ↓
3. 填写注册表单并提交
   ↓
4. 注册成功，跳转到登录页
   ↓
5. 使用刚注册的账号登录
   ↓
6. 登录成功，跳转到首页
   ↓
7. 访问个人中心查看信息
   ↓
8. 修改个人资料并保存
   ↓
9. 修改密码
   ↓
10. 退出登录
```

## 🛠️ 开发工具

### 浏览器开发者工具

打开 Network 面板可以看到：
- 所有 API 请求详情
- 请求头和响应头
- Request/Response Body

### Vue DevTools

安装 [Vue DevTools](https://devtools.vuejs.org/) 可以查看：
- 组件树
- Vuex/Pinia 状态
- 路由信息

### Nuxt DevTools

Nuxt 3 内置开发工具，访问：http://localhost:3000/__nuxt_devtools__

可以查看：
- 路由列表
- 组件信息
- 运行时配置
- 性能分析

## 📖 相关文档

- [API 使用指南](./API_USAGE.md) - 详细的 API 使用说明
- [API 集成文档](./API_INTEGRATION.md) - 完整的集成说明
- [实现状态](./IMPLEMENTATION_STATUS.md) - 所有接口的实现情况

## 🆘 获取帮助

如果遇到问题：
1. 查看本文档的故障排查部分
2. 查看浏览器控制台的错误信息
3. 查看终端的运行日志
4. 参考 [Nuxt 3 文档](https://nuxt.com/docs)

## ✅ 验证清单

启动前检查：
- [ ] Node.js 版本 >= 18
- [ ] pnpm 已安装
- [ ] 后端服务已启动
- [ ] `.env.local` 文件已创建
- [ ] 环境变量配置正确

启动后验证：
- [ ] 开发服务器成功启动
- [ ] 可以访问 http://localhost:3000
- [ ] 可以访问 http://localhost:3000/api-test
- [ ] 可以访问 http://localhost:3000/login
- [ ] 可以访问 http://localhost:3000/register
- [ ] API 调用正常（无 CORS 错误）

## 🎉 开始使用

一切准备就绪后，就可以开始使用 Hot AI 前端应用了！

祝你使用愉快！🚀
