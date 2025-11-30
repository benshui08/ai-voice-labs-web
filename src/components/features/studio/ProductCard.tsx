'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt?: string;
  /** 布局方向：vertical 垂直（图上文下），horizontal 水平（文左图右） */
  layout?: 'vertical' | 'horizontal';
}

/**
 * 明星产品卡片组件
 *
 * 用于 Studio 首页展示产品功能
 * 支持两种布局：
 * - vertical: 垂直布局，图片在上，文字在下（默认）
 * - horizontal: 水平布局，文字在左，图片在右（长条形）
 */
export default function ProductCard({
  title,
  description,
  href,
  image,
  imageAlt,
  layout = 'vertical',
}: ProductCardProps) {
  if (layout === 'horizontal') {
    return (
      <Link
        href={href}
        className="group flex bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        {/* 左侧：内容区域 */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* 右侧：图片区域 */}
        <div className="relative w-2/5 min-h-[140px] bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
    );
  }

  // 默认垂直布局
  return (
    <Link
      href={href}
      className="group block bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* 图片区域 */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 内容区域 */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}