import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Food } from "../type";
import { foodLabelsFa } from "./foodLabels.fa";
import { ingredientLabelsFa } from "./ingredientLabels.fa";
import { translations } from "./translations";
import type { Locale, TranslationKey } from "./types";

const STORAGE_KEY = "foodformom-locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  foodName: (food: Food) => string;
  ingredientLabel: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "fa") return stored;
  return "fa";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale());

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const dir = locale === "fa" ? "rtl" : "ltr";
  const isRtl = dir === "rtl";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => translations[locale][key],
      dir,
      isRtl,
      foodName: (food) =>
        locale === "fa" ? (foodLabelsFa[food.id] ?? food.name) : food.name,
      ingredientLabel: (key) =>
        locale === "fa" ? (ingredientLabelsFa[key] ?? key) : key,
    }),
    [locale, dir, isRtl],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
