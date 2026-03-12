const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '文章标题'
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '文章摘要'
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: '文章正文'
  },
  original_title: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: '原标题'
  },
  original_content: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: '原文内容'
  },
  original_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '原始URL'
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '来源网站'
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '作者'
  },
  category: {
    type: DataTypes.ENUM(
      'technology_breakthrough',
      'industry_dynamics', 
      'policy_regulation',
      'academic_research',
      'people_opinion',
      'market_analysis',
      'application_case'
    ),
    allowNull: false,
    comment: '分类'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '标签数组'
  },
  cover_image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '封面图片URL'
  },
  language: {
    type: DataTypes.ENUM('en', 'zh'),
    defaultValue: 'en',
    comment: '语言'
  },
  word_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '字数统计'
  },
  read_time: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '预计阅读时间(分钟)'
  },
  quality_score: {
    type: DataTypes.DECIMAL(3,2),
    allowNull: true,
    comment: '质量评分(0-10)'
  },
  relevance_score: {
    type: DataTypes.DECIMAL(3,2),
    allowNull: true,
    comment: '相关性评分(0-10)'
  },
  publish_status: {
    type: DataTypes.ENUM('draft', 'pending', 'published', 'rejected'),
    defaultValue: 'draft',
    comment: '发布状态'
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '发布时间'
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '浏览次数'
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '点赞数'
  },
  share_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '分享数'
  },
  comment_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '评论数'
  }
}, {
  tableName: 'contents',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['publish_status']
    },
    {
      fields: ['published_at']
    },
    {
      fields: ['quality_score']
    },
    {
      fields: ['view_count']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['title'],
      type: 'FULLTEXT'
    },
    {
      fields: ['content'],
      type: 'FULLTEXT'
    }
  ]
});

// 实例方法
Content.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  // 隐藏原始内容（除非是管理员）
  delete values.original_content;
  delete values.original_url;
  return values;
};

Content.prototype.getTagsArray = function() {
  return Array.isArray(this.tags) ? this.tags : [];
};

Content.prototype.addTag = function(tag) {
  const tags = this.getTagsArray();
  if (!tags.includes(tag)) {
    tags.push(tag);
    this.tags = tags;
  }
};

Content.prototype.removeTag = function(tag) {
  const tags = this.getTagsArray();
  const index = tags.indexOf(tag);
  if (index > -1) {
    tags.splice(index, 1);
    this.tags = tags;
  }
};

// 类方法
Content.findByCategory = async function(category, limit = 20, offset = 0) {
  return await this.findAndCountAll({
    where: { 
      category,
      publish_status: 'published'
    },
    order: [['published_at', 'DESC']],
    limit,
    offset
  });
};

Content.search = async function(query, filters = {}, limit = 20, offset = 0) {
  const whereConditions = {
    publish_status: 'published'
  };

  // 添加搜索条件
  if (query) {
    whereConditions[Sequelize.Op.or] = [
      { title: { [Sequelize.Op.like]: `%${query}%` } },
      { content: { [Sequelize.Op.like]: `%${query}%` } }
    ];
  }

  // 添加过滤条件
  if (filters.category) {
    whereConditions.category = filters.category;
  }
  if (filters.source) {
    whereConditions.source = filters.source;
  }
  if (filters.dateFrom) {
    whereConditions.published_at = {
      [Sequelize.Op.gte]: new Date(filters.dateFrom)
    };
  }
  if (filters.dateTo) {
    whereConditions.published_at = {
      ...whereConditions.published_at,
      [Sequelize.Op.lte]: new Date(filters.dateTo)
    };
  }

  return await this.findAndCountAll({
    where: whereConditions,
    order: [['published_at', 'DESC']],
    limit,
    offset
  });
};

Content.getHotContents = async function(limit = 10) {
  return await this.findAll({
    where: { 
      publish_status: 'published',
      published_at: {
        [Sequelize.Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 最近7天
      }
    },
    order: [
      [sequelize.literal('view_count + like_count * 2 + share_count * 3'), 'DESC']
    ],
    limit
  });
};

module.exports = Content;