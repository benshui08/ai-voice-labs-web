/**
 * DailyTasks Context
 * 在 NativeLayout 层提供共享的 useDailyTasks 数据
 * - App 启动时预取数据，Mine 弹窗秒开
 * - 所有入口共享同一份状态，避免重复 API 请求
 */
'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useDailyTasks } from '@/hooks/useDailyTasks';

type DailyTasksContextValue = ReturnType<typeof useDailyTasks>;

const DailyTasksContext = createContext<DailyTasksContextValue | null>(null);

export function DailyTasksProvider({ children }: { children: ReactNode }) {
  const value = useDailyTasks();
  return (
    <DailyTasksContext.Provider value={value}>
      {children}
    </DailyTasksContext.Provider>
  );
}

/**
 * 使用共享的 DailyTasks 数据
 * 如果不在 Provider 内（如非 native 页面），回退到独立 hook
 */
export function useSharedDailyTasks(): DailyTasksContextValue {
  const ctx = useContext(DailyTasksContext);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!ctx) return useDailyTasks();
  return ctx;
}
