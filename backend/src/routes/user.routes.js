const express = require('express');
const { 
  getUserFavorites,
  toggleFavorite,
  getUserFolders,
  updateFavoriteNotes,
  deleteFavorite
} = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/user/favorites
 * @desc 获取用户收藏列表
 * @access Private
 */
router.get('/favorites', authenticateToken, getUserFavorites);

/**
 * @route POST /api/user/favorites/toggle
 * @desc 添加/取消收藏
 * @access Private
 */
router.post('/favorites/toggle', authenticateToken, toggleFavorite);

/**
 * @route GET /api/user/folders
 * @desc 获取用户文件夹
 * @access Private
 */
router.get('/folders', authenticateToken, getUserFolders);

/**
 * @route PUT /api/user/favorites/:id/notes
 * @desc 更新收藏备注
 * @access Private
 */
router.put('/favorites/:id/notes', authenticateToken, updateFavoriteNotes);

/**
 * @route DELETE /api/user/favorites/:id
 * @desc 删除收藏
 * @access Private
 */
router.delete('/favorites/:id', authenticateToken, deleteFavorite);

module.exports = router;