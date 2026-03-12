const { UserFavorite } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// 获取用户收藏列表
const getUserFavorites = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      folder = null
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
      data: {
        favorites: result.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: result.count,
          total_pages: Math.ceil(result.count / limit)
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// 收藏/取消收藏内容
const toggleFavorite = async (req, res, next) => {
  try {
    const { content_id, folder = 'default' } = req.body;

    if (!content_id) {
      return res.status(400).json({
        error: 'Content ID is required'
      });
    }

    const result = await UserFavorite.toggleFavorite(
      req.user.id,
      content_id,
      folder
    );

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

// 获取用户收藏文件夹
const getUserFolders = async (req, res, next) => {
  try {
    const folders = await UserFavorite.getUserFolders(req.user.id);

    res.json({
      success: true,
      data: {
        folders
      }
    });

  } catch (error) {
    next(error);
  }
};

// 更新收藏备注
const updateFavoriteNotes = async (req, res, next) => {
  try {
    const { favorite_id, notes } = req.body;

    if (!favorite_id) {
      return res.status(400).json({
        error: 'Favorite ID is required'
      });
    }

    const favorite = await UserFavorite.findOne({
      where: {
        id: favorite_id,
        user_id: req.user.id
      }
    });

    if (!favorite) {
      return res.status(404).json({
        error: 'Favorite not found'
      });
    }

    await favorite.update({ notes });

    res.json({
      success: true,
      data: {
        favorite: favorite.toJSON()
      },
      message: 'Favorite notes updated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// 删除收藏
const deleteFavorite = async (req, res, next) => {
  try {
    const { favorite_id } = req.params;

    const favorite = await UserFavorite.findOne({
      where: {
        id: favorite_id,
        user_id: req.user.id
      }
    });

    if (!favorite) {
      return res.status(404).json({
        error: 'Favorite not found'
      });
    }

    await favorite.destroy();

    res.json({
      success: true,
      message: 'Favorite deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserFavorites,
  toggleFavorite,
  getUserFolders,
  updateFavoriteNotes,
  deleteFavorite
};