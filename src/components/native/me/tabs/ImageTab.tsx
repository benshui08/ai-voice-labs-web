'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getImageRecords, deleteImageRecord, getImageTaskStatus, type ImageRecord } from '@/actions/image';
import { getImageToolRecords, type ImageToolRecord } from '@/actions/image-tools';
import { useImageTaskPolling } from '@/hooks/useImageTaskPolling';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImageCard } from '../cards';
import ImageToolCard from '../cards/ImageToolCard';
import ImageDetailModal from '../ImageDetailModal';
import ImageToolDetailModal from '../ImageToolDetailModal';
import { EmptyState, LoadingState, LoadMoreButton, DateGroupedList, type TabProps } from './shared';

const PAGE_SIZE = 20;

type SubTab = 'ai' | 'tools';

export default function ImageTab({ isActive, refreshTrigger, onDetailOpen }: TabProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<SubTab>('ai');

  // AI 生成记录
  const [records, setRecords] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null);

  // 图像处理记录
  const [toolRecords, setToolRecords] = useState<ImageToolRecord[]>([]);
  const [toolLoading, setToolLoading] = useState(false);
  const [toolLoadingMore, setToolLoadingMore] = useState(false);
  const [toolHasMore, setToolHasMore] = useState(true);
  const [selectedTool, setSelectedTool] = useState<ImageToolRecord | null>(null);

  // 加载 AI 生成
  const fetchRecords = useCallback(async (offset = 0, isRefresh = false) => {
    if (offset === 0) setLoading(true);
    else setLoadingMore(true);
    try {
      const data = await getImageRecords(PAGE_SIZE, offset);
      if (isRefresh || offset === 0) setRecords(data);
      else setRecords((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error('Failed to fetch image records:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // 加载图像处理
  const fetchToolRecords = useCallback(async (offset = 0, isRefresh = false) => {
    if (offset === 0) setToolLoading(true);
    else setToolLoadingMore(true);
    try {
      const data = await getImageToolRecords(PAGE_SIZE, offset);
      if (isRefresh || offset === 0) setToolRecords(data);
      else setToolRecords((prev) => [...prev, ...data]);
      setToolHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error('Failed to fetch image tool records:', error);
    } finally {
      setToolLoading(false);
      setToolLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return;
    if (subTab === 'ai' && records.length === 0) fetchRecords(0);
    if (subTab === 'tools' && toolRecords.length === 0) fetchToolRecords(0);
  }, [isActive, subTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isActive || !refreshTrigger) return;
    if (subTab === 'ai') fetchRecords(0, true);
    else fetchToolRecords(0, true);
  }, [refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // 轮询 AI 生成中的任务
  useImageTaskPolling({
    records,
    enabled: isActive && subTab === 'ai',
    onStatusUpdate: useCallback((taskId: string, status: Awaited<ReturnType<typeof getImageTaskStatus>>) => {
      setRecords((prev) =>
        prev.map((r) =>
          r.task_id === taskId
            ? { ...r, status: status.status, image_url: status.imageUrl || r.image_url, error: status.error || r.error }
            : r
        )
      );
    }, []),
  });

  const handleClick = (image: ImageRecord) => {
    if (image.status === 'SUCCESS') {
      setSelectedImage(image);
      onDetailOpen?.();
    }
  };

  const handleRecreate = (image: ImageRecord) => {
    const params = new URLSearchParams();
    if (image.prompt) params.set('prompt', image.prompt);
    router.push(`/native/create/image?${params.toString()}`);
    setSelectedImage(null);
  };

  const handleDelete = async (image: ImageRecord) => {
    await deleteImageRecord(image.id);
    setRecords((prev) => prev.filter((i) => i.id !== image.id));
  };

  const handleToolClick = (record: ImageToolRecord) => {
    if (record.status === 'SUCCESS') {
      setSelectedTool(record);
      onDetailOpen?.();
    }
  };

  const filtered = records.filter((i) => i.status !== 'FAILURE');
  const filteredTools = toolRecords.filter((r) => r.status !== 'FAILURE');

  return (
    <>
      {/* 子切换：AI生成 / 图像处理 */}
      <div className="flex gap-1 bg-gray-800/40 rounded-lg p-1 mb-4">
        <button
          onClick={() => setSubTab('ai')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            subTab === 'ai' ? 'bg-gray-700 text-white' : 'text-gray-500'
          }`}
        >
          {t('native.me.imageTabs.ai') || 'AI 生成'}
        </button>
        <button
          onClick={() => setSubTab('tools')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
            subTab === 'tools' ? 'bg-gray-700 text-white' : 'text-gray-500'
          }`}
        >
          {t('native.me.imageTabs.tools') || '图像处理'}
        </button>
      </div>

      {/* AI 生成 */}
      {subTab === 'ai' && (
        <>
          {loading && records.length === 0 ? (
            <LoadingState />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={t('native.me.emptyState.noContent')}
              subtitle={t('native.me.emptyState.createFirstImage')}
              createLink="/native/create/image"
            />
          ) : (
            <>
              <DateGroupedList
                records={filtered}
                getDateStr={(i) => i.created_at?.toString() ?? ''}
                getKey={(i) => i.task_id}
                renderCard={(image) => (
                  <ImageCard image={image} onClick={() => handleClick(image)} />
                )}
              />
              {hasMore && <LoadMoreButton loading={loadingMore} onClick={() => fetchRecords(records.length)} />}
            </>
          )}
        </>
      )}

      {/* 图像处理 */}
      {subTab === 'tools' && (
        <>
          {toolLoading && toolRecords.length === 0 ? (
            <LoadingState />
          ) : filteredTools.length === 0 ? (
            <EmptyState
              title={t('native.me.emptyState.noContent')}
              subtitle={t('native.me.emptyState.createFirstImageTool') || '使用 BG Remove 或 HD Upscale 处理图片'}
              createLink="/native/create/image-tools"
            />
          ) : (
            <>
              <DateGroupedList
                records={filteredTools}
                getDateStr={(r) => r.createdAt}
                getKey={(r) => r.taskId}
                renderCard={(record) => (
                  <ImageToolCard record={record} onClick={() => handleToolClick(record)} />
                )}
              />
              {toolHasMore && <LoadMoreButton loading={toolLoadingMore} onClick={() => fetchToolRecords(toolRecords.length)} />}
            </>
          )}
        </>
      )}

      {/* Detail Modals */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onRecreate={handleRecreate}
          onDelete={handleDelete}
        />
      )}
      {selectedTool && selectedTool.resultImageUrl && (
        <ImageToolDetailModal
          result={{
            taskId: selectedTool.taskId,
            toolType: selectedTool.toolType,
            originalImageUrl: selectedTool.originalImageUrl,
            resultImageUrl: selectedTool.resultImageUrl,
            creditsUsed: selectedTool.creditsUsed,
          }}
          onClose={() => setSelectedTool(null)}
          onProcessNew={() => { setSelectedTool(null); router.push('/native/create/image-tools'); }}
        />
      )}
    </>
  );
}
