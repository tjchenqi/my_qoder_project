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
    allowNull: false
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  original_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  original_content: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  original_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'zh-CN'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  publish_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  quality_score: {
    type: DataTypes.DECIMAL(3,2),
    defaultValue: 0.00
  },
  relevance_score: {
    type: DataTypes.DECIMAL(3,2),
    defaultValue: 0.00
  },
  publish_status: {
    type: DataTypes.ENUM('draft', 'pending', 'published', 'rejected'),
    defaultValue: 'draft'
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  share_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comment_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  collected_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sentiment: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'contents',
  indexes: [
    { fields: ['category'] },
    { fields: ['publish_status'] },
    { fields: ['publish_time'] },
    { fields: ['view_count'] },
    { fields: ['like_count'] },
    { fields: ['quality_score'] },
    { fields: ['title'], type: 'FULLTEXT' },
    { fields: ['content'], type: 'FULLTEXT' },
    { fields: ['excerpt'], type: 'FULLTEXT' }
  ]
});

// 类方法
Content.findByCategory = async function(category, limit = 20, offset = 0) {
  return await this.findAndCountAll({
    where: { 
      category,
      publish_status: 'published'
    },
    order: [['publish_time', 'DESC']],
    limit,
    offset
  });
};

Content.search = async function(keyword, options = {}) {
  const { category, source, dateFrom, dateTo, limit = 20, offset = 0 } = options;
  
  const whereConditions = {
    publish_status: 'published'
  };
  
  if (category) whereConditions.category = category;
  if (source) whereConditions.source = source;
  if (dateFrom) whereConditions.publish_time = { [Op.gte]: dateFrom };
  if (dateTo) whereConditions.publish_time = { ...whereConditions.publish_time, [Op.lte]: dateTo };
  
  return await this.findAndCountAll({
    where: {
      ...whereConditions,
      [Op.or]: [
        { title: { [Op.like]: `%${keyword}%` } },
        { content: { [Op.like]: `%${keyword}%` } },
        { excerpt: { [Op.like]: `%${keyword}%` } }
      ]
    },
    order: [['publish_time', 'DESC']],
    limit,
    offset
  });
};

Content.getHotContents = async function(days = 7, limit = 20) {
  const { Op, literal } = require('sequelize');
  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return await this.findAll({
    where: {
      publish_status: 'published',
      publish_time: { [Op.gte]: sinceDate }
    },
    order: [
      [literal('view_count + like_count * 2 + share_count * 3'), 'DESC']
    ],
    limit
  });
};

module.exports = Content;