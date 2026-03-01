export default function SubscribeLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#060613] flex flex-col overflow-auto">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-500/[0.07] blur-[100px]" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-purple-600/[0.08] blur-[80px]" />
      </div>

      {/* Close button skeleton */}
      <div
        className="absolute left-4 z-20 w-10 h-10 rounded-full bg-white/5 animate-pulse"
        style={{ top: 'calc(var(--safe-area-inset-top, 0px) + 8px)' }}
      />

      {/* Balance skeleton */}
      <div
        className="relative z-10 text-center pt-5 pb-4"
        style={{ marginTop: 'calc(var(--safe-area-inset-top, 0px) + 52px)' }}
      >
        <div className="h-3 w-24 mx-auto rounded bg-white/10 animate-pulse mb-4" />
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-500/10 animate-pulse" />
          <div className="h-9 w-32 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="h-3 w-28 mx-auto mt-2 rounded bg-white/10 animate-pulse" />
      </div>

      {/* Swap card skeleton */}
      <div className="relative z-10 flex-1 px-4 flex flex-col">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-4 space-y-3">
          <div className="bg-white/[0.04] rounded-2xl p-4 h-24 animate-pulse" />
          <div className="flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-white/5 animate-pulse" />
          </div>
          <div className="bg-white/[0.04] rounded-2xl p-4 h-24 animate-pulse" />
        </div>

        {/* Quick amounts skeleton */}
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-1 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      </div>

      {/* Buy button skeleton */}
      <div className="relative z-20 px-4 pt-3 pb-4" style={{ paddingBottom: 'calc(var(--safe-area-inset-bottom, 0px) + 16px)' }}>
        <div className="w-full h-14 rounded-2xl bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
