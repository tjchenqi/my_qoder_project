#!/bin/bash

echo "🚀 启动AI Daily News完整应用"

# 启动后端服务
echo "1. 启动后端服务..."
cd /Users/tjboss/qoder/backend
npm start &

BACKEND_PID=$!

# 等待后端启动
sleep 3

# 测试后端API
echo "2. 测试后端API..."
curl -s http://localhost:3000/health | jq '.'
curl -s http://localhost:3000/api/content/list | jq '.pagination'

# 启动前端开发工具提示
echo "3. 前端小程序准备就绪"
echo "   请在微信开发者工具中打开项目:"
echo "   项目路径: /Users/tjboss/qoder/ai-daily-news/frontend/miniprogram"
echo "   AppID: wxa1234567890abcdef"

# 保持脚本运行
echo "4. 应用运行中...按Ctrl+C停止"
wait $BACKEND_PID