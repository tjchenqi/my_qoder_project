import React, { useState } from 'react';
import { NewsCard } from './NewsCard';
import { Button } from './ui/Button';
import { useDarkMode } from '../theme';
import { cn } from '../utils/cn';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl?: string;
  publishTime: string;
  source: string;
  readCount?: number;
  isFeatured?: boolean;
}

export const NewsPage: React.FC = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // 模拟数据
  const newsData: NewsItem[] = [
    {
      id: '1',
      title: '人工智能技术在医疗领域取得重大突破',
      summary: '最新研究表明，AI辅助诊断系统在癌症早期筛查中展现出超越人类医生的准确率，为精准医疗带来革命性变革...',
      category: '科技',
      imageUrl: 'https://images.unsplash.com/photo-1576402187878-974f3ac91928?w=400&h=300&fit=crop',
      publishTime: '2小时前',
      source: '科技日报',
      readCount: 12580,
      isFeatured: true
    },
    {
      id: '2',
      title: '全球芯片短缺危机缓解，供应链逐步恢复正常',
      summary: '经过两年的紧张局势，全球半导体产业链开始显现复苏迹象，多家厂商宣布扩产计划，预计下半年供需关系将趋于平衡...',
      category: '财经',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
      publishTime: '4小时前',
      source: '财经网',
      readCount: 8934
    },
    {
      id: '3',
      title: '新能源汽车销量持续攀升，市场渗透率突破30%',
      summary: '最新数据显示，本月新能源汽车零售销量同比增长85%，市场份额首次超过传统燃油车，行业迎来发展新纪元...',
      category: '财经',
      publishTime: '6小时前',
      source: '汽车行业观察',
      readCount: 15623
    },
    {
      id: '4',
      title: '环保新规实施，企业绿色转型加速推进',
      summary: '新版环境保护条例正式生效，推动制造业向低碳环保方向转型，多家龙头企业率先公布碳中和时间表...',
      category: '社会',
      publishTime: '8小时前',
      source: '环保在线',
      readCount: 6789
    },
    {
      id: '5',
      title: '太空旅游商业化迈出重要一步，首批乘客即将启程',
      summary: '私人航天公司宣布将于下月执行首次商业太空旅行任务，标志着人类太空探索进入全新阶段...',
      category: '科技',
      publishTime: '10小时前',
      source: '太空探索杂志',
      readCount: 21045
    }
  ];

  const categories = ['全部', '科技', '财经', '社会', '娱乐', '体育', '健康'];

  const filteredNews = selectedCategory === '全部' 
    ? newsData 
    : newsData.filter(item => item.category === selectedCategory);

  const featuredNews = filteredNews.find(item => item.isFeatured) || filteredNews[0];
  const regularNews = filteredNews.filter(item => item.id !== featuredNews?.id);

  const handleNewsClick = (news: NewsItem) => {
    console.log('点击新闻:', news.title);
    // 这里可以跳转到新闻详情页
  };

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-300',
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    )}>
      {/* 顶部导航栏 */}
      <header className={cn(
        'sticky top-0 z-10 border-b backdrop-blur-md',
        isDark 
          ? 'border-gray-700 bg-gray-900/80' 
          : 'border-gray-200 bg-white/80'
      )}>
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">🌙 AI Daily News</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              aria-label="切换深色模式"
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* 分类标签 */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              className={cn(
                'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 精选文章 */}
        {featuredNews && (
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
              📰 精选推荐
            </h2>
            <NewsCard
              news={featuredNews}
              variant="featured"
              onClick={handleNewsClick}
            />
          </section>
        )}

        {/* 新闻列表 */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            📋 为你推荐
          </h2>
          <div className="space-y-4">
            {regularNews.map((news, index) => (
              <NewsCard
                key={news.id}
                news={news}
                variant={index < 2 ? 'default' : 'compact'}
                onClick={handleNewsClick}
              />
            ))}
          </div>
        </section>

        {/* 加载更多 */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className={isDark ? 'border-gray-600 text-gray-300' : ''}
          >
            加载更多
          </Button>
        </div>
      </main>
    </div>
  );
};