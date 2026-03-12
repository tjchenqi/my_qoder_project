# 🗄️ AI Daily News 数据库设计

## 🏗️ 数据库架构概览

```
AI Daily News Database
├── 用户管理系统 (User Management)
├── 内容管理系统 (Content Management)  
├── Agent配置系统 (Agent Configuration)
├── 系统配置 (System Configuration)
└── 统计分析 (Analytics)
```

## 📋 核心数据表设计

### 1. 用户相关表

#### users (用户表)
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_level ENUM('free', 'vip', 'blacklisted') DEFAULT 'free',
    avatar_url VARCHAR(500),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_user_level (user_level),
    INDEX idx_registration_date (registration_date)
);
```

#### user_profiles (用户档案)
```sql
CREATE TABLE user_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    real_name VARCHAR(50),
    phone VARCHAR(20),
    company VARCHAR(100),
    position VARCHAR(50),
    industry VARCHAR(50),
    interests JSON, -- 存储用户兴趣标签数组
    reading_preferences JSON, -- 阅读偏好设置
    notification_settings JSON, -- 通知设置
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);
```

#### user_permissions (用户权限)
```sql
CREATE TABLE user_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    permission_type ENUM('admin', 'content_editor', 'moderator') NOT NULL,
    granted_by BIGINT NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_permission_type (permission_type)
);
```

### 2. 内容相关表

#### news_sources (新闻源)
```sql
CREATE TABLE news_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    source_type ENUM('rss', 'api', 'web_scraping', 'social_media') NOT NULL,
    category VARCHAR(50),
    reliability_score DECIMAL(3,2) DEFAULT 0.80, -- 可靠性评分 (0-1)
    is_active BOOLEAN DEFAULT TRUE,
    last_crawled TIMESTAMP NULL,
    crawl_frequency INTERVAL MINUTE(30), -- 抓取频率
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_source_type (source_type),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
);
```

#### articles (文章表)
```sql
CREATE TABLE articles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(300) NOT NULL,
    summary TEXT,
    content LONGTEXT,
    url VARCHAR(1000) NOT NULL,
    source_id BIGINT NOT NULL,
    author VARCHAR(100),
    publish_date TIMESTAMP NOT NULL,
    category VARCHAR(50),
    tags JSON, -- 标签数组
    image_url VARCHAR(500),
    read_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE, -- 是否精选
    status ENUM('draft', 'pending_review', 'published', 'rejected') DEFAULT 'draft',
    reviewed_by BIGINT NULL, -- 审核人ID
    reviewed_at TIMESTAMP NULL, -- 审核时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (source_id) REFERENCES news_sources(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    INDEX idx_publish_date (publish_date),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_source_id (source_id),
    FULLTEXT idx_title_content (title, content)
);
```

#### article_analytics (文章分析数据)
```sql
CREATE TABLE article_analytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    article_id BIGINT NOT NULL,
    view_count INT DEFAULT 0,
    unique_viewers INT DEFAULT 0,
    avg_reading_time INT DEFAULT 0, -- 平均阅读时间(秒)
    bounce_rate DECIMAL(5,4), -- 跳出率
    engagement_score DECIMAL(5,4), -- 用户参与度评分
    social_shares JSON, -- 各平台分享数据
    collected_at DATE NOT NULL,
    
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_article_date (article_id, collected_at),
    INDEX idx_collected_at (collected_at)
);
```

### 3. Agent配置表

#### agents (Agent配置)
```sql
CREATE TABLE agents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    agent_type ENUM('collector', 'filter', 'analyzer') NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    config JSON, -- Agent配置JSON
    prompt_template TEXT, -- 提示词模板
    skill_ids JSON, -- 技能ID数组
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_agent_type (agent_type),
    INDEX idx_is_active (is_active)
);
```

#### agent_tasks (Agent任务记录)
```sql
CREATE TABLE agent_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agent_id BIGINT NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    task_params JSON, -- 任务参数
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    result_data JSON, -- 任务结果
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    
    FOREIGN KEY (agent_id) REFERENCES agents(id),
    INDEX idx_agent_id (agent_id),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at)
);
```

#### agent_performance (Agent性能统计)
```sql
CREATE TABLE agent_performance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agent_id BIGINT NOT NULL,
    success_rate DECIMAL(5,4), -- 成功率
    avg_processing_time INT, -- 平均处理时间(毫秒)
    error_count INT DEFAULT 0,
    task_count INT DEFAULT 0,
    measured_date DATE NOT NULL,
    
    FOREIGN KEY (agent_id) REFERENCES agents(id),
    UNIQUE KEY unique_agent_date (agent_id, measured_date),
    INDEX idx_measured_date (measured_date)
);
```

### 4. 系统配置表

#### system_configs (系统配置)
```sql
CREATE TABLE system_configs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSON NOT NULL,
    config_group VARCHAR(50), -- 配置组别
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE, -- 是否加密存储
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_config_key (config_key),
    INDEX idx_config_group (config_group)
);
```

#### llm_configs (大模型配置)
```sql
CREATE TABLE llm_configs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    provider VARCHAR(50) NOT NULL, -- 提供商名称
    model_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(500) NOT NULL, -- 加密存储
    base_url VARCHAR(300),
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INT DEFAULT 2000,
    is_default BOOLEAN DEFAULT FALSE, -- 是否默认模型
    is_active BOOLEAN DEFAULT TRUE,
    usage_limit INT, -- 使用次数限制
    used_count INT DEFAULT 0, -- 已使用次数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_provider (provider),
    INDEX idx_is_default (is_default),
    INDEX idx_is_active (is_active)
);
```

### 5. 统计分析表

#### daily_statistics (每日统计数据)
```sql
CREATE TABLE daily_statistics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    stat_date DATE NOT NULL,
    new_users INT DEFAULT 0, -- 新增用户数
    active_users INT DEFAULT 0, -- 活跃用户数
    articles_collected INT DEFAULT 0, -- 采集文章数
    articles_published INT DEFAULT 0, -- 发布文章数
    total_views INT DEFAULT 0, -- 总浏览量
    avg_engagement DECIMAL(5,4), -- 平均参与度
    revenue DECIMAL(10,2) DEFAULT 0.00, -- 收入
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_stat_date (stat_date),
    INDEX idx_stat_date (stat_date)
);
```

#### user_behavior_logs (用户行为日志)
```sql
CREATE TABLE user_behavior_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action_type VARCHAR(50) NOT NULL, -- 操作类型
    target_id BIGINT, -- 操作对象ID
    target_type VARCHAR(50), -- 对象类型
    ip_address VARCHAR(45),
    user_agent TEXT,
    additional_data JSON, -- 额外数据
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
);
```

## 🔗 表关系图

```
用户体系:
users ←→ user_profiles (1:1)
users ←→ user_permissions (1:N)
users ←→ articles (1:N) [审核关系]
users ←→ user_behavior_logs (1:N)

