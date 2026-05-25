# 管理后台重构实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重新设计管理后台，采用侧边栏 + 内容区布局，包含Dashboard、课程管理、工具管理、文章管理、职业管理、用户管理6个模块。

**Architecture:** 采用侧边栏固定 + 内容区切换模式。侧边栏组件独立，各内容模块独立组件。深色科技风格。

**Tech Stack:** Nuxt 3, Vue 3, TypeScript, TailwindCSS, Pinia, adminApi

---

## 文件结构

```
pages/admin/
├── index.vue                      # 主页面（改造）
├── layout.vue                     # 布局（改造）
└── components/
    └── AdminSidebar.vue           # 侧边栏组件（新建）

app/components/admin/
    ├── dashboard/
    │   └── DashboardContent.vue   # Dashboard内容
    ├── courses/
    │   └── CoursesContent.vue     # 课程管理内容
    ├── tools/
    │   └── ToolsContent.vue       # 工具管理内容
    ├── articles/
    │   └── ArticlesContent.vue    # 文章管理内容
    ├── professions/
    │   └── ProfessionsContent.vue # 职业管理内容
    └── users/
        └── UsersContent.vue        # 用户管理内容
```

---

## 实现任务

### Task 1: 创建AdminSidebar侧边栏组件

**Files:**
- Create: `app/components/admin/AdminSidebar.vue`

- [ ] **Step 1: 创建侧边栏组件**

```vue
<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <div class="logo">🔥 AI热点追踪平台</div>
      <div class="subtitle">管理后台</div>
    </div>
    <nav class="sidebar-nav">
      <NuxtLink
        v-for="item in navItems"
        :key="item.key"
        :to="item.path"
        class="nav-item"
        :class="{ active: activeKey === item.key }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
        <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
      </NuxtLink>
    </nav>
    <div class="sidebar-footer">
      <div class="user-info">
        <span class="user-avatar">👤</span>
        <span class="user-name">管理员</span>
      </div>
      <button class="logout-btn">退出</button>
    </div>
  </aside>
</template>
```

- [ ] **Step 2: 定义侧边栏样式（深色科技风）**

```css
.admin-sidebar {
  width: 240px;
  height: 100vh;
  background: #1a1a2e;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
}

.subtitle {
  font-size: 0.75rem;
  color: #808090;
  margin-top: 0.25rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: #c0c0cc;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.nav-item.active {
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  border-right: 3px solid #6366f1;
}

.nav-icon {
  font-size: 1.25rem;
}

.nav-badge {
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
```

- [ ] **Step 3: 定义props和emit**

```typescript
defineProps<{
  activeKey: string
  pendingTools?: number
  pendingArticles?: number
}>()

const emit = defineEmits<{
  (e: 'navigate', key: string): void
}>()
```

- [ ] **Step 4: 提交**

```bash
git add app/components/admin/AdminSidebar.vue
git commit -m "feat(admin): create AdminSidebar component

- Deep tech style with #1a1a2e background
- Fixed 240px width sidebar
- Navigation items with icons and badges
- Active state with indigo highlight
- User info and logout in footer

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: 改造pages/admin/layout.vue

**Files:**
- Modify: `pages/admin/layout.vue`

- [ ] **Step 1: 更新布局使用新侧边栏**

```vue
<template>
  <div class="flex min-h-screen" style="background: #1a1a2e;">
    <AdminSidebar
      :active-key="activeMenu"
      :pending-tools="pendingToolsCount"
      :pending-articles="pendingArticlesCount"
      @navigate="handleNavigate"
    />
    <main class="flex-1 p-8 overflow-auto" style="background: #1a1a2e; margin-left: 240px;">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const activeMenu = ref('dashboard')
const pendingToolsCount = ref(0)
const pendingArticlesCount = ref(0)

function handleNavigate(key: string) {
  activeMenu.value = key
}

