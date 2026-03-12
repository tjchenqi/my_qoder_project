const axios = require('axios');

// AI问答处理
const aiChat = async (req, res, next) => {
  try {
    const { message, context_content_id } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    // 检查用户权限
    if (!req.user.canAccessFeature('ai_chat')) {
      return res.status(403).json({
        error: 'AI chat feature requires VIP membership'
      });
    }

    // 构建AI请求
    const aiResponse = await callAIModel(message, context_content_id, req.user);

    res.json({
      success: true,
      data: {
        response: aiResponse,
        user_level: req.user.user_level,
        remaining_quota: getRemainingQuota(req.user)
      }
    });

  } catch (error) {
    next(error);
  }
};

// 基于文章内容的问答
const aiAskAboutContent = async (req, res, next) => {
  try {
    const { content_id, question } = req.body;
    
    if (!content_id || !question) {
      return res.status(400).json({
        error: 'Content ID and question are required'
      });
    }

    // 检查用户权限
    if (!req.user.canAccessFeature('ai_chat')) {
      return res.status(403).json({
        error: 'AI chat feature requires VIP membership'
      });
    }

    // 获取文章内容
    const Content = require('../models').Content;
    const content = await Content.findByPk(content_id);
    
    if (!content) {
      return res.status(404).json({
        error: 'Content not found'
      });
    }

    // 构建基于文章的AI请求
    const context = `文章标题: ${content.title}\n文章内容: ${content.excerpt || content.content.substring(0, 500)}...`;
    const fullQuestion = `基于以下文章内容回答问题:\n${context}\n\n问题: ${question}`;

    const aiResponse = await callAIModel(fullQuestion, content_id, req.user);

    res.json({
      success: true,
      data: {
        response: aiResponse,
        content_title: content.title,
        user_level: req.user.user_level,
        remaining_quota: getRemainingQuota(req.user)
      }
    });

  } catch (error) {
    next(error);
  }
};

// 获取AI模型配置
const getAIModels = async (req, res, next) => {
  try {
    // 返回可用的AI模型列表
    const models = [
      {
        id: 'qwen-max',
        name: '通义千问Max',
        provider: '阿里云',
        description: '旗舰级大语言模型，适合复杂任务',
        max_tokens: 8192
      },
      {
        id: 'qwen-plus',
        name: '通义千问Plus',
        provider: '阿里云',
        description: '平衡性能与成本的通用模型',
        max_tokens: 32768
      },
      {
        id: 'ernie-bot',
        name: '文心一言',
        provider: '百度',
        description: '百度研发的大语言模型',
        max_tokens: 4096
      }
    ];

    res.json({
      success: true,
      data: {
        models
      }
    });

  } catch (error) {
    next(error);
  }
};

// 调用AI模型的核心函数
async function callAIModel(prompt, contextId, user) {
  try {
    // 根据用户等级选择合适的模型
    let modelConfig;
    if (user.user_level === 'svip') {
      modelConfig = {
        model: 'qwen-max',
        temperature: 0.7,
        max_tokens: 2048
      };
    } else {
      modelConfig = {
        model: 'qwen-plus',
        temperature: 0.8,
        max_tokens: 1024
      };
    }

    // 构建请求参数
    const requestBody = {
      model: modelConfig.model,
      messages: [
        {
          role: 'system',
          content: '你是AI Daily News的智能助手，专门解答AI行业相关问题。回答要专业、准确、易懂。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: modelConfig.temperature,
      max_tokens: modelConfig.max_tokens,
      top_p: 0.9,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    };

    // 调用对应的AI服务商API
    let apiUrl, headers, apiKey;
    
    if (modelConfig.model.startsWith('qwen')) {
      // 阿里云百炼平台
      apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
      apiKey = process.env.ALIYUN_API_KEY;
      headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      };
    } else if (modelConfig.model.startsWith('ernie')) {
      // 百度文心一言
      apiUrl = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions';
      apiKey = process.env.BAIDU_API_KEY;
      headers = {
        'Content-Type': 'application/json'
      };
      requestBody.access_token = apiKey;
    }

    const response = await axios.post(apiUrl, requestBody, { headers });
    
    // 解析响应
    let aiAnswer;
    if (modelConfig.model.startsWith('qwen')) {
      aiAnswer = response.data.output.text;
    } else if (modelConfig.model.startsWith('ernie')) {
      aiAnswer = response.data.result;
    }

    // 记录使用情况（简化实现）
    await recordAIUsage(user.id, modelConfig.model, prompt.length);

    return {
      answer: aiAnswer,
      model_used: modelConfig.model,
      tokens_used: aiAnswer.length, // 简化计算
      response_time: Date.now()
    };

  } catch (error) {
    console.error('AI Model call failed:', error);
    throw new Error('AI service temporarily unavailable');
  }
}

// 记录AI使用情况
async function recordAIUsage(userId, model, tokensUsed) {
  // 简化实现，实际应该存储到数据库
  console.log(`User ${userId} used ${model} with ${tokensUsed} tokens`);
}

// 获取剩余配额
function getRemainingQuota(user) {
  // 简化实现，实际应该查询数据库
  const quotas = {
    free: 0,
    vip: 50,    // 每月50次
    svip: -1    // 无限次
  };
  
  return quotas[user.user_level] || 0;
}

module.exports = {
  aiChat,
  aiAskAboutContent,
  getAIModels
};