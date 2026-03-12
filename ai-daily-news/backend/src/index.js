const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const winston = require('winston');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 创建日志记录器
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ai-daily-news-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// 如果不是生产环境，也输出到控制台
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// 中间件配置
app.use(helmet()); // 安全头设置
app.use(cors()); // 跨域支持
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } })); // 请求日志
app.use(express.json({ limit: '10mb' })); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL编码解析

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  });
});

// API路由
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/content', require('./src/routes/content.routes'));
app.use('/api/user', require('./src/routes/user.routes'));
app.use('/api/ai', require('./src/routes/ai.routes'));

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  logger.error(err.stack);
  
  // 默认错误响应
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 数据库连接和服务器启动
async function startServer() {
  try {
    // 初始化数据库连接
    const database = require('./src/config/database');
    await database.authenticate();
    logger.info('Database connection established successfully');
    
    // 同步模型（生产环境谨慎使用）
    if (process.env.NODE_ENV !== 'production') {
      await database.sync({ alter: true });
      logger.info('Database models synchronized');
    }
    
    // 启动服务器
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// 启动应用
startServer();

module.exports = app;