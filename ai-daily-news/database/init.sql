-- AI Daily News 数据库初始化脚本
-- 创建时间: 2024年3月12日

USE ai_daily_news;

-- 1. 用户相关表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_level ENUM('free', 'vip', 'blacklisted') DEFAULT 'free',
    avatar_url VARCHAR(500),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_user_level (user_level),
    INDEX idx_registration_date (registration_date)
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    real_name VARCHAR(50),
    phone VARCHAR(20),
    company VARCHAR(100),
    position VARCHAR(50),
    industry VARCHAR(50),
    interests JSON,
    reading_preferences JSON,
    notification_settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS user_permissions (
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

-- 2. 内容相关表
CREATE TABLE IF NOT EXISTS news_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    source_type ENUM('rss', 'api', 'web_scraping', 'social_media') NOT NULL,
    category VARCHAR(50),
    reliability_score DECIMAL(3,2) DEFAULT 0.80,
    is_active BOOLEAN DEFAULT TRUE,
    last_crawled TIMESTAMP NULL,
    crawl_frequency VARCHAR(50) DEFAULT '30 MINUTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_source_type (source_type),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
);

CREATE TABLE IF NOT EXISTS articles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(300) NOT NULL,
    summary TEXT,
    content LONGTEXT,
    url VARCHAR(1000) NOT NULL,
    source_id BIGINT NOT NULL,
    author VARCHAR(100),
    publish_date TIMESTAMP NOT NULL,
    category VARCHAR(50),
    tags JSON,
    image_url VARCHAR(500),
    read_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'pending_review', 'published', 'rejected') DEFAULT 'draft',
    reviewed_by BIGINT NULL,
    reviewed_at TIMESTAMP NULL,
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

CREATE TABLE IF NOT EXISTS article_analytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    article_id BIGINT NOT NULL,
    view_count INT DEFAULT 0,
    unique_viewers INT DEFAULT 0,
    avg_reading_time INT DEFAULT 0,
    bounce_rate DECIMAL(5,4),
    engagement_score DECIMAL(5,4),
    social_shares JSON,
    collected_at DATE NOT NULL,
    
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_article_date (article_id, collected_at),
    INDEX idx_collected_at (collected_at)
);

-- 3. Agent配置表
CREATE TABLE IF NOT EXISTS agents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    agent_type ENUM('collector', 'filter', 'analyzer') NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    config JSON,
    prompt_template TEXT,
    skill_ids JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_agent_type (agent_type),
    INDEX idx_is_active (is_active)
);

CREATE TABLE IF NOT EXISTS agent_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agent_id BIGINT NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    task_params JSON,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    result_data JSON,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    
    FOREIGN KEY (agent_id) REFERENCES agents(id),
    INDEX idx_agent_id (agent_id),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at)
);

CREATE TABLE IF NOT EXISTS agent_performance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agent_id BIGINT NOT NULL,
    success_rate DECIMAL(5,4),
    avg_processing_time INT,
    error_count INT DEFAULT 0,
    task_count INT DEFAULT 0,
    measured_date DATE NOT NULL,
    
    FOREIGN KEY (agent_id) REFERENCES agents(id),
    UNIQUE KEY unique_agent_date (agent_id, measured_date),
    INDEX idx_measured_date (measured_date)
);

-- 4. 系统配置表
CREATE TABLE IF NOT EXISTS system_configs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSON NOT NULL,
    config_group VARCHAR(50),
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_config_key (config_key),
    INDEX idx_config_group (config_group)
);

CREATE TABLE IF NOT EXISTS llm_configs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    provider VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(500) NOT NULL,
    base_url VARCHAR(300),
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INT DEFAULT 2000,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    usage_limit INT,
    used_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_provider (provider),
    INDEX idx_is_default (is_default),
    INDEX idx_is_active (is_active)
);

-- 5. 统计分析表
CREATE TABLE IF NOT EXISTS daily_statistics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    stat_date DATE NOT NULL,
    new_users INT DEFAULT 0,
    active_users INT DEFAULT 0,
    articles_collected INT DEFAULT 0,
    articles_published INT DEFAULT 0,
    total_views INT DEFAULT 0,
    avg_engagement DECIMAL(5,4),
    revenue DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_stat_date (stat_date),
    INDEX idx_stat_date (stat_date)
);

