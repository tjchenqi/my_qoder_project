const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../models');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// 微信登录认证
const wechatLogin = async (req, res, next) => {
  try {
    const { code, userInfo } = req.body;
    
    if (!code) {
      return res.status(400).json({
        error: 'Missing authorization code'
      });
    }

    // 调用微信接口获取openid和session_key
    const appId = process.env.WECHAT_APP_ID;
    const appSecret = process.env.WECHAT_APP_SECRET;
    
    const wxResponse = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: appId,
        secret: appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, session_key, errmsg } = wxResponse.data;
    
    if (errmsg) {
      return res.status(400).json({
        error: `WeChat API error: ${errmsg}`
      });
    }

    if (!openid) {
      return res.status(400).json({
        error: 'Failed to get openid from WeChat'
      });
    }

    // 创建或更新用户信息
    const userData = {
      openid,
      nickname: userInfo?.nickName || '匿名用户',
      avatar: userInfo?.avatarUrl || '',
      gender: userInfo?.gender ? (userInfo.gender === 1 ? 'male' : userInfo.gender === 2 ? 'female' : 'unknown') : 'unknown',
      city: userInfo?.city || '',
      province: userInfo?.province || '',
      country: userInfo?.country || '',
      language: userInfo?.language || 'zh_CN',
      last_login_at: new Date()
    };

    const user = await User.createOrUpdate(userData);
    
    // 生成JWT令牌
    const token = jwt.sign(
      { 
        userId: user.id, 
        openid: user.openid,
        userLevel: user.user_level 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 更新登录次数
    await user.increment('login_count');

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          openid: user.openid,
          nickname: user.nickname,
          avatar: user.avatar,
          user_level: user.user_level,
          is_vip: user.isVip(),
          points: user.points
        }
      },
      message: 'Login successful'
    });

  } catch (error) {
    next(error);
  }
};

// 刷新访问令牌
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        error: 'Missing refresh token'
      });
    }

    // 验证refresh token（这里简化处理，实际应该存储在数据库中）
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findByPk(decoded.userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        error: 'Invalid user'
      });
    }

    // 生成新的访问令牌
    const newToken = jwt.sign(
      { 
        userId: user.id, 
        openid: user.openid,
        userLevel: user.user_level 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token: newToken
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Refresh token expired'
      });
    }
    next(error);
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['id'] } // 隐藏真实ID
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          ...user.toJSON(),
          is_vip: user.isVip()
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// 更新用户信息
const updateUserInfo = async (req, res, next) => {
  try {
    const { nickname, avatar, gender, city, province, country } = req.body;
    const updateData = {};

    if (nickname !== undefined) updateData.nickname = nickname;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (gender !== undefined) updateData.gender = gender;
    if (city !== undefined) updateData.city = city;
    if (province !== undefined) updateData.province = province;
    if (country !== undefined) updateData.country = country;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    await user.update(updateData);

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      },
      message: 'User information updated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// 用户签到
const userCheckIn = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    // 检查今日是否已签到（简化实现，实际应有签到记录表）
    const today = new Date().toDateString();
    const lastCheckIn = user.last_login_at ? new Date(user.last_login_at).toDateString() : '';
    
    if (today === lastCheckIn) {
      return res.json({
        success: true,
        data: {
          checked_in: false,
          points: user.points,
          message: 'Already checked in today'
        }
      });
    }

    // 签到奖励积分
    const pointsToAdd = 10;
    await user.increment('points', { by: pointsToAdd });
    await user.update({ last_login_at: new Date() });

    res.json({
      success: true,
      data: {
        checked_in: true,
        points_added: pointsToAdd,
        total_points: user.points + pointsToAdd,
        message: 'Check-in successful'
      }
    });

  } catch (error) {
    next(error);
  }
};

// 获取用户统计数据
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 获取用户相关统计（简化实现）
    const stats = {
      total_reads: 0, // 需要阅读记录表
      total_favorites: 0, // 需要收藏记录表
      total_comments: 0, // 需要评论记录表
      check_in_days: 0, // 需要签到记录表
      points: req.user.points
    };

    res.json({
      success: true,
      data: {
        stats
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  wechatLogin,
  refreshToken,
  getCurrentUser,
  updateUserInfo,
  userCheckIn,
  getUserStats
};