内容体系:
news_sources ←→ articles (1:N)
articles ←→ article_analytics (1:N)

Agent体系:
agents ←→ agent_tasks (1:N)
agents ←→ agent_performance (1:N)

配置体系:
users ←→ system_configs (1:N) [更新关系]
users ←→ llm_configs (1:N) [管理关系]
```

## 📊 索引优化策略

### 核心查询索引
```sql
-- 用户相关查询
CREATE INDEX idx_users_email_active ON users(email, is_active);
CREATE INDEX idx_users_level_regdate ON users(user_level, registration_date);

-- 内容相关查询
CREATE INDEX idx_articles_status_date ON articles(status, publish_date);
CREATE INDEX idx_articles_category_featured ON articles(category, is_featured);
CREATE INDEX idx_articles_source_status ON articles(source_id, status);

-- 统计分析查询
CREATE INDEX idx_daily_stats_date ON daily_statistics(stat_date);
CREATE INDEX idx_behavior_logs_user_action ON user_behavior_logs(user_id, action_type, created_at);
```

## 🔒 安全设计考虑

### 数据加密
- 敏感字段使用AES-256加密
- API密钥等凭据加密存储
- 用户密码使用bcrypt哈希

### 访问控制
- 基于角色的权限控制(RBAC)
- 数据行级安全策略
- 操作审计日志

### 备份策略
- 每日增量备份
- 每周全量备份
- 异地灾备存储

---
*数据库版本：MySQL 8.0+*
*设计时间：2024年3月12日*