# 🤖 AI Daily News - AI行业每日快讯

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0--dev-orange.svg)](VERSION)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](BUILD)

## 📖 项目简介

AI Daily News 是一个专注于AI行业的每日新闻聚合平台，通过智能Agent自动采集海外优质AI资讯，结合国内大语言模型进行智能翻译和内容分析，为用户提供高质量的中文AI行业资讯服务。

### 🎯 核心功能

- **智能采集**: 海外AI新闻自动采集（TechCrunch、The Verge、MIT Tech Review等）
- **智能翻译**: 基于国内大模型的高质量中英翻译
- **内容筛选**: 多维度内容质量和相关性评估
- **智能分析**: AI驱动的话题聚类和趋势分析
- **个性推荐**: 基于用户偏好的智能内容推荐

## 🏗️ 技术架构

### 前端技术栈
```
微信小程序原生开发
├── 框架: 微信小程序原生
├── UI库: Vant Weapp + 自定义组件
├── 状态管理: 原生全局数据
└── 网络请求: 微信原生API
```

### 后端技术栈
```
Node.js微服务架构
├── 运行环境: Node.js 18+
├── 框架: Express.js
├── 数据库: MySQL 8.0 + Redis 7.0
├── 消息队列: RabbitMQ/Kafka
└── 部署: Docker + Kubernetes
```

### AI服务架构
```
多Agent协同系统
├── 采集Agent: 海外新闻源采集
├── 翻译Agent: 智能中英翻译
├── 筛选Agent: 内容质量把关
└── 分析Agent: 深度内容分析
```

## 🚀 快速开始

### 环境准备
```bash
# Node.js 环境
node >= 18.0.0
npm >= 8.0.0

# 数据库
MySQL >= 8.0
Redis >= 7.0

# 微信开发工具
微信开发者工具最新版本
```

### 项目安装
```bash
# 克隆项目
git clone https://github.com/your-org/ai-daily-news.git
cd ai-daily-news

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.development
# 编辑配置文件，填入相应参数

# 数据库初始化
npm run db:migrate
npm run db:seed

# 启动开发服务
npm run dev
```

### 微信小程序开发
```bash
# 进入前端目录
cd frontend

# 安装前端依赖
npm install

# 在微信开发者工具中打开项目
# 项目路径: /path/to/ai-daily-news/frontend
```

## 📁 项目结构

```
ai-daily-news/
├── backend/              # 后端服务
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   └── utils/        # 工具函数
│   ├── config/           # 配置文件
│   └── tests/            # 测试代码
├── frontend/             # 前端小程序
│   ├── pages/            # 页面文件
│   ├── components/       # 组件库
│   ├── utils/            # 工具函数
│   └── assets/           # 静态资源
├── docs/                 # 项目文档
│   ├── design/           # 设计文档
│   ├── api/              # API文档
│   └── deployment/       # 部署文档
├── docker/               # Docker配置
├── scripts/              # 脚本文件
└── tests/                # 集成测试
```

## 🛠️ 开发指南

### 代码规范
```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 单元测试
npm run test:unit

# 集成测试
npm run test:integration
```

### Git工作流
```bash
# 创建功能分支
git checkout -b feature/新功能名称

# 提交代码
git add .
git commit -m "feat: 添加新功能描述"

# 推送分支
git push origin feature/新功能名称

# 创建Pull Request
# 通过代码审查后合并到develop分支
```

### 环境配置
```bash
# 开发环境
.env.development

# 测试环境
.env.testing

# 生产环境
.env.production
```

## 📊 API文档

详细的API文档请参考: [API Documentation](docs/api/README.md)

### 核心API接口
```
用户认证: POST /api/auth/login
内容获取: GET /api/content/list
AI问答: POST /api/ai/chat
用户收藏: POST /api/user/favorite
```

## 🚢 部署指南

### Docker部署
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 云服务部署
```bash
# 阿里云部署脚本
./scripts/deploy-alicloud.sh

# AWS部署脚本
./scripts/deploy-aws.sh
```

## 🧪 测试

### 测试覆盖率
```bash
# 运行所有测试
npm run test

# 生成测试报告
npm run test:coverage

# 性能测试
npm run test:performance
```

## 📈 监控与运维

### 系统监控
```
APM监控: Application Performance Monitoring
日志收集: ELK Stack (Elasticsearch, Logstash, Kibana)
指标监控: Prometheus + Grafana
告警系统: 钉钉/企业微信机器人
```

### 性能指标
```
API响应时间: < 500ms
页面加载时间: < 2s
系统可用性: 99.9%
并发用户数: 1000+
```

## 🤝 贡献指南

欢迎任何形式的贡献！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献规范
- 遵循代码风格指南
- 编写单元测试
- 更新相关文档
- 通过CI/CD检查

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- 项目维护者: [你的名字]
- 邮箱: [your-email@example.com]
- 问题反馈: [Issues](https://github.com/your-org/ai-daily-news/issues)
- 官方网站: [https://ai-daily-news.com](https://ai-daily-news.com)

## 🙏 致谢

感谢以下开源项目的支持：
- [Express.js](https://expressjs.com/)
- [WeChat Mini Program](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Vant Weapp](https://vant-contrib.gitee.io/vant-weapp/)
- [MySQL](https://www.mysql.com/)
- [Redis](https://redis.io/)

---
*Made with ❤️ by AI Daily News Team*