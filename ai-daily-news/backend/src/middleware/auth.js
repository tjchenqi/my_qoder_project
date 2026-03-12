const jwt = require('jsonwebtoken');
const { User } = require('../models');

// JWT认证中间件
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户
    const user = await User.findByPk(decoded.userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        error: 'Invalid or inactive user'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired'
      });
    }
    next(error);
  }
};

// 可选认证中间件（用户存在则附带，不存在也不报错）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      if (user && user.status === 'active') {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // 认证失败不影响流程继续
    next();
  }
};

// 权限检查中间件
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const userPermissions = getUserPermissions(req.user.user_level);
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

// 管理员权限检查
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  if (req.user.user_level !== 'admin' && req.user.user_level !== 'super_admin') {
    return res.status(403).json({
      error: 'Admin privileges required'
    });
  }

  next();
};

// 超级管理员权限检查
const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  if (req.user.user_level !== 'super_admin') {
    return res.status(403).json({
      error: 'Super admin privileges required'
    });
  }

  next();
};

// 获取用户权限列表
const getUserPermissions = (userLevel) => {
  const permissions = {
    free: [
      'read_content',
      'search_content',
      'basic_ai_chat'
    ],
    vip: [
      'read_content',
      'search_content',
      'advanced_ai_chat',
      'save_favorites',
      'view_history'
    ],
    svip: [
      'read_content',
      'search_content',
      'unlimited_ai_chat',
      'save_favorites',
      'view_history',
      'offline_download',
      'ad_free_browsing'
    ],
    admin: [
      'read_content',
      'manage_content',
      'manage_users',
      'view_analytics'
    ],
    super_admin: [
      'read_content',
      'manage_content',
      'manage_users',
      'manage_system',
      'view_analytics',
      'system_administration'
    ]
  };

  return permissions[userLevel] || permissions.free;
};

// 速率限制中间件
const rateLimiter = require('rate-limiter-flexible');

const opts = {
  storeClient: new Map(), // 生产环境应使用Redis
  points: 100, // 每个用户每小时的请求点数
  duration: 3600, // 1小时
};

const rateLimiterMiddleware = new rateLimiter.RateLimiterMemory(opts);

const rateLimit = (req, res, next) => {
  rateLimiterMiddleware.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({
        error: 'Too many requests, please try again later.'
      });
    });
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requirePermission,
  requireAdmin,
  requireSuperAdmin,
  rateLimit
};