---
name: frontend-ui-component
description: 生成高质量的前端 UI 组件代码，包括按钮、表单、卡片、导航等常用组件。使用 React + Tailwind CSS 技术栈，支持响应式设计。当用户需要创建 UI 组件、设计界面元素或生成前端代码时使用此技能。
---

# 前端 UI 组件生成器

## 快速开始

生成 UI 组件时遵循以下流程:

1. **理解需求**: 确认组件类型、功能要求、样式偏好
2. **选择模板**: 根据组件类型选择合适的结构模板
3. **生成代码**: 使用 React + Tailwind CSS 生成可复用组件
4. **添加交互**: 包含必要的状态管理和事件处理
5. **响应式适配**: 确保在不同屏幕尺寸下正常工作

## 组件设计原则

### 1. 组件结构
```tsx
// 标准组件模板
interface ComponentProps {
  // 定义清晰的 props 接口
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Component: React.FC<ComponentProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick
}) => {
  return (
    <div className={cn('base-styles', {
      'variant-styles': variant === 'primary',
      'size-styles': size === 'md'
    })}>
      {children}
    </div>
  );
};
```

### 2. 样式规范
- 使用 Tailwind CSS utility classes
- 支持深色模式 (`dark:`)
- 响应式断点 (`sm:`, `md:`, `lg:`)
- 状态样式 (`hover:`, `focus:`, `active:`)
- 过渡动画 (`transition-`, `duration-`)

### 3. 可访问性
- 使用语义化 HTML 标签
- 添加适当的 ARIA 属性
- 支持键盘导航
- 确保颜色对比度

## 常用组件模板

### 按钮组件
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500': variant === 'secondary',
          'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-blue-500': variant === 'outline',
          'bg-transparent hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
          'opacity-50 cursor-not-allowed': disabled || isLoading,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
```

### 卡片组件
```tsx
interface CardProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  footer,
  className,
  hoverable = false,
  bordered = true,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl bg-white p-6',
        {
          'border border-gray-200': bordered,
          'shadow-sm hover:shadow-md transition-shadow': hoverable,
          'shadow-md': !hoverable,
        },
        className
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      
      <div className="text-gray-900">{children}</div>
      
      {footer && <div className="mt-4 pt-4 border-t border-gray-200">{footer}</div>}
    </div>
  );
};
```

### 表单输入组件
```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const inputId = id || crypto.randomUUID();
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
            'border px-3 py-2 transition-colors',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            {
              'border-red-300 focus:border-red-500 focus:ring-red-500': error,
              'pl-10': leftIcon,
              'pr-10': rightIcon,
            },
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};
```

## 工作流

### 组件生成流程

1. **需求分析**
   - 询问组件用途和场景
   - 确认需要的 props 和事件
   - 了解样式偏好 (颜色、尺寸等)

2. **组件设计**
   - 选择合适的基础模板
   - 定义 TypeScript 接口
   - 规划组件结构

3. **代码生成**
   - 编写组件逻辑
   - 添加 Tailwind 样式
   - 实现响应式布局

4. **质量检查**
   - [ ] TypeScript 类型完整
   - [ ] 支持暗色模式
   - [ ] 响应式适配
   - [ ] 可访问性完善
   - [ ] 代码注释清晰

## 工具函数

### cn 工具 (className 合并)
```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 示例

### 示例 1: 创建登录表单
```tsx
// 使用 Input 和 Button 组件组合
export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <Card className="w-full max-w-md mx-auto" title="欢迎登录">
      <form className="space-y-4">
        <Input
          type="email"
          label="邮箱"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <Input
          type="password"
          label="密码"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button variant="primary" className="w-full">
          登录
        </Button>
      </form>
    </Card>
  );
};
```

### 示例 2: 创建数据展示卡片
```tsx
interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  return (
    <Card hoverable>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className={cn(
              'mt-2 text-sm',
              change >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </Card>
  );
};
```

## 依赖安装

使用前确保安装必要依赖:

```bash
npm install clsx tailwind-merge
npm install -D tailwindcss
```

## 最佳实践

1. **命名一致性**: 使用有意义的变量名和类名
2. **单一职责**: 每个组件只做一件事
3. **可组合性**: 组件应该易于组合和复用
4. **性能优化**: 使用 React.memo 避免不必要的重渲染
5. **类型安全**: 完整的 TypeScript 类型定义

## 参考资源

- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [React 官方文档](https://react.dev)
- [Radix UI](https://www.radix-ui.com) - 无头组件库参考
- [shadcn/ui](https://ui.shadcn.com) - 组件设计灵感
