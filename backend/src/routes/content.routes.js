const express = require('express');
const { 
  getContentList,
  getContentDetail,
  searchContent,
  getHotContents,
  getCategoryStats
} = require('../controllers/content.controller');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/content/list
 * @desc 获取内容列表
 * @access Public (可选认证)
 */
router.get('/list', optionalAuth, getContentList);

/**
 * @route GET /api/content/search
 * @desc 搜索内容
 * @access Public (可选认证)
 */
router.get('/search', optionalAuth, searchContent);

/**
 * @route GET /api/content/hot
 * @desc 获取热门内容
 * @access Public
 */
router.get('/hot', getHotContents);

/**
 * @route GET /api/content/categories/stats
 * @desc 获取分类统计
 * @access Public
 */
router.get('/categories/stats', getCategoryStats);

/**
 * @route GET /api/content/:id
 * @desc 获取内容详情
 * @access Public (可选认证)
 * 注意：这个路由必须放在最后，避免匹配到其他具体路由
 */
router.get('/:id', optionalAuth, getContentDetail);

module.exports = router;