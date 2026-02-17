'use client';

import Link from 'next/link';

/**
 * Lucky Draw 参与记录
 * 每条记录对应一个 campaign round
 */
interface DrawRecord {
  id: string;
  campaignId: string;
  prize: string;
  /** 购买的积分包数量 */
  packs: number;
  /** 获得的总积分 */
  totalCredits: number;
  /** 持有的 slot 号码 */
  slots: number[];
  status: 'selling' | 'drawing' | 'completed';
  /** 开奖结果（仅 completed 时有值） */
  result?: {
    won: boolean;
    winnerSlot?: number;
  };
  date: string;
  href: string;
}

/** Mock data — 后续替换为 API */
const MOCK_RECORDS: DrawRecord[] = [
  {
    id: '1',
    campaignId: 'iphone17pro-launch',
    prize: 'iPhone 17 Pro',
    packs: 3,
    totalCredits: 300,
    slots: [892, 893, 894],
    status: 'selling',
    date: '2026-02-15',
    href: '/native/campaign/iphone17pro-launch',
  },
  {
    id: '2',
    campaignId: 'macbook-air-m4',
    prize: 'MacBook Air M4',
    packs: 5,
    totalCredits: 500,
    slots: [102, 103, 278, 279, 280],
    status: 'completed',
    result: { won: false, winnerSlot: 1547 },
    date: '2026-01-20',
    href: '/native/campaign/macbook-air-m4',
  },
];

/** 状态标签配色 */
const statusStyle: Record<DrawRecord['status'], { bg: string; text: string; label: string }> = {
  selling: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'In Progress' },
  drawing: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Drawing...' },
  completed: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Completed' },
};

/** 奖品图标（用 emoji 或 SVG 表示不同奖品类型） */
function PrizeIcon({ prize }: { prize: string }) {
  // 简单的 ticket/star 图标
  return (
    <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function LuckyDrawTab() {
  if (MOCK_RECORDS.length === 0) {
    return null; // 空状态由父组件处理
  }

  return (
    <div className="space-y-3 pt-2">
      {MOCK_RECORDS.map((record) => {
        const style = statusStyle[record.status];
        return (
          <Link key={record.id} href={record.href} className="block">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0d0025] via-[#150035] to-[#0a0020] border border-white/[0.06] p-4">
              {/* 背景光效 */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-fuchsia-600/10 blur-[60px]" />

              {/* 顶部：奖品 + 状态 */}
              <div className="relative flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* 奖品图标 */}
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <PrizeIcon prize={record.prize} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-[15px] leading-tight">{record.prize}</h4>
                    <p className="text-purple-300/60 text-xs mt-0.5">{record.date}</p>
                  </div>
                </div>
                {/* 状态 badge */}
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
              </div>

              {/* 数据行 */}
              <div className="relative flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-purple-300/50">Packs</span>
                  <span className="text-white font-semibold">{record.packs}</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <span className="text-purple-300/50">Credits</span>
                  <span className="text-white font-semibold">{record.totalCredits}</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <span className="text-purple-300/50">Slots</span>
                  <span className="text-white font-semibold">{record.slots.length}</span>
                </div>
              </div>

              {/* 结果行（仅 completed） */}
              {record.status === 'completed' && record.result && (
                <div className={`relative mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-xs ${
                  record.result.won ? 'text-amber-400' : 'text-gray-400'
                }`}>
                  {record.result.won ? (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span className="font-semibold">You Won!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8" />
                      </svg>
                      <span>Draw complete &middot; Winner: Slot #{record.result.winnerSlot}</span>
                    </>
                  )}
                </div>
              )}

              {/* 进行中的进度提示 */}
              {record.status === 'selling' && (
                <div className="relative mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-purple-300/50">Your slots: {record.slots.join(', ')}</span>
                  <span className="text-emerald-400 font-medium">View &rarr;</span>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}