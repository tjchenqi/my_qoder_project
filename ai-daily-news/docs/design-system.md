# 🎨 AI Daily News 设计系统文档

## 📋 文档概览

**项目名称**：AI Daily News 小程序  
**设计版本**：v2.0 高保真版  
**更新日期**：2024年3月12日  
**设计风格**：Apple News+ 杂志风格  
**目标平台**：微信小程序  

---

## 🎯 设计理念

### 核心价值
**"专业、简洁、沉浸式的AI行业日报阅读体验"**

### 设计原则
1. **内容为王** - 最大化内容展示空间，最小化UI干扰
2. **期刊化运营** - 每日一期的仪式感和期待感
3. **垂直深耕** - 聚焦AI领域，提供专业深度内容
4. **社交传播** - 便捷的分享机制，扩大影响力

---

## 🎨 视觉设计规范

### 色彩体系

#### 主色调
```scss
// 品牌主色
$primary: #4f46e5;        // Indigo-600
$primary-dark: #4338ca;   // Indigo-700
$primary-light: #818cf8;  // Indigo-400

// 辅助色彩
$secondary: #7c3aed;      // Violet-600
$accent: #0ea5e9;         // Sky-500
$success: #10b981;        // Emerald-500
```

#### 背景色系
```scss
// 深色主题
$dark-bg-primary: #1a1a1a;
$dark-bg-secondary: #2d2d2d;
$dark-bg-card: #252525;

// 浅色主题
$light-bg-primary: #ffffff;
$light-bg-secondary: #f8fafc;
$light-bg-card: #ffffff;
```

#### 文字色彩
```scss
// 深色主题文字
$dark-text-primary: #e4e4e4;
$dark-text-secondary: #a0a0a0;
$dark-text-muted: #717171;

// 浅色主题文字
$light-text-primary: #1e293b;
$light-text-secondary: #64748b;
$light-text-muted: #94a3b8;
```

### 字体系统

#### 字体家族
```css
font-family: {
  base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  heading: 'Inter', Georgia, serif;
  mono: 'SF Mono', Monaco, 'Courier New', monospace;
}
```

#### 字号层级
```scss
$font-size: {
  xs: 12px;    // 辅助文字
  sm: 14px;    // 次要文字
  base: 16px;  // 正文
  lg: 18px;    // 小标题
  xl: 20px;    // 标题
  '2xl': 24px; // 大标题
  '3xl': 30px; // 主标题
  '4xl': 36px; // 页眉标题
}
```

### 间距系统
```scss
$spacing: {
  '1': 4px;
  '2': 8px;
  '3': 12px;
  '4': 16px;
  '5': 20px;
  '6': 24px;
  '8': 32px;
  '10': 40px;
  '12': 48px;
  '16': 64px;
}
```

---

## 📱 组件设计库

### 1. 导航组件

#### 顶部导航栏
```jsx
// 设计规范
height: 56px;
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(10px);
border-bottom: 1px solid #e5e7eb;

// 组件结构
<header className="navbar">
  <div className="logo">AI Daily News</div>
  <div className="nav-actions">
    <CalendarIcon />
    <SearchIcon />
  </div>
</header>
```

#### 底部导航栏
```jsx
// 设计规范
height: 60px;
background: white;
border-top: 1px solid #e5e7eb;

// 组件结构
<nav className="bottom-nav">
  <NavItem icon={<HomeIcon />} label="首页" active />
  <NavItem icon={<SearchIcon />} label="搜索" />
  <NavItem icon={<BookmarkIcon />} label="收藏" />
  <NavItem icon={<UserIcon />} label="我的" />
</nav>
```

### 2. 内容卡片组件

#### 精选头条卡片
```jsx
// 设计规范
border-radius: 16px;
background: linear-gradient(135deg, #4f46e5, #7c3aed);
color: white;
padding: 24px;

// 组件结构
<div className="featured-card">
  <CategoryTag>技术前沿</CategoryTag>
  <h3 className="featured-title">文章标题</h3>
  <p className="featured-excerpt">文章摘要...</p>
  <div className="featured-meta">
    <SourceInfo />
    <ReadStats />
  </div>
</div>
```

