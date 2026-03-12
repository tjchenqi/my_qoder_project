const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./config/database');
const { User, Content, UserFavorite } = require('./models');

// 路由导入
const authRoutes = require('./routes/auth.routes');
const contentRoutes = require('./routes/content.routes');
const userRoutes = require('./routes/user.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl 
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  console.error('Error stack:', err.stack);
  
  // Sequelize验证错误
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => e.message)
    });
  }
  
  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // 默认服务器错误
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接（仅在非内存模式下）
    if (process.env.USE_MEMORY_DB !== 'true') {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully');
      
      // 同步数据库模型（生产环境应使用迁移）
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized');
    } else {
      console.log('⚠️  Using memory database mode - skipping database sync');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;