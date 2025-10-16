interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxCharacters: number;
  availableCharacters: number;
  disabled?: boolean;
}

/**
 * 文本输入组件
 *
 * 显示文本输入框和字符计数
 */
export default function TextInput({
  value,
  onChange,
  maxCharacters,
  availableCharacters,
  disabled = false,
}: TextInputProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
        Enter your text
      </h2>

      {/* 文本输入框 */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder=""
          className="w-full h-48 md:h-64 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-base disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
        />

        {/* 字符计数 */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className={`text-sm font-medium ${
            availableCharacters < 20 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {value.length}/{maxCharacters}
          </span>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="flex items-center justify-between text-sm">
        <button
          onClick={() => onChange('')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1 disabled:opacity-50"
          disabled={!value || disabled}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          No content? Try this:
        </button>

        <p className="text-gray-600">
          Limit {maxCharacters} characters per generation.{' '}
          <span className="font-medium">
            Available: {availableCharacters} characters.
          </span>
        </p>
      </div>
    </div>
  );
}