#### 普通新闻卡片
```jsx
// 设计规范
border-radius: 12px;
background: white;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
padding: 16px;

// 组件结构
<article className="news-card">
  <div className="news-header">
    <CategoryBadge />
    <MetaInfo />
  </div>
  <h4 className="news-title">文章标题</h4>
  <SummaryText />
</article>
```

### 3. 轮播组件

#### 自动轮播器
```jsx
// 设计规范
height: 200px;
border-radius: 16px;
overflow: hidden;

// 交互规范
- 自动播放间隔：5秒
- 手势滑动支持
- 底部指示器
- 循环播放

// 组件结构
<div className="carousel-container">
  <CarouselSlides />
  <CarouselIndicators />
</div>
```

### 4. 搜索组件

#### 搜索栏
```jsx
// 设计规范
height: 44px;
border-radius: 22px;
background: #f3f4f6;
padding: 0 16px;

// 组件结构
<div className="search-bar">
  <SearchIcon />
  <input placeholder="搜索日报内容..." />
</div>
```

---

## 📐 页面布局规范

### 1. 首页布局

```css
/* 整体结构 */
.homepage {
  min-height: 100vh;
  background: #f8fafc;
}

/* 内容区域 */
.content-area {
  padding: 0 16px 80px 16px; /* 底部留出导航栏空间 */
}

/* 各区块间距 */
.section-spacing {
  margin-bottom: 32px;
}
```

### 2. 详情页布局

```css
.detail-page {
  background: white;
}

.article-header {
  padding: 24px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.article-content {
  padding: 24px 16px;
  line-height: 1.7;
}

.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  border-top: 1px solid #e5e7eb;
}
```

---

## 🎯 交互设计规范

### 手势操作
```javascript
// 滑动手势
- 左右滑动：切换轮播内容
- 上下滑动：滚动页面
- 长按：显示操作菜单

// 点击反馈
- 按钮：0.2s 颜色变化
- 卡片：轻微上浮效果
- 链接：下划线显示
```

### 动画效果
```css
/* 页面切换 */
.page-transition {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 卡片悬停 */
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

---

## 📱 响应式设计

### 断点设置
```scss
$breakpoints: {
  mobile: 320px,
  mobile-large: 414px,
  tablet: 768px,
  desktop: 1024px
}
```

### 适配策略
```css
/* 手机竖屏 */
@media (max-width: 414px) {
  .container { max-width: 100%; }
  .grid { grid-template-columns: 1fr; }
}

/* 手机横屏 */
@media (min-width: 415px) and (max-width: 767px) {
  .container { max-width: 600px; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}
```

---

## 🎨 设计资产

### 图标系统
```javascript
// 主要图标集合
- HomeIcon: 首页
- SearchIcon: 搜索  
- BookmarkIcon: 收藏
- UserIcon: 用户
- CalendarIcon: 日历
- ShareIcon: 分享
- HeartIcon: 点赞
- MoreIcon: 更多
```

### 插图规范
```css
// 插图风格
- 扁平化设计
- 线性图标为主
- 色彩统一
- 简洁明了
```

---

## 📤 输出规范

### 设计稿交付
- **格式**：Figma 源文件 + PDF导出
- **分辨率**：iPhone标准尺寸 (375×812px)
- **标注**：完整的尺寸、颜色、字体标注
- **交互说明**：详细的动效和交互规范

### 开发交付
- **设计令牌**：完整的CSS变量系统
- **组件库**：React组件代码
- **样式指南**：详细的使用文档
- **测试用例**：各组件的测试场景

---

## 🔧 维护更新

### 版本控制
- **主版本**：重大设计变更
- **次版本**：新增组件或功能
- **修订版**：Bug修复和优化

### 更新频率
- **季度评审**：整体设计方向调整
- **月度迭代**：组件优化和新增
- **即时修复**：紧急问题处理

---

*本文档由 AI Daily News 设计团队维护*
*最后更新：2024年3月12日*