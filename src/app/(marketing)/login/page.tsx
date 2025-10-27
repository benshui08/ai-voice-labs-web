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
      <LoginForm />
    </div>
  );
}