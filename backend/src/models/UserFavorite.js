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
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contents',
      key: 'id'
    }
  },
  folder: {
    type: DataTypes.STRING(50),
    defaultValue: 'default'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_favorites',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['content_id'] },
    { fields: ['folder'] },
    { fields: ['user_id', 'folder'] }
  ]
});

// 类方法
UserFavorite.getUserFavorites = async function(userId, folder = null, limit = 20, offset = 0) {
  const whereConditions = { user_id: userId };
  if (folder) whereConditions.folder = folder;
  
  return await this.findAndCountAll({
    where: whereConditions,
    include: [{
      model: require('./Content'),
      as: 'content',
      attributes: ['id', 'title', 'excerpt', 'category', 'publish_time']
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
    return { favorited: false };
  } else {
    const newFavorite = await this.create({
      user_id: userId,
      content_id: contentId,
      folder
    });
    return { favorited: true, favorite: newFavorite };
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