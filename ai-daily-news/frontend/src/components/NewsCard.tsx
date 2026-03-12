import React from 'react';
import { cn } from '../../utils/cn';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl?: string;
  publishTime: string;
  source: string;
  readCount?: number;
  isFeatured?: boolean;
}

interface NewsCardProps {
  news: NewsItem;
  variant?: 'default' | 'compact' | 'featured';
  onClick?: (news: NewsItem) => void;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  variant = 'default',
  onClick,
  className
}) => {
  const handleClick = () => {
    onClick?.(news);
  };

  if (variant === 'featured') {
    return (
      <article
        className={cn(
          'group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800',
          'cursor-pointer',
          className
        )}
        onClick={handleClick}
      >
        {news.imageUrl && (
          <div className="relative h-48 sm:h-56">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute top-3 left-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
              {news.category}
            </span>
          </div>
        )}
        <div className="p-5">
          <h2 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
            {news.title}
          </h2>
          <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
            {news.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{news.source}</span>
            <div className="flex items-center gap-2">
              <span>{news.publishTime}</span>
              {news.readCount && (
                <span>· 阅读 {news.readCount.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article
        className={cn(
          'border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
          'cursor-pointer',
          className
        )}
        onClick={handleClick}
      >
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {news.category}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 dark:text-white">
              {news.title}
            </h3>
            <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
              {news.summary}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>{news.source}</span>
              <span>{news.publishTime}</span>
              {news.readCount && (
                <span>阅读 {news.readCount.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 默认样式（带缩略图）
  return (
    <article
      className={cn(
        'overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800',
        'cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex gap-4 p-4">
        {news.imageUrl ? (
          <div className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-28 h-28 rounded-lg bg-gray-100 flex items-center justify-center dark:bg-gray-700">
            <svg
              className="h-12 w-12 text-gray-300 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              {news.category}
            </span>
          </div>
          
          <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 dark:text-white">
            {news.title}
          </h3>
          
          <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {news.summary}
          </p>
          
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{news.source}</span>
            <span>{news.publishTime}</span>
            {news.readCount && (
              <>
                <span>·</span>
                <span>阅读 {news.readCount.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};