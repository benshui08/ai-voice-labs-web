import { Suspense } from 'react';
import LoginForm from '@/components/features/auth/LoginForm';

/**
 * 登录页面（Page Component）
 *
 * 职责：
 * - 定义页面布局
 * - 路由配置
 * - 组合功能组件
 *
 * 注意：不包含业务逻辑！所有逻辑都在 LoginForm 和 useLogin 中
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4">
      <Suspense fallback={
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-100 rounded w-32 mx-auto animate-pulse"></div>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}