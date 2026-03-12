import React, { useState } from 'react';
import { cn } from './utils/cn';

// 新闻数据类型
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl?: string;
  publishTime: string;
  source: string;
  readCount?: number;
  isFeatured?: boolean; // 新增：标记精选新闻
}

// 新闻卡片组件 props
interface NewsCardProps {
  news: NewsItem;
  variant?: 'default' | 'compact' | 'featured';
  onClick?: (news: NewsItem) => void;
}

// 新闻卡片组件
export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  variant = 'default',
  onClick,
}) => {
  const handleClick = () => {
    onClick?.(news);
  };

  if (variant === 'featured') {
    // 精选新闻样式（大卡片）
    return (
      <article
        className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleClick}
      >
        {news.imageUrl && (
          <div className="relative h-48 sm:h-56">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              {news.category}
            </span>
          </div>
        )}
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {news.title}
          </h2>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {news.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{news.source}</span>
            <span>{news.publishTime}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    // 紧凑样式（无图）
    return (
      <article
        className="bg-white border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleClick}
      >
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
            {news.category}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
              {news.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {news.summary}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{news.source}</span>
              <span>{news.publishTime}</span>
              {news.readCount && (
                <span>阅读 {news.readCount.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 默认样式（带缩略图）
  return (
    <article
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="flex gap-4 p-4">
        {news.imageUrl ? (
          <div className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">
              {news.category}
            </span>
          </div>
          
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
            {news.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {news.summary}
          </p>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{news.source}</span>
            <span>{news.publishTime}</span>
            {news.readCount && (
              <>
                <span>·</span>
                <span>阅读 {news.readCount.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

// 新闻列表组件 props
interface NewsListProps {
  newsList: NewsItem[];
  onNewsClick?: (news: NewsItem) => void;
  loading?: boolean;
  onLoadMore?: () => void;
}

// 新闻列表组件
export const NewsList: React.FC<NewsListProps> = ({
  newsList,
  onNewsClick,
  loading = false,
  onLoadMore,
}) => {
  if (newsList.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <p className="text-gray-500 text-lg">暂无新闻内容</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsList.map((news, index) => (
        <NewsCard
          key={news.id}
          news={news}
          variant={index === 0 ? 'featured' : index < 4 ? 'default' : 'compact'}
          onClick={onNewsClick}
        />
      ))}
      
      {loading && (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {!loading && onLoadMore && newsList.length > 0 && (
        <button
          onClick={onLoadMore}
          className="w-full py-3 text-center text-blue-600 font-medium hover:bg-blue-50 transition-colors rounded-lg border border-blue-200"
        >
          加载更多
        </button>
      )}
    </div>
  );
};

// 页面头部组件
interface NewsHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({
  title = '最新资讯',
  showBack = false,
  onBack,
}) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="返回"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="刷新"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

// 主页面组件
export const NewsPage: React.FC = () => {
  // 模拟数据
  const [newsList] = useState<NewsItem[]>([
    {
      id: '1',
      title: '科技创新驱动未来发展：人工智能技术取得重大突破',
      summary: '最新研究表明，人工智能在多个领域实现关键技术突破，为产业升级和经济发展注入新动能...',
      category: '科技',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
      publishTime: '10 分钟前',
      source: '科技日报',
      readCount: 12580,
      isFeatured: true, // 标记为精选新闻
    },
    {
      id: '2',
      title: '全球经济复苏态势良好，多国上调增长预期',
      summary: '随着各国经济刺激政策见效，世界经济呈现稳步复苏态势，国际组织纷纷上调年度增长预测...',
      category: '财经',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0b7b7d5f?w=400&h=300&fit=crop',
      publishTime: '25 分钟前',
      source: '财经网',
      readCount: 8934,
    },
    {
      id: '3',
      title: '环保新举措：城市绿化覆盖率再创新高',
      summary: '多地推出创新绿化方案，城市生态环境持续改善，居民生活质量显著提升...',
      category: '社会',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop',
      publishTime: '1 小时前',
      source: '人民日报',
      readCount: 15623,
    },
    {
      id: '4',
      title: '体育赛事精彩纷呈：国家队斩获多项冠军',
      summary: '在刚刚结束的国际赛事中，我国运动健儿表现出色，勇夺多枚金牌...',
      category: '体育',
      publishTime: '2 小时前',
      source: '体育周报',
      readCount: 21045,
    },
    {
      id: '5',
      title: '文化艺术活动丰富多彩，市民文化生活品质提升',
      summary: '各地博物馆、美术馆推出精彩展览，文化活动层出不穷，丰富群众精神文化生活...',
      category: '文化',
      publishTime: '3 小时前',
      source: '文化周刊',
      readCount: 6789,
    },
    {
      id: '6',
      title: '健康生活方式指南：专家建议养成这些好习惯',
      summary: '医学专家提出科学健康的生活建议，帮助公众改善亚健康状态，提高免疫力...',
      category: '健康',
      publishTime: '5 小时前',
      source: '健康时报',
      readCount: 18234,
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    setLoading(true);
    // 模拟加载
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleNewsClick = (news: NewsItem) => {
    console.log('点击新闻:', news.title);
    // 这里可以跳转到新闻详情页
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NewsHeader title="最新资讯" />
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* 分类标签 */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['全部', '科技', '财经', '社会', '体育', '文化', '健康'].map((category) => (
            <button
              key={category}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                category === '全部'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 新闻列表 */}
        <NewsList
          newsList={newsList}
          onNewsClick={handleNewsClick}
          loading={loading}
          onLoadMore={handleLoadMore}
        />
      </main>
    </div>
  );
};

export default NewsPage;
