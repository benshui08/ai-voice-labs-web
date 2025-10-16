interface HeroProps {
  title: string;
  highlight: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

/**
 * Hero 主视觉区组件
 *
 * 显示页面主标题、描述和 CTA 按钮
 */
export default function Hero({
  title,
  highlight,
  description,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
}: HeroProps) {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          {title}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
            {highlight}
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          {description}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onPrimaryClick}
            className="px-8 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
          >
            {primaryButtonText}
          </button>
          <button
            onClick={onSecondaryClick}
            className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-colors"
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </section>
  );
}