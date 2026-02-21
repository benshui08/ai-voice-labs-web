'use client';

import { useMemo } from 'react';

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

interface ConfettiBurstProps {
  /** 粒子数量，默认 24 */
  count?: number;
}

/**
 * 卡片内撒花组件
 * 粒子在容器内从中心向四周飞散，使用 overflow-hidden 裁剪
 * 使用 globals.css 中的 animate-confetti-burst 动画
 */
export default function ConfettiBurst({ count = 24 }: ConfettiBurstProps) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 40 + Math.random() * 80;
      return {
        id: i,
        w: Math.random() * 5 + 3,
        h: Math.random() * 5 + 3,
        color: COLORS[i % COLORS.length],
        round: i % 2 === 0,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        rot: Math.random() * 720 - 360,
        delay: Math.random() * 0.2,
      };
    }), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-burst"
          style={{
            left: '50%',
            top: '50%',
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '2px',
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--rot': `${p.rot}deg`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
