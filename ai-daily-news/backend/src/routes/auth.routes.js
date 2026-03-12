const express = require('express');
const router = express.Router();
const {
  wechatLogin,
  refreshToken,
  getCurrentUser,
  updateUserInfo,
  userCheckIn,
  getUserStats
} = require('../controllers/auth.controller');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// 微信登录认证
router.post('/wechat-login', wechatLogin);

// 刷新访问令牌
router.post('/refresh-token', refreshToken);

// 获取当前用户信息（需要认证）
router.get('/me', authenticateToken, getCurrentUser);

// 更新用户信息（需要认证）
router.put('/me', authenticateToken, updateUserInfo);

// 用户签到（需要认证）
router.post('/check-in', authenticateToken, userCheckIn);

// 获取用户统计数据（需要认证）
router.get('/stats', authenticateToken, getUserStats);

module.exports = router;