const { Content, UserFavorite } = require('../models');
const { optionalAuth } = require('../middleware/auth');

// 获取内容列表
const getContentList = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      source,
      sort = 'published_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    // 构建查询条件
    const whereConditions = {
      publish_status: 'published'
    };

    if (category) whereConditions.category = category;
    if (source) whereConditions.source = source;

    // 构建排序条件
    const orderConditions = [[sort, order]];
    if (sort !== 'published_at') {
      orderConditions.push(['published_at', 'DESC']);
    }

    const result = await Content.findAndCountAll({
      where: whereConditions,
      order: orderConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: {
        exclude: ['original_content', 'original_url']
      }
    });

    // 如果用户已登录，标记收藏状态
    if (req.user && result.rows.length > 0) {
      const contentIds = result.rows.map(content => content.id);
      const favorites = await UserFavorite.findAll({
        where: {
          user_id: req.user.id,
          content_id: contentIds
        },
        attributes: ['content_id']
      });

      const favoriteIds = new Set(favorites.map(fav => fav.content_id));
      
      result.rows = result.rows.map(content => ({
        ...content.toJSON(),
        is_favorited: favoriteIds.has(content.id)
      }));
    }

    res.json({
      success: true,
      data: {
        contents: result.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: result.count,
          total_pages: Math.ceil(result.count / limit)
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// 获取内容详情
const getContentDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await Content.findByPk(id, {
      attributes: {
        exclude: ['original_content', 'original_url']
      }
    });

    if (!content) {
      return res.status(404).json({
        error: 'Content not found'
      });
    }

    // 增加浏览次数
    await content.increment('view_count');

    // 添加收藏状态（如果用户已登录）
    let result = content.toJSON();
    if (req.user) {
      const favorite = await UserFavorite.findOne({
        where: {
          user_id: req.user.id,
          content_id: id
        }
      });
      result.is_favorited = !!favorite;
    }

    res.json({
      success: true,
      data: {
        content: result
      }
    });

  } catch (error) {
    next(error);
  }
};

// 搜索内容
const searchContent = async (req, res, next) => {
  try {
    const {
      q,
      page = 1,
      limit = 20,
      category,
      source,
      date_from,
      date_to
    } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Search query is required'
      });
    }

    const offset = (page - 1) * limit;

    // 构建搜索条件
    const whereConditions = {
      publish_status: 'published',
      [Sequelize.Op.or]: [
        { title: { [Sequelize.Op.like]: `%${q}%` } },
        { content: { [Sequelize.Op.like]: `%${q}%` } },
        { excerpt: { [Sequelize.Op.like]: `%${q}%` } }
      ]
    };

    if (category) whereConditions.category = category;
    if (source) whereConditions.source = source;
    
    if (date_from) {
      whereConditions.published_at = {
        [Sequelize.Op.gte]: new Date(date_from)
      };
    }
    
    if (date_to) {
      whereConditions.published_at = {
        ...whereConditions.published_at,
        [Sequelize.Op.lte]: new Date(date_to)
      };
    }

    const result = await Content.findAndCountAll({
      where: whereConditions,
      order: [['published_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: {
        exclude: ['original_content', 'original_url']
      }
    });

    // 添加收藏状态
    if (req.user && result.rows.length > 0) {
      const contentIds = result.rows.map(content => content.id);
      const favorites = await UserFavorite.findAll({
        where: {
          user_id: req.user.id,
          content_id: contentIds
        }
      });

      const favoriteMap = new Map(favorites.map(fav => [fav.content_id, true]));
      
      result.rows = result.rows.map(content => ({
        ...content.toJSON(),
        is_favorited: favoriteMap.has(content.id)
      }));
    }

    res.json({
      success: true,
      data: {
        contents: result.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: result.count,
          total_pages: Math.ceil(result.count / limit)
        },
        query: q
      }
    });

  } catch (error) {
    next(error);
  }
};

// 获取热门内容
const getHotContents = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const hotContents = await Content.findAll({
      where: {
        publish_status: 'published',
        published_at: {
          [Sequelize.Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      order: [
        [Sequelize.literal('view_count + like_count * 2 + share_count * 3'), 'DESC']
      ],
      limit: parseInt(limit),
      attributes: {
        exclude: ['original_content', 'original_url']
      }
    });

    // 添加收藏状态
    if (req.user && hotContents.length > 0) {
      const contentIds = hotContents.map(content => content.id);
      const favorites = await UserFavorite.findAll({
        where: {
          user_id: req.user.id,
          content_id: contentIds
        }
      });

      const favoriteMap = new Map(favorites.map(fav => [fav.content_id, true]));
      
      const contentsWithFavorite = hotContents.map(content => ({
        ...content.toJSON(),
        is_favorited: favoriteMap.has(content.id)
      }));

      res.json({
        success: true,
        data: {
          contents: contentsWithFavorite
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          contents: hotContents.map(content => content.toJSON())
        }
      });
    }

  } catch (error) {
    next(error);
  }
};

// 获取内容分类统计
const getCategoryStats = async (req, res, next) => {
  try {
    const stats = await Content.findAll({
      where: {
        publish_status: 'published'
      },
      attributes: [
        'category',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        [Sequelize.fn('MAX', Sequelize.col('published_at')), 'latest_publish']
      ],
      group: ['category'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']]
    });

    res.json({
      success: true,
      data: {
        categories: stats.map(stat => ({
          category: stat.category,
          count: parseInt(stat.getDataValue('count')),
          latest_publish: stat.getDataValue('latest_publish')
        }))
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContentList,
  getContentDetail,
  searchContent,
  getHotContents,
  getCategoryStats
};