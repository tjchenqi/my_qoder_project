const express = require('express');
const router = express.Router();
const {
  getUserFavorites,
  toggleFavorite,
  getUserFolders,
  updateFavoriteNotes,
  deleteFavorite
} = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth');

// 获取用户收藏列表
router.get('/favorites', authenticateToken, getUserFavorites);

// 收藏/取消收藏内容
router.post('/favorites', authenticateToken, toggleFavorite);

// 获取用户收藏文件夹
router.get('/folders', authenticateToken, getUserFolders);

// 更新收藏备注
router.put('/favorites/:favorite_id', authenticateToken, updateFavoriteNotes);

// 删除收藏
router.delete('/favorites/:favorite_id', authenticateToken, deleteFavorite);

module.exports = router;