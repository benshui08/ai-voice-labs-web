'use client';

import { useState, useEffect } from 'react';
import { getFeatureFlags, updateSystemConfig, type FeatureFlags } from '@/actions/admin/system-config';
import { createMenuItems } from '@/config/native/createMenuConfig';

const FEATURE_LABELS: Record<string, string> = {
  voice: 'Text to Voice',
  dialogue: 'Text to Dialogue',
  clone: 'Voice Clone',
  music: 'AI Music',
  image: 'AI Image',
  'image-tools': 'BG Remover & HD Upscaler',
  video: 'AI Video',
  'video-downloader': 'Video Downloader',
};

export default function SystemConfigPage() {
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getFeatureFlags().then(setFlags);
  }, []);

  const handleToggle = (key: keyof FeatureFlags) => {
    if (!flags) return;
    setFlags({ ...flags, [key]: !flags[key] });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!flags) return;
    setSaving(true);
    await updateSystemConfig('feature_flags', flags, '功能入口显示控制');
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统配置</h1>
        <p className="text-sm text-gray-500 mt-1">管理全局功能开关和系统参数</p>
      </div>

      {/* 功能入口配置卡片 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">功能入口显示</h2>
          <p className="text-sm text-gray-500 mt-0.5">控制首页和菜单中各功能的显示与隐藏</p>
        </div>

        <div className="divide-y divide-gray-100">
          {flags === null ? (
            <div className="px-6 py-8 flex justify-center">
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            createMenuItems.map((item) => {
              const key = item.id as keyof FeatureFlags;
              if (!(key in flags)) return null;
              const enabled = flags[key];
              return (
                <div key={item.id} className="flex items-center justify-between px-6 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{FEATURE_LABELS[item.id] || item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      enabled ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className={`text-sm transition-opacity ${saved ? 'text-green-600 opacity-100' : 'opacity-0'}`}>
            ✓ 保存成功
          </span>
          <button
            onClick={handleSave}
            disabled={saving || flags === null}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
