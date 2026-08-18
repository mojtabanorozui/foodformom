import { useLanguage } from "../i18n/LanguageContext";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-lg">
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-2xl border-2 border-[#e5ddd4] bg-white/90 py-3.5 ps-12 pe-4 text-espresso shadow-sm outline-none transition-all placeholder:text-espresso/40 focus:border-sage focus:ring-2 focus:ring-sage/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-sm text-espresso/50 hover:bg-espresso/5 hover:text-espresso"
        >
          ✕
        </button>
      )}
    </div>
  );
}
