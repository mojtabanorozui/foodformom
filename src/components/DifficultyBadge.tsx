import { useLanguage } from "../i18n/LanguageContext";
import type { Difficulty } from "../type";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const STYLES: Record<Difficulty, string> = {
  Easy: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Normal: "bg-amber-100 text-amber-800 ring-amber-200",
  Hard: "bg-rose-100 text-rose-800 ring-rose-200",
};

const DIFFICULTY_KEYS = {
  Easy: "difficultyEasy",
  Normal: "difficultyNormal",
  Hard: "difficultyHard",
} as const;

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { t } = useLanguage();

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ring-1 ${STYLES[difficulty]}`}
    >
      {t(DIFFICULTY_KEYS[difficulty])}
    </span>
  );
}
