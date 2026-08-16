import { useLanguage } from "../i18n/LanguageContext";
import type { Locale } from "../i18n/types";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  const options: { value: Locale; label: string }[] = [
    { value: "en", label: t("langEnglish") },
    { value: "fa", label: t("langPersian") },
  ];

  return (
    <div className="inline-flex rounded-full border border-white/60 bg-white/80 p-1 shadow-md backdrop-blur-sm">
      {options.map((option) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              active
                ? "bg-warm text-white shadow-sm"
                : "text-espresso/70 hover:bg-white hover:text-espresso"
            }`}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
