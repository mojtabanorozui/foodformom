import { useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="group relative w-full">
      {/* Search / clear icon button */}
      <button
        type="button"
        aria-label={value ? "Clear search" : "Search"}
        onClick={() => {
          if (value) {
            onChange("");
          }
          inputRef.current?.focus();
        }}
        className="absolute start-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-warm/10 text-warm transition-all hover:bg-warm/20 hover:scale-110 active:scale-95"
      >
        {value ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-2xl border-2 border-[#e5ddd4] bg-white/90 py-3.5 ps-13 pe-4 text-espresso shadow-sm outline-none transition-all duration-200 placeholder:text-espresso/35 focus:border-warm/60 focus:bg-white focus:shadow-md focus:ring-3 focus:ring-warm/15"
      />
    </div>
  );
}
