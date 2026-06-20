'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';

const MAX_SECONDS = 30;

interface AudioUploaderProps {
  audioBase64: string | null;
  audioFileName: string | null;
  onAudioChange: (base64: string | null, fileName: string | null) => void;
}

export default function AudioUploader({
  audioBase64,
  audioFileName,
  onAudioChange,
}: AudioUploaderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const setUrl = useCallback((url: string | null) => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = url;
    setAudioUrl(url);
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setElapsed(0);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : '';

      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const ext = (mr.mimeType || '').includes('ogg') ? 'ogg' : 'webm';
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setUrl(url);

        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          onAudioChange(base64, `recording.${ext}`);
        };
        reader.readAsDataURL(blob);
      };

      mr.start(100);
      setIsRecording(true);
      setElapsed(0);

      let secs = 0;
      timerRef.current = setInterval(() => {
        secs += 1;
        setElapsed(secs);
        if (secs >= MAX_SECONDS) {
          stopRecording();
        }
      }, 1000);
    } catch {
      alert('Microphone access denied. Please allow microphone access and try again.');
    }
  }, [onAudioChange, setUrl, stopRecording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  const togglePlayback = useCallback(() => {
    if (!audioUrl) return;
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play();
      audioRef.current = audio;
      setIsPlaying(true);
    }
  }, [audioUrl, isPlaying]);

  const removeAudio = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    setUrl(null);
    onAudioChange(null, null);
    setIsPlaying(false);
  }, [onAudioChange, setUrl]);

  // Preview state
  if (audioBase64 && audioFileName) {
    return (
      <div className="p-4 bg-gray-800/60 border border-gray-700/50 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayback}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600/30 text-purple-400 hover:bg-purple-600/50 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{audioFileName}</div>
            <div className="text-gray-500 text-xs mt-0.5">Ready to clone</div>
          </div>
          <button onClick={removeAudio} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Recording in progress
  if (isRecording) {
    const pct = (elapsed / MAX_SECONDS) * 100;
    return (
      <div className="p-4 bg-gray-800/60 border border-gray-700/50 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-sm font-medium">Recording...</span>
          </div>
          <span className="text-gray-400 text-sm tabular-nums">{elapsed}s / {MAX_SECONDS}s</span>
        </div>
        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        <button
          onClick={stopRecording}
          className="w-full py-2.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <Square className="w-4 h-4 fill-current" />
          Stop Recording
        </button>
      </div>
    );
  }

  // Idle state — record button only
  return (
    <button
      onClick={startRecording}
      className="w-full p-4 bg-gray-800/60 border border-gray-700/50 rounded-xl hover:border-purple-500/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
          <span className="absolute inset-0 rounded-full bg-purple-600/20 group-hover:bg-purple-600/30 transition-colors" />
          <Mic className="relative w-5 h-5 text-purple-400" />
        </div>
        <div className="text-left">
          <div className="text-white text-sm font-medium">Start Recording</div>
          <div className="text-gray-500 text-xs">Up to 30 seconds</div>
        </div>
      </div>
    </button>
  );
}
