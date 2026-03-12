// 设计系统配置
export const theme = {
  colors: {
    // 深色主题
    dark: {
      background: {
        primary: '#1a1a1a',
        secondary: '#2d2d2d',
        card: '#252525'
      },
      text: {
        primary: '#e4e4e4',
        secondary: '#a0a0a0',
        muted: '#717171'
      },
      accent: '#6366f1',
      border: '#3f3f3f'
    },
    // 浅色主题
    light: {
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        card: '#ffffff'
      },
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
        muted: '#94a3b8'
      },
      accent: '#4f46e5',
      border: '#e2e8f0'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  typography: {
    fontFamily: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      serif: 'Playfair Display, Georgia, serif'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  }
};

// 深色模式 Hook
import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDark(savedMode === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  return { isDark, toggleDarkMode };
};