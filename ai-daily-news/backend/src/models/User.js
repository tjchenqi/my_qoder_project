const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
    comment: '微信openid'
  },
  nickname: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '用户昵称'
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '头像URL'
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'unknown'),
    defaultValue: 'unknown',
    comment: '性别'
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '城市'
  },
  province: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '省份'
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '国家'
  },
  language: {
    type: DataTypes.STRING(20),
    defaultValue: 'zh_CN',
    comment: '语言'
  },
  user_level: {
    type: DataTypes.ENUM('free', 'vip', 'svip'),
    defaultValue: 'free',
    comment: '用户等级'
  },
  vip_expire_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'VIP过期时间'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '积分'
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'banned'),
    defaultValue: 'active',
    comment: '账户状态'
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '最后登录时间'
  },
  login_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '登录次数'
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['openid']
    },
    {
      fields: ['user_level']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ]
});

// 实例方法
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.id; // 隐藏真实ID
  return values;
};

User.prototype.isVip = function() {
  return this.user_level !== 'free' && 
         (!this.vip_expire_at || new Date(this.vip_expire_at) > new Date());
};

User.prototype.canAccessFeature = function(feature) {
  const featurePermissions = {
    'ai_chat': ['vip', 'svip'],
    'offline_download': ['svip'],
    'ad_free': ['vip', 'svip'],
    'exclusive_content': ['svip']
  };
  
  const requiredLevels = featurePermissions[feature] || [];
  return requiredLevels.includes(this.user_level) && this.isVip();
};

// 类方法
User.findByOpenid = async function(openid) {
  return await this.findOne({ where: { openid } });
};

User.createOrUpdate = async function(userData) {
  const { openid, ...updateData } = userData;
  
  const [user, created] = await this.findOrCreate({
    where: { openid },
    defaults: updateData
  });
  
  if (!created) {
    await user.update(updateData);
  }
  
  return user;
};

module.exports = User;