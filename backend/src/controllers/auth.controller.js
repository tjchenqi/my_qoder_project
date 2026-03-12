const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../models');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../middleware/auth');

// 微信登录
const wechatLogin = async (req, res) => {
  try {
    const { code, userInfo } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // 调用微信API获取openid和session_key
    const appId = process.env.WECHAT_APP_ID || 'your-app-id';
    const appSecret = process.env.WECHAT_APP_SECRET || 'your-app-secret';
    
    const wxResponse = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: appId,
        secret: appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, session_key, unionid } = wxResponse.data;
    
    if (!openid) {
      return res.status(400).json({ 
        error: 'Failed to get openid from WeChat',
        wxError: wxResponse.data 
      });
    }

    // 创建或更新用户
    const userData = {
      openid,
      session_key,
      unionid,
      ...(userInfo || {})
    };

    const user = await User.createOrUpdate(userData);
    
    // 更新最后登录时间
    await user.update({ 
      last_login_at: new Date(),
      login_count: user.login_count + 1
    });

    // 生成JWT令牌
    const accessToken = jwt.sign(
      { userId: user.id, openid: user.openid },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, openid: user.openid },
      JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        user_level: user.user_level,
        points: user.points,
        is_vip: user.isVip()
      },
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 7 * 24 * 60 * 60 // 7天
      }
    });

  } catch (error) {
    console.error('WeChat login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      message: error.message 
    });
  }
};

// 刷新令牌
const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refresh_token, JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || user.status !== 1) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, openid: user.openid },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      access_token: newAccessToken,
      expires_in: 7 * 24 * 60 * 60
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['session_key'] } // 排除敏感字段
    });
    
    res.json({
      user: {
        ...user.toJSON(),
        is_vip: user.isVip()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
};

// 更新用户信息
const updateUserInfo = async (req, res) => {
  try {
    const { nickname, avatar, gender, city, province, country } = req.body;
    const updateData = {};
    
    if (nickname !== undefined) updateData.nickname = nickname;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (gender !== undefined) updateData.gender = gender;
    if (city !== undefined) updateData.city = city;
    if (province !== undefined) updateData.province = province;
    if (country !== undefined) updateData.country = country;

    const user = await req.user.update(updateData);
    
    res.json({
      success: true,
      user: {
        ...user.toJSON(),
        is_vip: user.isVip()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user info' });
  }
};

// 用户签到
const userCheckIn = async (req, res) => {
  try {
    const today = new Date().toDateString();
    const lastCheckIn = req.user.last_check_in_at ? 
      new Date(req.user.last_check_in_at).toDateString() : '';
    
    if (today === lastCheckIn) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    // 更新用户积分和签到时间
    const pointsToAdd = 10;
    await req.user.update({
      points: req.user.points + pointsToAdd,
      last_check_in_at: new Date()
    });

    res.json({
      success: true,
      message: 'Check-in successful',
      points_added: pointsToAdd,
      total_points: req.user.points + pointsToAdd
    });
  } catch (error) {
    res.status(500).json({ error: 'Check-in failed' });
  }
};

// 获取用户统计数据
const getUserStats = async (req, res) => {
  try {
    const { UserFavorite } = require('../models');
    
    // 获取收藏数量
    const favoriteCount = await UserFavorite.count({
      where: { user_id: req.user.id }
    });

    // 这里可以添加更多统计逻辑
    res.json({
      stats: {
        total_reads: req.user.view_count || 0,
        total_favorites: favoriteCount,
        total_comments: req.user.comment_count || 0,
        check_in_days: req.user.check_in_days || 0,
        points: req.user.points,
        level: req.user.user_level
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user stats' });
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