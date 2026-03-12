const express = require('express');
const { 
  wechatLogin, 
  refreshToken, 
  getCurrentUser, 
  updateUserInfo,
  userCheckIn,
  getUserStats
} = require('../controllers/auth.controller');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/auth/wechat-login
 * @desc 微信登录接口
 * @access Public
 */
router.post('/wechat-login', wechatLogin);

/**
 * @route POST /api/auth/refresh-token
 * @desc 刷新访问令牌
 * @access Public
 */
router.post('/refresh-token', refreshToken);

/**
 * @route GET /api/auth/me
 * @desc 获取当前用户信息
 * @access Private
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @route PUT /api/auth/profile
 * @desc 更新用户信息
 * @access Private
 */
router.put('/profile', authenticateToken, updateUserInfo);

/**
 * @route POST /api/auth/check-in
 * @desc 用户签到
 * @access Private
 */
router.post('/check-in', authenticateToken, userCheckIn);

/**
 * @route GET /api/auth/stats
 * @desc 获取用户统计数据
 * @access Private
 */
router.get('/stats', authenticateToken, getUserStats);

module.exports = router;