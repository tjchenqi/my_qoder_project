// pages/index/index.js
Page({
  data: {
    currentCategory: '',
    articles: [],
    hotArticles: [],
    page: 1,
    limit: 10,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadArticles();
    this.loadHotArticles();
  },

  onShow() {
    // 页面显示时刷新数据
    if (this.data.articles.length === 0) {
      this.loadArticles();
    }
  },

  // 加载文章列表
  async loadArticles() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const response = await getApp().request({
        url: '/content/list',
        data: {
          page: this.data.page,
          limit: this.data.limit,
          category: this.data.currentCategory
        }
      });

      if (response.success) {
        const newArticles = response.data;
        const articles = this.data.page === 1 ? newArticles : [...this.data.articles, ...newArticles];
        
        this.setData({
          articles: articles,
          hasMore: newArticles.length === this.data.limit,
          loading: false
        });
      }
    } catch (error) {
      console.error('加载文章失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
      this.setData({ loading: false });
    }
  },

  // 加载热门文章
  async loadHotArticles() {
    try {
      const response = await getApp().request({
        url: '/content/hot',
        data: {
          days: 7,
          limit: 5
        }
      });

      if (response.success) {
        this.setData({
          hotArticles: response.data
        });
      }
    } catch (error) {
      console.error('加载热门文章失败:', error);
    }
  },

  // 切换分类
  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category,
      page: 1,
      articles: []
    });
    this.loadArticles();
  },

  // 跳转到详情页
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 跳转到资讯页面
  goToNews() {
    wx.switchTab({
      url: '/pages/news/news'
    });
  },

  // 加载更多
  loadMore() {
    this.setData({
      page: this.data.page + 1
    });
    this.loadArticles();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      articles: []
    });
    Promise.all([
      this.loadArticles(),
      this.loadHotArticles()
    ]).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore) {
      this.loadMore();
    }
  }
})