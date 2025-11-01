'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordingComplete: (audioBlob: Blob) => void;
}

/**
 * Audio Recorder Component - Bottom Sheet
 *
 * Records audio from the user's microphone
 */
export default function AudioRecorder({
  isOpen,
  onClose,
  onRecordingComplete,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset state when modal closes
      stopRecording();
      setAudioURL('');
      setRecordingTime(0);
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleConfirm = () => {
    if (audioURL) {
      fetch(audioURL)
        .then((res) => res.blob())
        .then((blob) => {
          onRecordingComplete(blob);
          onClose();
        });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-xl max-w-md mx-auto">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pt-4 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Record Audio
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {/* Recording visualizer */}
            <div className="flex flex-col items-center gap-6 mb-8">
              {/* Microphone Icon / Recording Indicator */}
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-100 animate-pulse'
                    : 'bg-purple-100'
                }`}
              >
                <svg
                  className={`w-12 h-12 ${
                    isRecording ? 'text-red-600' : 'text-purple-600'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>

              {/* Timer */}
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 font-mono">
                  {formatTime(recordingTime)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {isRecording ? 'Recording...' : audioURL ? 'Recording complete' : 'Ready to record'}
                </p>
              </div>
            </div>

            {/* Audio Player (if recording exists) */}
            {audioURL && !isRecording && (
              <div className="mb-6">
                <audio
                  src={audioURL}
                  controls
                  className="w-full"
                  style={{ height: '40px' }}
                />
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-3">
              {!isRecording && !audioURL && (
                <button
                  onClick={startRecording}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Start Recording
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Stop Recording
                </button>
              )}

              {audioURL && !isRecording && (
                <>
                  <button
                    onClick={() => {
                      setAudioURL('');
                      setRecordingTime(0);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Confirm
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom padding for safe area */}
          <div className="h-6" />
        </div>
      </div>
    </>
  );
}