// 获取待审核数量
async function fetchPendingCounts() {
  // TODO: 调用API获取待审核数量
}
</script>
```

- [ ] **Step 2: 提交**

```bash
git add pages/admin/layout.vue
git commit -m "refactor(admin): update layout to use new AdminSidebar

- Add pending counts props
- Handle navigate events
- Adjust main content margin for 240px sidebar

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: 创建Dashboard内容组件

**Files:**
- Create: `app/components/admin/dashboard/DashboardContent.vue`

- [ ] **Step 1: 创建Dashboard内容组件**

```vue
<template>
  <div class="dashboard-content">
    <h1 class="page-title">Dashboard</h1>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card" @click="$emit('navigate', 'courses')">
        <div class="stat-icon courses">
          <span>📚</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.courses }}</div>
          <div class="stat-label">课程总数</div>
        </div>
      </div>

      <div class="stat-card" @click="$emit('navigate', 'tools')">
        <div class="stat-icon tools">
          <span>🛠️</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.tools }}</div>
          <div class="stat-label">工具总数</div>
        </div>
      </div>

      <div class="stat-card" @click="$emit('navigate', 'articles')">
        <div class="stat-icon articles">
          <span>📝</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.articles }}</div>
          <div class="stat-label">文章总数</div>
        </div>
      </div>

      <div class="stat-card" @click="$emit('navigate', 'professions')">
        <div class="stat-icon professions">
          <span>💼</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.professions }}</div>
          <div class="stat-label">职业总数</div>
        </div>
      </div>
    </div>

    <!-- Pending Reviews -->
    <div class="pending-section">
      <h2 class="section-title">待审核</h2>
      <div class="pending-list">
        <div class="pending-item" @click="$emit('navigate', 'tools')">
          <span class="pending-icon">🛠️</span>
          <span class="pending-text">工具待审核</span>
          <span class="pending-count">{{ pending.tools }}</span>
        </div>
        <div class="pending-item" @click="$emit('navigate', 'articles')">
          <span class="pending-icon">📝</span>
          <span class="pending-text">文章待审核</span>
          <span class="pending-count">{{ pending.articles }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: 添加Dashboard样式**

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #25253a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.4);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.stat-icon.courses { background: rgba(99, 102, 241, 0.2); }
.stat-icon.tools { background: rgba(34, 197, 94, 0.2); }
.stat-icon.articles { background: rgba(245, 158, 11, 0.2); }
.stat-icon.professions { background: rgba(236, 72, 153, 0.2); }

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
}

.stat-label {
  font-size: 0.875rem;
  color: #808090;
}

.pending-section {
  background: #25253a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pending-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pending-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.pending-count {
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}
```

- [ ] **Step 3: 定义数据类型**

```typescript
defineProps<{
  stats: {
    courses: number
    tools: number
    articles: number
    professions: number
  }
  pending: {
    tools: number
    articles: number
  }
}>()

defineEmits<{
  (e: 'navigate', key: string): void
}>()
```

- [ ] **Step 4: 提交**

