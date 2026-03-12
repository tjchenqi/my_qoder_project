-- 简化版AI Daily News数据库初始化脚本
-- 专为现有后端代码设计

USE ai_daily_news;

-- 用户表（适配现有Sequelize模型）
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    openid VARCHAR(128) NOT NULL UNIQUE,
    session_key VARCHAR(128),
    unionid VARCHAR(128),
    nickname VARCHAR(100),
    avatar VARCHAR(500),
    gender TINYINT DEFAULT 0 COMMENT '0-未知 1-男 2-女',
    city VARCHAR(50),
    province VARCHAR(50),
    country VARCHAR(50),
    language VARCHAR(20),
    user_level ENUM('free', 'vip', 'svip') DEFAULT 'free',
    vip_expire_at DATETIME NULL,
    points INT DEFAULT 0,
    status TINYINT DEFAULT 1 COMMENT '1-正常 0-禁用',
    last_login_at DATETIME NULL,
    login_count INT DEFAULT 0,
    last_check_in_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_openid (openid),
    INDEX idx_user_level (user_level),
    INDEX idx_status (status)
);

-- 内容表（简化版）
CREATE TABLE contents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    original_title VARCHAR(200),
    original_content LONGTEXT,
    original_url VARCHAR(500),
    language VARCHAR(10) DEFAULT 'zh-CN',
    category VARCHAR(50) NOT NULL,
    source VARCHAR(100),
    author VARCHAR(100),
    publish_time DATETIME,
    quality_score DECIMAL(3,2) DEFAULT 0.00,
    relevance_score DECIMAL(3,2) DEFAULT 0.00,
    publish_status ENUM('draft', 'pending', 'published', 'rejected') DEFAULT 'draft',
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    collected_count INT DEFAULT 0,
    tags JSON,
    summary TEXT,
    sentiment VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_publish_status (publish_status),
    INDEX idx_publish_time (publish_time),
    INDEX idx_view_count (view_count),
    INDEX idx_like_count (like_count),
    INDEX idx_quality_score (quality_score),
    FULLTEXT idx_title_content (title, content, excerpt)
);

-- 用户收藏表
CREATE TABLE user_favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    folder VARCHAR(50) DEFAULT 'default',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_content_id (content_id),
    INDEX idx_folder (folder),
    UNIQUE KEY unique_user_content (user_id, content_id)
);

-- 新闻源表
CREATE TABLE news_sources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    source_type ENUM('rss', 'api', 'web_scraping', 'social_media') NOT NULL,
    category VARCHAR(50),
    reliability_score DECIMAL(3,2) DEFAULT 0.80,
    is_active BOOLEAN DEFAULT TRUE,
    last_crawled DATETIME NULL,
    crawl_frequency VARCHAR(50) DEFAULT '30 MINUTE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_source_type (source_type),
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
);

-- 插入测试数据
INSERT INTO users (openid, nickname, user_level, points) VALUES 
('test_openid_1', '测试用户1', 'free', 100),
('test_openid_2', '测试用户2', 'vip', 500),
('test_openid_3', '测试用户3', 'svip', 1000);

INSERT INTO news_sources (name, url, source_type, category) VALUES 
('TechCrunch中文网', 'https://techcrunch.cn', 'rss', 'technology'),
('AI前线', 'https://www.infoq.cn/topic/AI', 'web_scraping', 'ai'),
('机器之心', 'https://www.jiqizhixin.com', 'rss', 'ai');

INSERT INTO contents (title, excerpt, content, category, source, publish_time, publish_status) VALUES 
('AI大模型技术最新进展', '本文介绍了近期AI大模型的技术突破...', '详细内容...', 'ai', 'AI前线', NOW(), 'published'),
('生成式AI在企业中的应用', '探讨生成式AI如何改变企业运营模式...', '详细内容...', 'business', 'TechCrunch中文网', DATE_SUB(NOW(), INTERVAL 1 DAY), 'published'),
('机器学习算法优化新方法', '研究人员提出了一种新的机器学习优化算法...', '详细内容...', 'research', '机器之心', DATE_SUB(NOW(), INTERVAL 2 DAY), 'published');

-- 创建视图便于查询
CREATE VIEW v_popular_contents AS
SELECT 
    c.id,
    c.title,
    c.excerpt,
    c.category,
    c.source,
    c.publish_time,
    c.view_count,
    c.like_count,
    c.share_count,
    (c.view_count + c.like_count * 2 + c.share_count * 3) as popularity_score
FROM contents c
WHERE c.publish_status = 'published'
ORDER BY (c.view_count + c.like_count * 2 + c.share_count * 3) DESC;

-- 显示创建的表
SHOW TABLES;