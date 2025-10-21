import CustomSelect, { type SelectOption } from '@/components/ui/CustomSelect';

interface VoiceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  selectedGender: string;
  onGenderChange: (gender: string) => void;
  countryOptions: SelectOption[];
  languageOptions: SelectOption[];
  genderOptions: SelectOption[];
  disabled?: boolean;
}

/**
 * 语音筛选器组件
 */
export default function VoiceFilters({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedLanguage,
  onLanguageChange,
  selectedGender,
  onGenderChange,
  countryOptions,
  languageOptions,
  genderOptions,
  disabled = false,
}: VoiceFiltersProps) {
  return (
    <>
      {/* 三个筛选器 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 国家选择 */}
        <CustomSelect
          value={selectedCountry}
          onChange={onCountryChange}
          options={countryOptions}
          placeholder="Select Country"
          disabled={disabled}
        />

        {/* 语言选择 */}
        <CustomSelect
          value={selectedLanguage}
          onChange={onLanguageChange}
          options={languageOptions}
          placeholder="Select Language"
          disabled={disabled}
        />

        {/* 性别选择 */}
        <CustomSelect
          value={selectedGender}
          onChange={onGenderChange}
          options={genderOptions}
          placeholder="Select Gender"
          disabled={disabled}
        />
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search voices by name..."
          disabled={disabled}
          className="w-full px-4 py-2.5 pr-10 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors text-sm"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </>
  );
}
