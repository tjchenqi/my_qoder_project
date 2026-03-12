const express = require('express');
const router = express.Router();
const {
  getContentList,
  getContentDetail,
  searchContent,
  getHotContents,
  getCategoryStats
} = require('../controllers/content.controller');
const { optionalAuth } = require('../middleware/auth');

// 获取内容列表
router.get('/', optionalAuth, getContentList);

// 搜索内容
router.get('/search', optionalAuth, searchContent);

// 获取热门内容
router.get('/hot', optionalAuth, getHotContents);

// 获取分类统计
router.get('/categories/stats', getCategoryStats);

// 获取内容详情
router.get('/:id', optionalAuth, getContentDetail);

module.exports = router;