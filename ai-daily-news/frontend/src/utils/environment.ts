// 环境配置管理
const config = {
  development: {
    apiUrl: 'http://localhost:3001/api',
    debug: true,
    showDevTools: true,
    loggingLevel: 'verbose'
  },
  production: {
    apiUrl: 'https://api.ai-daily-news.com',
    debug: false,
    showDevTools: false,
    loggingLevel: 'error'
  }
};

// 根据环境返回相应配置
export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return config[env];
};

// 开发工具函数
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};