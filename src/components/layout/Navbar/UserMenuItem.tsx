'use client';

interface UserMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

/**
 * 用户菜单项组件
 *
 * @param icon - 图标元素
 * @param label - 菜单项标签
 * @param onClick - 点击处理函数
 * @param variant - 样式变体（default 或 danger）
 */
export default function UserMenuItem({
  icon,
  label,
  onClick,
  variant = 'default'
}: UserMenuItemProps) {
  const baseClasses = "w-full flex items-center gap-3 px-4 py-2 text-left transition-colors";

  const variantClasses = {
    default: "text-gray-700 hover:bg-gray-50",
    danger: "text-red-600 hover:bg-red-50"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <span className="w-5 h-5 flex-shrink-0">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}