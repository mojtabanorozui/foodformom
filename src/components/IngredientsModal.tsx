import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface IngredientsModalProps {
  allIngredients: string[];
  onClose: () => void;
  onSubmit: (selected: string[]) => void;
}

export function IngredientsModal({
  allIngredients,
  onClose,
  onSubmit,
}: IngredientsModalProps) {
  const { t, ingredientLabel } = useLanguage();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleIngredient(ingredient: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ingredient)) {
        next.delete(ingredient);
      } else {
        next.add(ingredient);
      }
      return next;
    });
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-[#3d405b]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="modal-panel flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-cream shadow-[0_25px_80px_rgba(61,64,91,0.35)] ring-1 ring-white/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-warm via-[#e8956f] to-gold px-6 py-7 text-white">
          <div className="pointer-events-none absolute -top-8 -end-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-6 -start-6 h-24 w-24 rounded-full bg-white/10" />
          <h2 className="relative font-display text-2xl font-bold tracking-tight">
            {t("modalTitle")}
          </h2>
          <p className="relative mt-2 text-sm text-white/90">
            {t("modalSubtitle")}
          </p>
          {selected.size > 0 && (
            <span className="relative mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              {selected.size} {t("selectedCount")}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap gap-2">
            {allIngredients.map((ingredient) => {
              const isChecked = selected.has(ingredient);
              return (
                <label
                  key={ingredient}
                  className={`cursor-pointer rounded-full border-2 px-3.5 py-2 text-sm font-medium transition-all duration-200 select-none ${
                    isChecked
                      ? "border-warm bg-[#fce9e3] text-warm-dark shadow-[0_2px_8px_rgba(224,122,95,0.25)]"
                      : "border-[#e5ddd4] bg-white text-espresso hover:border-sage hover:bg-[#f0f7f4]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleIngredient(ingredient)}
                    className="sr-only"
                  />
                  {isChecked && <span className="me-1">✓</span>}
                  {ingredientLabel(ingredient)}
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 border-t border-[#e5ddd4] bg-white/60 px-6 py-4 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-[#e5ddd4] bg-white px-4 py-3 text-sm font-semibold text-espresso transition-colors hover:border-espresso/30 hover:bg-[#faf8f5]"
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => onSubmit(Array.from(selected))}
            className="flex-1 rounded-xl bg-gradient-to-r from-warm to-warm-dark px-4 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(224,122,95,0.4)] transition-all hover:shadow-[0_6px_20px_rgba(224,122,95,0.5)] active:scale-[0.98]"
          >
            {t("suggestFoods")}
          </button>
        </div>
      </div>
    </div>
  );
}
