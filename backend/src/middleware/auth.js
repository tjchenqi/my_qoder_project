const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// JWT密钥（生产环境应该从环境变量获取）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-here';

// 速率限制器配置
const rateLimiter = new RateLimiterMemory({
  points: 100, // 请求次数
  duration: 3600, // 时间窗口（秒）
});

// 认证中间件
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || user.status !== 1) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// 可选认证中间件（用于可公开访问但能识别用户的接口）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      
      if (user && user.status === 1) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // 即使token无效也继续执行
    next();
  }
};

// 管理员权限检查
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.user_level !== 'admin' && req.user.user_level !== 'super_admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// 超级管理员权限检查
const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.user_level !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  
  next();
};

// 速率限制中间件
const rateLimit = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    await rateLimiter.consume(ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too Many Requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1
    });
  }
};

// 权限映射
const userPermissions = {
  free: ['read_content', 'basic_search'],
  vip: ['read_content', 'basic_search', 'ai_chat', 'advanced_search'],
  svip: ['read_content', 'basic_search', 'ai_chat', 'advanced_search', 'offline_reading', 'priority_support'],
  admin: ['read_content', 'basic_search', 'ai_chat', 'advanced_search', 'manage_content', 'manage_users'],
  super_admin: ['read_content', 'basic_search', 'ai_chat', 'advanced_search', 'offline_reading', 'priority_support', 'manage_content', 'manage_users', 'system_admin']
};

// 检查用户权限
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userLevel = req.user.user_level;
    const permissions = userPermissions[userLevel] || [];
    
    if (!permissions.includes(permission)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permission,
        userLevel: userLevel
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireSuperAdmin,
  rateLimit,
  checkPermission,
  JWT_SECRET,
  JWT_REFRESH_SECRET
};