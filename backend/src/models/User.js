const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true
  },
  session_key: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  unionid: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  nickname: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  gender: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0-未知 1-男 2-女'
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  province: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  language: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  user_level: {
    type: DataTypes.ENUM('free', 'vip', 'svip'),
    defaultValue: 'free'
  },
  vip_expire_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '1-正常 0-禁用'
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  login_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['openid'] },
    { fields: ['user_level'] },
    { fields: ['status'] }
  ]
});

// 实例方法
User.prototype.isVip = function() {
  if (this.user_level === 'svip') return true;
  if (this.user_level === 'vip' && this.vip_expire_at > new Date()) return true;
  return false;
};

User.prototype.canAccessFeature = function(feature) {
  const featurePermissions = {
    'ai_chat': ['vip', 'svip'],
    'advanced_search': ['vip', 'svip'],
    'offline_reading': ['svip'],
    'priority_support': ['svip']
  };
  
  const requiredLevels = featurePermissions[feature] || [];
  return requiredLevels.includes(this.user_level) && 
         (this.user_level !== 'vip' || this.vip_expire_at > new Date());
};

// 类方法
User.findByOpenid = async function(openid) {
  return await this.findOne({ where: { openid } });
};

User.createOrUpdate = async function(userData) {
  const [user, created] = await this.findOrCreate({
    where: { openid: userData.openid },
    defaults: userData
  });
  
  if (!created) {
    await user.update(userData);
  }
  
  return user;
};

module.exports = User;