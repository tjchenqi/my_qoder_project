// AI Daily News 小程序高保真原型组件

// 1. 期刊首页组件
interface DailyIssueHomepageProps {
  currentIssue: {
    id: string;
    date: string;
    issueNumber: number;
    coverImage?: string;
  };
  featuredArticles: ArticlePreview[];
  quickUpdates: ArticlePreview[];
  personalizedRecommendations: ArticlePreview[];
  onArticleClick: (articleId: string) => void;
  onDateChange: (date: string) => void;
}

export const DailyIssueHomepage: React.FC<DailyIssueHomepageProps> = ({
  currentIssue,
  featuredArticles,
  quickUpdates,
  personalizedRecommendations,
  onArticleClick,
  onDateChange
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">AI Daily News</h1>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <SearchIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* 期刊信息 */}
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-500">Issue #{currentIssue.issueNumber}</p>
            <p className="text-lg font-semibold text-gray-900">{currentIssue.date}</p>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* 精选头条轮播 */}
        <section className="px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 今日精选</h2>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              {featuredArticles.map((article, index) => (
                <div 
                  key={article.id}
                  className={`transition-transform duration-300 ${index === currentSlide ? 'translate-x-0' : 'translate-x-full'}`}
                >
                  <FeaturedArticleCard 
                    article={article}
                    onClick={() => onArticleClick(article.id)}
                  />
                </div>
              ))}
            </div>
            
            {/* 轮播指示器 */}
            <div className="flex justify-center mt-4 gap-2">
              {featuredArticles.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 行业速递 */}
        <section className="px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ 行业速递</h2>
          <div className="space-y-3">
            {quickUpdates.map((article) => (
              <QuickUpdateCard
                key={article.id}
                article={article}
                onClick={() => onArticleClick(article.id)}
              />
            ))}
          </div>
        </section>

        {/* 为你推荐 */}
        <section className="px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">❤️ 为你推荐</h2>
          <div className="space-y-4">
            {personalizedRecommendations.map((article) => (
              <RecommendationCard
                key={article.id}
                article={article}
                onClick={() => onArticleClick(article.id)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <NavButton icon={<HomeIcon />} label="首页" active />
          <NavButton icon={<SearchIcon />} label="搜索" />
          <NavButton icon={<BookmarkIcon />} label="收藏" />
          <NavButton icon={<UserIcon />} label="我的" />
        </div>
      </nav>
    </div>
  );
};

// 2. 文章详情页组件
interface ArticleDetailProps {
  article: ArticleDetail;
  onShare: () => void;
  onLike: () => void;
  onBookmark: () => void;
  onBack: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onShare,
  onLike,
  onBookmark,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* 顶部工具栏 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 truncate flex-1 px-4">
            {article.title}
          </h1>
          <button className="p-2">
            <MoreVerticalIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      <article className="px-4 py-6">
        {/* 封面图 */}
        {article.coverImage && (
          <div className="mb-6 -mx-4">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* 标题和元信息 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
            {article.title}
          </h1>
          {article.subtitle && (
            <h2 className="text-lg text-gray-600 mb-4">{article.subtitle}</h2>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>By {article.author}</span>
              <span>{article.readTime}分钟读完</span>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span>{article.rating}</span>
            </div>
          </div>
        </div>

        {/* 正文内容 */}
        <div className="prose prose-gray max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* 标签 */}
        {article.tags && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* 固定底栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-3">
          <ActionButton icon={<HeartIcon />} label="点赞" onClick={onLike} />
          <ActionButton icon={<BookmarkIcon />} label="收藏" onClick={onBookmark} />
          <ActionButton icon={<ShareIcon />} label="分享" onClick={onShare} />
          <ActionButton icon={<MessageCircleIcon />} label="评论" />
        </div>
      </div>
    </div>
  );
};

// 3. 搜索/历史页面组件
interface SearchHistoryPageProps {
  onDateSelect: (date: string) => void;
  onIssueSelect: (issueId: string) => void;
}

export const SearchHistoryPage: React.FC<SearchHistoryPageProps> = ({
  onDateSelect,
  onIssueSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'history'>('search');

  // 模拟历史数据
  const historyData = [
    { year: '2024年3月', issues: [
      { id: '256', date: '03/12', title: 'AI芯片新突破' },
      { id: '255', date: '03/11', title: '大模型应用落地' },
      { id: '254', date: '03/10', title: 'AI伦理治理新规' }
    ]},
    { year: '2024年2月', issues: [
      { id: '253', date: '02/29', title: '商汤科技获C轮融资' },
      { id: '252', date: '02/28', title: 'OpenAI发布GPT-5' }
    ]}
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="p-2 -ml-2">
              <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索日报内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex border-b border-gray-200">
          <TabButton 
            active={activeTab === 'search'} 
            onClick={() => setActiveTab('search')}
          >
            🔍 搜索
          </TabButton>
          <TabButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            📚 历史
          </TabButton>
        </div>
      </header>

      <main className="px-4 py-6">
        {activeTab === 'search' ? (
          <SearchResults query={searchQuery} />
        ) : (
          <div className="space-y-6">
            {historyData.map((yearGroup) => (
              <div key={yearGroup.year}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {yearGroup.year}
                </h3>
                <div className="space-y-2">
                  {yearGroup.issues.map((issue) => (
                    <HistoryItem
                      key={issue.id}
                      issue={issue}
                      onClick={() => onIssueSelect(issue.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// 4. 分享海报生成组件
interface SharePosterProps {
  article: ArticleDetail;
  onClose: () => void;
  onShare: () => void;
}

export const SharePoster: React.FC<SharePosterProps> = ({
  article,
  onClose,
  onShare
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 生成海报
    generatePoster();
  }, [article]);

  const generatePoster = async () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    canvas.width = 750;
    canvas.height = 1334;

    // 绘制背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制标题
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 48px PingFang SC';
    ctx.fillText('AI Daily News', 50, 120);

    // 绘制日期和期号
    ctx.fillStyle = '#666666';
    ctx.font = '24px PingFang SC';
    ctx.fillText(`${article.date} · 第${article.issueNumber}期`, 50, 170);

    // 绘制文章标题
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 36px PingFang SC';
    wrapText(ctx, article.title, 50, 250, 650, 50);

    // 绘制主要内容摘要
    ctx.fillStyle = '#666666';
    ctx.font = '28px PingFang SC';
    wrapText(ctx, article.excerpt || '', 50, 400, 650, 40);

    // 绘制装饰元素
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 550);
    ctx.lineTo(700, 550);
    ctx.stroke();

    // 绘制二维码占位符
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(550, 1100, 150, 150);
    ctx.fillStyle = '#999999';
    ctx.font = '20px PingFang SC';
    ctx.textAlign = 'center';
    ctx.fillText('小程序码', 625, 1180);
    ctx.textAlign = 'left';

    // 绘制提示文字
    ctx.fillStyle = '#999999';
    ctx.font = '24px PingFang SC';
    ctx.fillText('微信扫码阅读完整内容', 50, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">分享到朋友圈</h3>
          <button onClick={onClose} className="p-2">
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <canvas 
            ref={canvasRef} 
            className="w-full rounded-lg"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        <button
          onClick={onShare}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
        >
          保存图片并分享
        </button>
      </div>
    </div>
  );
};