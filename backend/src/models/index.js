const User = require('./User');
const Content = require('./Content');
const UserFavorite = require('./UserFavorite');

// 建立模型关系
User.hasMany(UserFavorite, {
  foreignKey: 'user_id',
  as: 'favorites'
});

Content.hasMany(UserFavorite, {
  foreignKey: 'content_id',
  as: 'favoritedBy'
});

UserFavorite.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

UserFavorite.belongsTo(Content, {
  foreignKey: 'content_id',
  as: 'content'
});

module.exports = {
  User,
  Content,
  UserFavorite
};