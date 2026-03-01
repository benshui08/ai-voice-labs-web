export default function CrashGameLoading() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header skeleton */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
        <div className="w-6 h-6 rounded bg-white/10 animate-pulse" />
        <div className="h-5 w-28 rounded bg-white/10 animate-pulse" />
      </div>

      {/* Balance bar skeleton */}
      <div className="mx-4 mt-3 mb-3 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
            <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-16 rounded-lg bg-amber-500/10 animate-pulse" />
            <div className="h-7 w-14 rounded-lg bg-purple-500/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Multiplier display skeleton */}
      <div className="flex items-center justify-center py-16">
        <div className="w-48 h-48 rounded-full border-2 border-purple-500/20 flex items-center justify-center">
          <div className="h-10 w-24 rounded bg-white/10 animate-pulse" />
        </div>
      </div>

      {/* Betting panel skeleton */}
      <div className="px-4 space-y-3">
        <div className="h-14 rounded-xl bg-white/5 animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-1 h-10 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