```bash
git add app/components/admin/dashboard/DashboardContent.vue
git commit -m "feat(admin): create DashboardContent component

- Stats grid with 4 cards (courses, tools, articles, professions)
- Pending reviews section with counts
- Click to navigate to corresponding module
- Deep tech style matching sidebar

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: 创建课程管理内容组件

**Files:**
- Create: `app/components/admin/courses/CoursesContent.vue`

**说明**: 复用现有的 `pages/admin/learning-paths/index.vue` 中的课程管理逻辑和样式，迁移为独立组件。

- [ ] **Step 1: 创建CoursesContent.vue组件**
- [ ] **Step 2: 迁移课程列表、搜索、筛选功能**
- [ ] **Step 3: 迁移创建/编辑课程弹窗**
- [ ] **Step 4: 迁移章节管理弹窗**
- [ ] **Step 5: 提交**

---

### Task 5: 创建工具管理内容组件

**Files:**
- Create: `app/components/admin/tools/ToolsContent.vue`

- [ ] **Step 1: 创建ToolsContent.vue组件**
- [ ] **Step 2: 实现工具列表（全部列表，包含已审核和待审核）**
- [ ] **Step 3: 实现搜索和状态筛选**
- [ ] **Step 4: 实现审核操作（通过/拒绝/要求修改）**
- [ ] **Step 5: 实现状态管理（上线/下线）**
- [ ] **Step 6: 提交**

---

### Task 6: 创建文章管理内容组件

**Files:**
- Create: `app/components/admin/articles/ArticlesContent.vue`

- [ ] **Step 1: 创建ArticlesContent.vue组件**
- [ ] **Step 2: 实现文章列表**
- [ ] **Step 3: 实现审核操作**
- [ ] **Step 4: 实现上下架管理**
- [ ] **Step 5: 提交**

---

### Task 7: 创建职业管理内容组件

**Files:**
- Create: `app/components/admin/professions/ProfessionsContent.vue`

- [ ] **Step 1: 创建ProfessionsContent.vue组件**
- [ ] **Step 2: 实现职业列表**
- [ ] **Step 3: 实现CRUD操作**
- [ ] **Step 4: 实现风险评估管理**
- [ ] **Step 5: 提交**

---

### Task 8: 创建用户管理内容组件

**Files:**
- Create: `app/components/admin/users/UsersContent.vue`

- [ ] **Step 1: 创建UsersContent.vue组件**
- [ ] **Step 2: 实现用户列表**
- [ ] **Step 3: 实现角色管理**
- [ ] **Step 4: 实现禁用/启用用户**
- [ ] **Step 5: 实现操作日志**
- [ ] **Step 6: 提交**

---

### Task 9: 改造pages/admin/index.vue为主页面

**Files:**
- Modify: `pages/admin/index.vue`

- [ ] **Step 1: 改造为主页面，使用侧边栏**

```vue
<template>
  <div class="admin-page">
    <!-- 根据activeMenu显示对应内容组件 -->
    <DashboardContent
      v-if="activeMenu === 'dashboard'"
      :stats="stats"
      :pending="pending"
      @navigate="activeMenu = $event"
    />
    <CoursesContent v-else-if="activeMenu === 'courses'" />
    <ToolsContent v-else-if="activeMenu === 'tools'" />
    <ArticlesContent v-else-if="activeMenu === 'articles'" />
    <ProfessionsContent v-else-if="activeMenu === 'professions'" />
    <UsersContent v-else-if="activeMenu === 'users'" />
  </div>
</template>
```

- [ ] **Step 2: 添加数据获取和状态管理**
- [ ] **Step 3: 提交**

---

### Task 10: 更新API接口

**Files:**
- Modify: `app/lib/api.ts`

- [ ] **Step 1: 添加文章管理admin接口**
- [ ] **Step 2: 添加职业管理admin接口**
- [ ] **Step 3: 添加用户管理接口**
- [ ] **Step 4: 提交**

---

## 依赖关系

```
Task 1 (AdminSidebar) ─┬─> Task 2 (layout.vue)
                       │
                       └─> Task 9 (index.vue)
                              │
                              ├── Task 3 (DashboardContent)
                              ├── Task 4 (CoursesContent)
                              ├── Task 5 (ToolsContent)
                              ├── Task 6 (ArticlesContent)
                              ├── Task 7 (ProfessionsContent)
                              └── Task 8 (UsersContent)
```

---

## 测试计划

1. 访问 `/admin` 验证侧边栏显示
2. 点击各导航项验证内容切换
3. Dashboard验证统计卡片和待审核数量显示
4. 课程管理验证CRUD和章节管理
5. 工具管理验证列表和审核操作
6. 文章管理验证列表和审核操作
7. 职业管理验证CRUD和风险评估
8. 用户管理验证用户列表和角色管理

---

**Plan complete.** Saved to `docs/superpowers/plans/2026-05-25-admin-redesign-plan.md`

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
