# 🎨 AI Daily News UI 设计规范

## 🎯 设计原则

### 核心理念
**"Less is More"** - 极简设计服务于深度阅读体验

### 设计价值观
1. **专注内容** - 让新闻内容成为视觉中心
2. **减少干扰** - 最小化UI元素，最大化阅读空间
3. **夜间友好** - 深色主题保护视力
4. **直观操作** - 降低学习成本，提升使用效率

## 🎨 视觉设计系统

### 色彩体系
```scss
// 深色主题 (夜间模式)
$dark-bg-primary: #1a1a1a;      // 主背景色
$dark-bg-secondary: #2d2d2d;    // 次级背景色
$dark-text-primary: #e4e4e4;    // 主文字色
$dark-text-secondary: #a0a0a0;  // 次级文字色
$dark-accent: #6366f1;          // 强调色 (Indigo)

// 浅色主题 (日间模式)
$light-bg-primary: #ffffff;
$light-bg-secondary: #f8fafc;
$light-text-primary: #1e293b;
$light-text-secondary: #64748b;
$light-accent: #4f46e5;

// 状态色彩
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;
$info: #3b82f6;
```

### 字体系统
```scss
// 字体族
$font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-family-heading: 'Playfair Display', Georgia, serif;

// 字号层级
$text-xs: 0.75rem;    // 12px - 辅助文字
$text-sm: 0.875rem;   // 14px - 次要文字
$text-base: 1rem;     // 16px - 正文
$text-lg: 1.125rem;   // 18px - 标题
$text-xl: 1.25rem;    // 20px - 大标题
$text-2xl: 1.5rem;    // 24px - 主标题
$text-3xl: 1.875rem;  // 30px - 页眉标题

// 行高
$leading-tight: 1.25;
$leading-normal: 1.5;
$leading-relaxed: 1.75;
```

### 间距系统
```scss
$spacing-1: 0.25rem;   // 4px
$spacing-2: 0.5rem;    // 8px
$spacing-3: 0.75rem;   // 12px
$spacing-4: 1rem;      // 16px
$spacing-5: 1.25rem;   // 20px
$spacing-6: 1.5rem;    // 24px
$spacing-8: 2rem;      // 32px
$spacing-10: 2.5rem;   // 40px
$spacing-12: 3rem;     // 48px
```

## 📱 页面组件设计

### 1. 首页 (News Feed)
```
┌─────────────────────────────────────┐
│  🌙 AI Daily News                 ☰ │  ← 顶部导航栏
├─────────────────────────────────────┤
│  [科技] [财经] [社会] [娱乐] [更多]   │  ← 分类标签
├─────────────────────────────────────┤
│                                     │
│  📰 精选文章                        │
│  ================================   │
│  [图片] 文章标题                    │
│        摘要内容...                  │
│        来源 · 时间 · 阅读量         │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  📋 推荐列表                        │
│  • 文章标题1                       │
│  • 文章标题2                       │
│  • 文章标题3                       │
│                                     │
└─────────────────────────────────────┘
```

### 2. 文章详情页
```
┌─────────────────────────────────────┐
│  ← 返回    文章标题               ⋯ │  ← 顶栏
├─────────────────────────────────────┤
│                                     │
│  [文章主图]                         │
│                                     │
│  # 主标题                          │
│                                     │
│  发布时间 · 来源 · 阅读量           │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  正文内容...                        │
│  段落1                              │
│                                     │
│  段落2                              │
│                                     │
│  [相关推荐]                         │
│  • 相关文章1                       │
│  • 相关文章2                       │
│                                     │
└─────────────────────────────────────┘
```

### 3. 个人中心
```
┌─────────────────────────────────────┐
│  ← 返回    个人中心               ⚙ │
├─────────────────────────────────────┤
│                                     │
│  [头像] 用户名                     │
│        email@example.com            │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  📊 阅读统计                        │
│  今日阅读: 23篇                    │
│  累计时长: 45分钟                   │
│  偏好类别: 科技(40%) 财经(30%)      │
│                                     │
│  ────────────────────────────────   │
│                                     │
│  ⚙ 设置选项                         │
│  • 兴趣标签管理                    │
│  • 阅读偏好设置                    │
│  • 夜间模式切换                    │
│  • 账户安全设置                    │
│                                     │
└─────────────────────────────────────┘
```

## 🎯 交互设计规范

### 手势操作
- **左滑**：标记为已读/稍后阅读
- **右滑**：返回上一页
- **下拉**：刷新内容
- **长按**：显示操作菜单

### 动画效果
```css
/* 页面切换动画 */
.page-transition {
  transition: transform 0.3s ease-out;
}

/* 卡片悬停效果 */
.card-hover {
  transition: all 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

/* 加载动画 */
.loading-spinner {
  animation: spin 1s linear infinite;
}
```

### 响应式断点
```scss
$breakpoint-mobile: 480px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;
$breakpoint-wide: 1200px;
```

## 🎨 组件库规划

### 基础组件
- Button - 按钮组件
- Card - 卡片容器
- Typography - 文字组件
- Icon - 图标系统
- Loading - 加载状态

### 业务组件
- NewsCard - 新闻卡片
- CategoryTabs - 分类标签
- ReadingProgress - 阅读进度条
- DarkModeToggle - 深色模式切换
- UserProfile - 用户信息展示

## 📐 设计稿交付

### 设计工具
- Figma (主要设计)
- Zeplin (开发交付)
- Principle (交互动效)

### 设计资产
- 设计系统文档
- 组件库源文件
- 交互原型
- 设计规范手册
```