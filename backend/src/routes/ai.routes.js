const express = require('express');
const { aiChat, aiAskAboutContent, getAIModels } = require('../controllers/ai.controller');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/ai/chat
 * @desc AI对话接口
 * @access Private (需要VIP及以上权限)
 */
router.post('/chat', authenticateToken, aiChat);

/**
 * @route POST /api/ai/ask-about-content
 * @desc 基于文章内容的AI问答
 * @access Private (需要VIP及以上权限)
 */
router.post('/ask-about-content', authenticateToken, aiAskAboutContent);

/**
 * @route GET /api/ai/models
 * @desc 获取可用的AI模型列表
 * @access Public
 */
router.get('/models', getAIModels);

module.exports = router;