# 🎨 高保真原型组件库

## 组件清单

### 1. 核心页面组件

#### DailyIssueHomepage.tsx
```tsx
// 期刊首页 - 主要展示页面
// 包含：轮播头条、速递列表、个性化推荐
// 特色：期刊化布局、自动轮播、分类展示
```

#### ArticleDetail.tsx  
```tsx
// 文章详情页
// 包含：封面图、标题、正文、标签
// 特色：杂志化排版、沉浸式阅读体验
```

#### SearchHistoryPage.tsx
```tsx
// 搜索历史页
// 包含：搜索框、日期筛选、历史归档
// 特色：时间轴展示、快速定位
```

#### SharePoster.tsx
```tsx
// 分享海报生成器
// 包含：Canvas绘图、二维码生成
// 特色：自动生成精美分享图
```

### 2. 基础UI组件

#### Button.tsx
```tsx
// 按钮组件 - 支持多种变体
// variant: primary | secondary | outline | ghost
// size: sm | md | lg
```

#### Card.tsx
```tsx
// 卡片容器 - 统一的内容包装
// 支持悬停效果、边框、阴影
```

#### Carousel.tsx
```tsx
// 轮播组件 - 自动播放 + 手势支持
// 支持指示器、循环播放、自定义间隔
```

### 3. 业务组件

#### NewsCard.tsx
```tsx
// 新闻卡片 - 核心内容展示组件
// 支持多种样式：featured | default | compact
```

#### CategoryTabs.tsx
```tsx
// 分类标签 - 内容筛选组件
// 支持选中状态、滚动、自适应宽度
```

#### ReadingProgress.tsx
```tsx
// 阅读进度条 - 用户阅读行为追踪
// 实时显示阅读进度百分比
```

## 设计实现要点

### 1. 杂志化布局
```css
.magazine-layout {
  /* 大量留白创造呼吸感 */
  padding: 24px 16px;
  
  /* 层次分明的内容分区 */
  .section-title {
    margin-bottom: 24px;
    font-weight: 600;
  }
  
  /* 优雅的排版节奏 */
  .content-block {
    margin-bottom: 32px;
  }
}
```

### 2. 沉浸式阅读
```css
.immersive-reading {
  /* 最大化内容区域 */
  .content-area {
    min-height: 80vh;
  }
  
  /* 减少视觉干扰 */
  .minimal-ui {
    opacity: 0.8;
    transition: opacity 0.3s;
  }
  
  /* 舒适的行高和字间距 */
  .readable-text {
    line-height: 1.7;
    letter-spacing: 0.3px;
  }
}
```

### 3. 期刊化运营
```css
.journal-style {
  /* 明确的期号标识 */
  .issue-number {
    color: #6b7280;
    font-size: 14px;
  }
  
  /* 时间戳强化 */
  .publish-date {
    font-weight: 600;
    color: #1f2937;
  }
  
  /* 仪式感的分割线 */
  .section-divider {
    border: none;
    height: 1px;
    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
    margin: 32px 0;
  }
}
```

## 交互规范

### 1. 手势操作
```javascript
// 轮播手势支持
const handleTouch = {
  start: (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  },
  
  end: (e) => {
    const deltaX = startX - e.changedTouches[0].clientX;
    const deltaY = startY - e.changedTouches[0].clientY;
    
    // 判断是否为水平滑动
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      deltaX > 0 ? nextSlide() : prevSlide();
    }
  }
};
```

### 2. 动效时序
```css
.animation-timing {
  /* 快速反馈 */
  .interactive-feedback {
    transition: all 0.2s ease;
  }
  
  /* 优雅入场 */
  .page-enter {
    animation: fadeInUp 0.5s ease-out;
  }
  
  /* 平滑过渡 */
  .content-transition {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
```

## 性能优化要点

### 1. 渲染优化
```javascript
// 虚拟滚动实现
const VirtualList = ({ items, itemHeight, renderItem }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  
  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      {items.slice(visibleRange.start, visibleRange.end).map(renderItem)}
    </div>
  );
};
```

### 2. 图片优化
```javascript
// 懒加载 + 渐进式加载
const LazyImage = ({ src, alt, placeholder }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="image-container">
      {!loaded && <div className="placeholder">{placeholder}</div>}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={loaded ? 'loaded' : 'loading'}
      />
    </div>
  );
};
```

## 可访问性规范

### 1. 键盘导航
```jsx
// 焦点管理
const FocusableCard = ({ children, onClick }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  };
  
  return (
    <div 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
```

### 2. 屏幕阅读器支持
```jsx
// 语义化标签
<article aria-labelledby="article-title">
  <h2 id="article-title">文章标题</h2>
  <div role="contentinfo">
    <time dateTime={publishDate}>{formatDate(publishDate)}</time>
  </div>
</article>
```

## 测试用例

### 1. 组件测试
```javascript
// 单元测试示例
describe('NewsCard', () => {
  it('should render title correctly', () => {
    const { getByText } = render(<NewsCard title="测试标题" />);
    expect(getByText('测试标题')).toBeInTheDocument();
  });
  
  it('should handle click events', () => {
    const mockClick = jest.fn();
    const { getByRole } = render(<NewsCard onClick={mockClick} />);
    fireEvent.click(getByRole('button'));
    expect(mockClick).toHaveBeenCalled();
  });
});
```

### 2. 交互测试
```javascript
// 端到端测试
test('carousel swipe gesture', async () => {
  await page.goto('/homepage');
  await page.touchstart('.carousel');
  await page.touchmove('.carousel', { x: -100 });
  await page.touchend('.carousel');
  
  expect(await page.textContent('.active-slide h3'))
    .toContain('第二篇文章标题');
});
```

---
*此文档包含完整的高保真原型实现细节*
*可用于开发团队的技术实现参考*