CREATE TABLE IF NOT EXISTS user_behavior_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action_type VARCHAR(50) NOT NULL,
    target_id BIGINT,
    target_type VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    additional_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
);

-- 插入初始数据
INSERT INTO users (username, email, password_hash, user_level) VALUES 
('admin', 'admin@aidaily.news', '$2b$10$example_hash_admin', 'vip'),
('demo_user', 'demo@example.com', '$2b$10$example_hash_demo', 'free');

INSERT INTO user_profiles (user_id, real_name, company, position, interests) VALUES 
(1, '管理员', 'AI Daily News', '系统管理员', '["人工智能", "科技新闻", "机器学习"]'),
(2, '演示用户', 'Tech Corp', '产品经理', '["AI技术", "产品设计", "行业趋势"]');

INSERT INTO user_permissions (user_id, permission_type, granted_by) VALUES 
(1, 'admin', 1);

INSERT INTO news_sources (name, url, source_type, category, reliability_score) VALUES 
('TechCrunch', 'https://techcrunch.com', 'rss', 'technology', 0.95),
('The Verge', 'https://theverge.com', 'rss', 'technology', 0.92),
('MIT Technology Review', 'https://technologyreview.com', 'rss', 'research', 0.98),
('AI Weekly', 'https://aiweekly.co', 'rss', 'ai', 0.90);

INSERT INTO system_configs (config_key, config_value, config_group, description) VALUES 
('site_name', '"AI Daily News"', 'general', '网站名称'),
('site_description', '"专业的AI行业新闻聚合平台"', 'general', '网站描述'),
('default_language', '"zh-CN"', 'general', '默认语言'),
('max_daily_reads_free', '50', 'limits', '免费用户每日阅读限制'),
('max_daily_reads_vip', '200', 'limits', 'VIP用户每日阅读限制');

INSERT INTO llm_configs (provider, model_name, api_key, temperature, is_default, is_active) VALUES 
('dashscope', 'qwen-max', 'sk-xxxxxxxxxxxx', 0.7, TRUE, TRUE),
('dashscope', 'qwen-plus', 'sk-xxxxxxxxxxxx', 0.8, FALSE, TRUE),
('baidu', 'ernie-4.0', 'xxxxxxxxxxxxxx', 0.7, FALSE, TRUE);

-- 创建视图
CREATE VIEW v_article_stats AS
SELECT 
    a.id,
    a.title,
    a.category,
    a.publish_date,
    a.read_count,
    a.like_count,
    a.share_count,
    aa.engagement_score,
    ns.name as source_name
FROM articles a
LEFT JOIN article_analytics aa ON a.id = aa.article_id AND aa.collected_at = CURDATE()
LEFT JOIN news_sources ns ON a.source_id = ns.id
WHERE a.status = 'published';

-- 创建存储过程
DELIMITER //

CREATE PROCEDURE sp_update_daily_stats(IN target_date DATE)
BEGIN
    INSERT INTO daily_statistics (
        stat_date,
        new_users,
        active_users,
        articles_collected,
        articles_published,
        total_views
    )
    SELECT 
        target_date,
        COUNT(CASE WHEN DATE(registration_date) = target_date THEN 1 END) as new_users,
        COUNT(CASE WHEN DATE(last_login) = target_date THEN 1 END) as active_users,
        COUNT(CASE WHEN DATE(created_at) = target_date THEN 1 END) as articles_collected,
        COUNT(CASE WHEN status = 'published' AND DATE(publish_date) = target_date THEN 1 END) as articles_published,
        SUM(read_count) as total_views
    FROM users, articles
    WHERE target_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    ON DUPLICATE KEY UPDATE
        new_users = VALUES(new_users),
        active_users = VALUES(active_users),
        articles_collected = VALUES(articles_collected),
        articles_published = VALUES(articles_published),
        total_views = VALUES(total_views);
END //

DELIMITER ;

-- 显示创建成功的表
SHOW TABLES;