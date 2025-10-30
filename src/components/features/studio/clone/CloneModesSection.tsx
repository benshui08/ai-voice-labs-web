'use client';

/**
 * Clone Modes Section Component
 *
 * Displays two cloning modes:
 * 1. Clone Mode - Upload video or audio files
 * 2. Custom Parameter Cloning - Create unique characters
 */
export default function CloneModesSection() {
  const handleStartCloneMode = () => {
    console.log('Start Clone Mode');
    // TODO: Navigate to clone mode page or open modal
  };

  const handleStartCustomCloning = () => {
    console.log('Start Custom Parameter Cloning');
    // TODO: Navigate to custom cloning page or open modal
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 mb-6">
      {/* Header with badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-600"
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
          <h2 className="text-xl font-semibold text-gray-900">Clone Mode</h2>
        </div>
        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          5 clone remaining
        </span>
      </div>

      {/* Clone Mode Card */}
      <div className="mb-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">Upload video or audio files</h3>
              <p className="text-sm text-gray-600">
                Clone your voice by uploading a local audio sample
              </p>
            </div>
          </div>
          <button
            onClick={handleStartCloneMode}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex-shrink-0 ml-4"
          >
            Start
          </button>
        </div>
      </div>

      {/* Custom Parameter Cloning Card */}
      <div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">Custom Parameter Cloning</h3>
              <p className="text-sm text-gray-600">
                Create unique characters using simple prompts and let your imagination run wild!
              </p>
            </div>
          </div>
          <button
            onClick={handleStartCustomCloning}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex-shrink-0 ml-4"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}