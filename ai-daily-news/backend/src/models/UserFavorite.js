const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserFavorite = sequelize.define('UserFavorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户ID'
  },
  content_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '内容ID'
  },
  folder: {
    type: DataTypes.STRING(50),
    defaultValue: 'default',
    comment: '收藏文件夹'
  },
  notes: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '收藏备注'
  }
}, {
  tableName: 'user_favorites',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'content_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['content_id']
    },
    {
      fields: ['folder']
    },
    {
      fields: ['created_at']
    }
  ]
});

// 关联关系
UserFavorite.associate = function(models) {
  UserFavorite.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  
  UserFavorite.belongsTo(models.Content, {
    foreignKey: 'content_id',
    as: 'content'
  });
};

// 类方法
UserFavorite.getUserFavorites = async function(userId, folder = null, limit = 20, offset = 0) {
  const whereConditions = { user_id: userId };
  if (folder) {
    whereConditions.folder = folder;
  }

  return await this.findAndCountAll({
    where: whereConditions,
    include: [{
      model: sequelize.models.Content,
      as: 'content',
      attributes: ['id', 'title', 'excerpt', 'cover_image', 'published_at']
    }],
    order: [['created_at', 'DESC']],
    limit,
    offset
  });
};

UserFavorite.toggleFavorite = async function(userId, contentId, folder = 'default') {
  const favorite = await this.findOne({
    where: { user_id: userId, content_id: contentId }
  });

  if (favorite) {
    await favorite.destroy();
    return { favorited: false, message: '取消收藏成功' };
  } else {
    const newFavorite = await this.create({
      user_id: userId,
      content_id: contentId,
      folder
    });
    return { favorited: true, message: '收藏成功', data: newFavorite };
  }
};

UserFavorite.getUserFolders = async function(userId) {
  const folders = await this.findAll({
    where: { user_id: userId },
    attributes: [
      'folder',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['folder'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
  });

  return folders.map(folder => ({
    name: folder.folder,
    count: parseInt(folder.getDataValue('count'))
  }));
};

module.exports = UserFavorite;