const axios = require('axios');
const { User } = require('../models');

// AI对话接口
const aiChat = async (req, res) => {
  try {
    const { message, context_id } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 检查用户是否有AI聊天权限
    if (!req.user.canAccessFeature('ai_chat')) {
      return res.status(403).json({ 
        error: 'AI chat feature not available for your user level',
        user_level: req.user.user_level
      });
    }

    // 根据用户等级选择模型和参数
    let modelConfig;
    if (req.user.user_level === 'svip') {
      modelConfig = {
        model: 'qwen-max',
        maxTokens: 2048,
        temperature: 0.7
      };
    } else {
      modelConfig = {
        model: 'qwen-plus',
        maxTokens: 1024,
        temperature: 0.8
      };
    }

    // 调用AI模型
    const response = await callAIModel(message, context_id, req.user, modelConfig);
    
    // 记录使用情况
    await recordAIUsage(req.user.id, modelConfig.model);
    
    // 获取剩余配额
    const remainingQuota = await getRemainingQuota(req.user);

    res.json({
      success: true,
      response: response.text,
      model_used: modelConfig.model,
      tokens_used: response.tokensUsed,
      remaining_quota: remainingQuota,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      error: 'AI service unavailable',
      message: error.message 
    });
  }
};

// 基于文章内容的AI问答
const aiAskAboutContent = async (req, res) => {
  try {
    const { content_id, question } = req.body;
    
    if (!content_id || !question) {
      return res.status(400).json({ error: 'Content ID and question are required' });
    }

    // 检查用户权限
    if (!req.user.canAccessFeature('ai_chat')) {
      return res.status(403).json({ error: 'AI feature not available' });
    }

    // 获取文章内容
    const { Content } = require('../models');
    const content = await Content.findByPk(content_id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // 构造上下文提示
    const contextPrompt = `
你是一个AI新闻助手，请基于以下文章内容回答用户问题：

文章标题：${content.title}
文章摘要：${content.excerpt || '无摘要'}
文章内容：
${content.content.substring(0, 1000)}... # 限制长度避免token超限

用户问题：${question}

请给出准确、简洁的回答：
`;

    const modelConfig = {
      model: req.user.user_level === 'svip' ? 'qwen-max' : 'qwen-plus',
      maxTokens: req.user.user_level === 'svip' ? 1536 : 768,
      temperature: 0.7
    };

    const response = await callAIModel(contextPrompt, `content_${content_id}`, req.user, modelConfig);
    await recordAIUsage(req.user.id, modelConfig.model);

    res.json({
      success: true,
      response: response.text,
      content_title: content.title,
      model_used: modelConfig.model,
      tokens_used: response.tokensUsed
    });

  } catch (error) {
    console.error('AI content Q&A error:', error);
    res.status(500).json({ error: 'Failed to process content Q&A' });
  }
};

// 获取可用的AI模型列表
const getAIModels = async (req, res) => {
  try {
    const models = [
      {
        id: 'qwen-max',
        name: '通义千问 Max',
        provider: '阿里云',
        description: '最强推理能力的大语言模型',
        max_tokens: 2048,
        capabilities: ['文本生成', '问答', '分析', '创作']
      },
      {
        id: 'qwen-plus',
        name: '通义千问 Plus',
        provider: '阿里云',
        description: '平衡性能与成本的通用大语言模型',
        max_tokens: 1024,
        capabilities: ['文本生成', '问答', '总结']
      },
      {
        id: 'ernie-4.0',
        name: '文心一言 4.0',
        provider: '百度',
        description: '百度最新大语言模型',
        max_tokens: 2048,
        capabilities: ['文本生成', '问答', '多语言']
      }
    ];

    res.json({
      success: true,
      data: models
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to get AI models' });
  }
};

// 调用AI模型的核心函数
const callAIModel = async (prompt, contextId, user, modelConfig) => {
  try {
    // 这里实现具体的AI API调用逻辑
    // 支持阿里云DashScope和百度千帆平台
    
    const provider = modelConfig.model.startsWith('qwen') ? 'dashscope' : 'baidu';
    
    let apiUrl, apiKey, requestBody;
    
    if (provider === 'dashscope') {
      apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
      apiKey = process.env.DASHSCOPE_API_KEY;
      
      requestBody = {
        model: modelConfig.model,
        input: {
          prompt: prompt
        },
        parameters: {
          max_tokens: modelConfig.maxTokens,
          temperature: modelConfig.temperature,
          top_p: 0.8,
          stop: ['\n\nHuman:']
        }
      };
    } else {
      // 百度API调用逻辑
      apiUrl = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions';
      apiKey = process.env.BAIDU_API_KEY;
      
      requestBody = {
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: modelConfig.temperature,
        max_output_tokens: modelConfig.maxTokens
      };
    }

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // 解析响应
    let text, tokensUsed;
    if (provider === 'dashscope') {
      text = response.data.output.text;
      tokensUsed = response.data.usage?.total_tokens || 0;
    } else {
      text = response.data.result;
      tokensUsed = response.data.usage?.total_tokens || 0;
    }

    return {
      text: text.trim(),
      tokensUsed: tokensUsed,
      provider: provider
    };

  } catch (error) {
    console.error('AI model call error:', error);
    throw new Error(`AI service error: ${error.response?.data?.message || error.message}`);
  }
};

// 记录AI使用情况
const recordAIUsage = async (userId, model) => {
  try {
    // 这里可以实现详细的使用记录逻辑
    // 包括使用次数、token消耗、费用统计等
    console.log(`AI usage recorded - User: ${userId}, Model: ${model}`);
  } catch (error) {
    console.error('Failed to record AI usage:', error);
  }
};

// 获取用户剩余配额
const getRemainingQuota = async (user) => {
  try {
    // 根据用户等级返回不同的配额
    switch (user.user_level) {
      case 'free':
        return 0;
      case 'vip':
        // 这里应该查询实际使用记录
        return 50; // 示例：每月50次
      case 'svip':
        return Infinity; // 无限使用
      default:
        return 0;
    }
  } catch (error) {
    console.error('Failed to get remaining quota:', error);
    return 0;
  }
};

module.exports = {
  aiChat,
  aiAskAboutContent,
  getAIModels,
  callAIModel,
  recordAIUsage,
  getRemainingQuota
};