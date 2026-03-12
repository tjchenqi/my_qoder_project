const { UserFavorite } = require('../models');

// 获取用户收藏列表
const getUserFavorites = async (req, res) => {
  try {
    const {
      folder,
      page = 1,
      limit = 20
    } = req.query;

    const offset = (page - 1) * limit;
    
    const result = await UserFavorite.getUserFavorites(
      req.user.id,
      folder,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: result.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(result.count / limit)
      }
    });

  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
};

// 添加/取消收藏
const toggleFavorite = async (req, res) => {
  try {
    const { content_id, folder = 'default' } = req.body;

    if (!content_id) {
      return res.status(400).json({ error: 'Content ID required' });
    }

    const result = await UserFavorite.toggleFavorite(
      req.user.id,
      content_id,
      folder
    );

    res.json({
      success: true,
      favorited: result.favorited,
      message: result.favorited ? 'Added to favorites' : 'Removed from favorites',
      ...(result.favorite && { favorite: result.favorite })
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

// 获取用户文件夹
const getUserFolders = async (req, res) => {
  try {
    const folders = await UserFavorite.getUserFolders(req.user.id);
    
    res.json({
      success: true,
      data: folders
    });

  } catch (error) {
    console.error('Get user folders error:', error);
    res.status(500).json({ error: 'Failed to get folders' });
  }
};

// 更新收藏备注
const updateFavoriteNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const favorite = await UserFavorite.findOne({
      where: {
        id,
        user_id: req.user.id
      }
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await favorite.update({ notes });
    
    res.json({
      success: true,
      message: 'Notes updated successfully',
      favorite
    });

  } catch (error) {
    console.error('Update favorite notes error:', error);
    res.status(500).json({ error: 'Failed to update notes' });
  }
};

// 删除收藏
const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const favorite = await UserFavorite.findOne({
      where: {
        id,
        user_id: req.user.id
      }
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await favorite.destroy();
    
    res.json({
      success: true,
      message: 'Favorite deleted successfully'
    });

  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
};

module.exports = {
  getUserFavorites,
  toggleFavorite,
  getUserFolders,
  updateFavoriteNotes,
  deleteFavorite
};