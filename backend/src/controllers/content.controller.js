const { Content, UserFavorite } = require('../models');
const { Op } = require('sequelize');

// 获取内容列表
const getContentList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      source,
      sort = 'publish_time'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereConditions = { publish_status: 'published' };

    if (category) whereConditions.category = category;
    if (source) whereConditions.source = source;

    const result = await Content.findAndCountAll({
      where: whereConditions,
      order: [[sort, 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: {
        exclude: ['original_content']
      }
    });

    // 如果用户已登录，标记已收藏的内容
    if (req.user) {
      const contentIds = result.rows.map(content => content.id);
      const favorites = await UserFavorite.findAll({
        where: {
          user_id: req.user.id,
          content_id: contentIds
        }
      });
      
      const favoriteMap = new Map(favorites.map(fav => [fav.content_id, fav]));
      
      result.rows = result.rows.map(content => ({
        ...content.toJSON(),
        is_favorited: favoriteMap.has(content.id)
      }));
    }

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: result.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(result.count / limit)
      }
    });

  } catch (error) {
    console.error('Get content list error:', error);
    res.status(500).json({ error: 'Failed to get content list' });
  }
};

// 获取内容详情
const getContentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await Content.findByPk(id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (content.publish_status !== 'published') {
      return res.status(403).json({ error: 'Content not accessible' });
    }

    // 增加浏览量
    await content.increment('view_count');

    // 检查是否已收藏（如果用户已登录）
    let isFavorited = false;
    if (req.user) {
      const favorite = await UserFavorite.findOne({
        where: {
          user_id: req.user.id,
          content_id: id
        }
      });
      isFavorited = !!favorite;
    }

    res.json({
      success: true,
      data: {
        ...content.toJSON(),
        is_favorited: isFavorited
      }
    });

  } catch (error) {
    console.error('Get content detail error:', error);
    res.status(500).json({ error: 'Failed to get content detail' });
  }
};

// 搜索内容
const searchContent = async (req, res) => {
  try {
    const {
      q,
      category,
      source,
      date_from,
      date_to,
      page = 1,
      limit = 20
    } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const offset = (page - 1) * limit;
    const whereConditions = {
      publish_status: 'published'
    };

    if (category) whereConditions.category = category;
    if (source) whereConditions.source = source;
    if (date_from) whereConditions.publish_time = { [Op.gte]: new Date(date_from) };
    if (date_to) {
      whereConditions.publish_time = {
        ...whereConditions.publish_time,
        [Op.lte]: new Date(date_to)
      };
    }

    const result = await Content.findAndCountAll({
      where: {
        ...whereConditions,
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { content: { [Op.like]: `%${q}%` } },
          { excerpt: { [Op.like]: `%${q}%` } }
        ]
      },
      order: [['publish_time', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: result.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(result.count / limit)
      },
      query: q
    });

  } catch (error) {
    console.error('Search content error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

// 获取热门内容
const getHotContents = async (req, res) => {
  try {
    const { days = 7, limit = 20 } = req.query;
    
    console.log('Hot contents request:', { days, limit });
    
    const hotContents = await Content.getHotContents(parseInt(days), parseInt(limit));
    
    console.log('Hot contents result:', hotContents.length);
    
    res.json({
      success: true,
      data: hotContents
    });

  } catch (error) {
    console.error('Get hot contents error:', error);
    res.status(500).json({ error: 'Failed to get hot contents' });
  }
};

// 获取分类统计
const getCategoryStats = async (req, res) => {
  try {
    const stats = await Content.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('MAX', sequelize.col('publish_time')), 'latest_publish']
      ],
      where: { publish_status: 'published' },
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    res.json({
      success: true,
      data: stats.map(stat => ({
        category: stat.category,
        count: parseInt(stat.getDataValue('count')),
        latest_publish: stat.getDataValue('latest_publish')
      }))
    });

  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({ error: 'Failed to get category stats' });
  }
};

module.exports = {
  getContentList,
  getContentDetail,
  searchContent,
  getHotContents,
  getCategoryStats
};