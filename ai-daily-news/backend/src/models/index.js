const User = require('./User');
const Content = require('./Content');
const UserFavorite = require('./UserFavorite');

// 模型关联定义
function setupAssociations() {
  // User 1:N UserFavorite
  User.hasMany(UserFavorite, {
    foreignKey: 'user_id',
    as: 'favorites'
  });
  
  // Content 1:N UserFavorite
  Content.hasMany(UserFavorite, {
    foreignKey: 'content_id',
    as: 'favoritedBy'
  });
  
  // 调用模型自身的关联方法
  if (UserFavorite.associate) {
    UserFavorite.associate({ User, Content });
  }
}

module.exports = {
  User,
  Content,
  UserFavorite,
  setupAssociations
};