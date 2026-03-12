import React from 'react';
import ReactDOM from 'react-dom/client';
import { NewsPage } from './pages/NewsPage';
import './index.css';

// 应用根组件
const App: React.FC = () => {
  return (
    <div className="font-sans antialiased">
      <NewsPage />
    </div>
  );
};

// 渲染应用
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);