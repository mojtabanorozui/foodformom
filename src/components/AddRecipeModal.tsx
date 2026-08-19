import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { foods } from "../data/food";
import type { Food } from "../type";

interface AddRecipeModalProps {
  /** If provided, the recipe is pre-assigned to this food. */
  food?: Food;
  /** Pre-filled author name when logged in. */
  authorName?: string;
  onClose: () => void;
  onSubmit: (data: {
    foodId: string;
    foodName: string;
    authorName: string;
    title: string;
    ingredients: string[];
    steps: string[];
    note?: string;
  }) => void;
  onRequireAuth?: () => void;
}

export function AddRecipeModal({
  food: preselectedFood,
  authorName: prefilledAuthor,
  onClose,
  onSubmit,
  onRequireAuth,
}: AddRecipeModalProps) {
  const { t, locale, foodName } = useLanguage();

  const [selectedFood, setSelectedFood] = useState<Food | null>(preselectedFood ?? null);
  const [foodSearch, setFoodSearch] = useState("");
  const [author, setAuthor] = useState(prefilledAuthor ?? "");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>(["", ""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filteredFoods = foods.filter((f) => {
    const q = foodSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      f.name.toLowerCase().includes(q) ||
      foodName(f).toLowerCase().includes(q)
    );
  }).slice(0, 30);

  function addIngredient() { setIngredients((p) => [...p, ""]); }
  function removeIngredient(i: number) {
    setIngredients((p) => p.length === 1 ? [""] : p.filter((_, idx) => idx !== i));
  }
  function updateIngredient(i: number, v: string) {
    setIngredients((p) => p.map((x, idx) => idx === i ? v : x));
  }

  function addStep() { setSteps((p) => [...p, ""]); }
  function removeStep(i: number) {
    setSteps((p) => p.length === 1 ? [""] : p.filter((_, idx) => idx !== i));
  }
  function updateStep(i: number, v: string) {
    setSteps((p) => p.map((x, idx) => idx === i ? v : x));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!selectedFood) errs.food = "Required";
    if (!prefilledAuthor && !author.trim()) errs.author = "Required";
    if (!title.trim()) errs.title = "Required";
    if (ingredients.every((s) => !s.trim())) errs.ingredients = "Required";
    if (steps.every((s) => !s.trim())) errs.steps = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prefilledAuthor && onRequireAuth) {
      onRequireAuth();
      return;
    }
    if (!validate() || !selectedFood) return;
    onSubmit({
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      authorName: (prefilledAuthor ?? author).trim(),
      title: title.trim(),
      ingredients: ingredients.filter((s) => s.trim()),
      steps: steps.filter((s) => s.trim()),
      note: note.trim() || undefined,
    });
    onClose();
  }

  const isRtl = locale === "fa";

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[300] overflow-y-auto bg-[#3d405b]/70 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto my-4 w-full max-w-xl overflow-hidden rounded-3xl bg-cream shadow-2xl ring-1 ring-white/60"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between bg-gradient-to-r from-warm to-sage px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {preselectedFood
                ? `${t("communityAddFor")} ${foodName(preselectedFood)}`
                : t("communityAddRecipe")}
            </h2>
            <p className="mt-0.5 text-sm text-white/80">{t("communitySubtitle")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Food selector (only shown when no preselected food) */}
          {!preselectedFood && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-espresso">
                {t("communitySelectFood")}
                {errors.food && <span className="ms-2 text-red-500 text-xs">{errors.food}</span>}
              </label>
              <input
                type="text"
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                placeholder={t("communitySearchFood")}
                className="mb-2 w-full rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm text-espresso outline-none focus:border-warm focus:ring-2 focus:ring-warm/20"
              />
              {selectedFood && (
                <div className="mb-2 flex items-center gap-2 rounded-xl bg-warm/10 px-3 py-2 text-sm font-semibold text-espresso ring-1 ring-warm/30">
                  <span>{selectedFood.emoji ?? "🍽️"}</span>
                  <span>{foodName(selectedFood)}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFood(null)}
                    className="ms-auto text-espresso/40 hover:text-red-500"
                  >✕</button>
                </div>
              )}
              {!selectedFood && (
                <div className="max-h-40 overflow-y-auto rounded-xl border border-[#e5ddd4] bg-white">
                  {filteredFoods.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => { setSelectedFood(f); setFoodSearch(""); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-espresso transition-colors hover:bg-warm/10 text-start"
                    >
                      <span>{f.emoji ?? "🍽️"}</span>
                      <span>{foodName(f)}</span>
                      <span className="ms-auto text-espresso/40 text-xs">{f.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Author */}
          {!prefilledAuthor && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-espresso">
                {t("communityAuthor")}
                {errors.author && <span className="ms-2 text-red-500 text-xs">{errors.author}</span>}
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t("communityAuthorPlaceholder")}
                className="w-full rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm text-espresso outline-none focus:border-warm focus:ring-2 focus:ring-warm/20"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-espresso">
              {t("communityRecipeTitle")}
              {errors.title && <span className="ms-2 text-red-500 text-xs">{errors.title}</span>}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("communityTitlePlaceholder")}
              className="w-full rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm text-espresso outline-none focus:border-warm focus:ring-2 focus:ring-warm/20"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-espresso">
              {t("communityIngredients")}
              {errors.ingredients && <span className="ms-2 text-red-500 text-xs">{errors.ingredients}</span>}
            </label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => updateIngredient(i, e.target.value)}
                    placeholder={t("communityIngredientPlaceholder")}
                    className="flex-1 rounded-xl border border-[#e5ddd4] bg-white px-4 py-2 text-sm text-espresso outline-none focus:border-warm focus:ring-2 focus:ring-warm/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
                  >
                    {t("communityRemoveStep")}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="text-sm font-semibold text-warm hover:text-warm/80 transition-colors"
              >
                {t("communityAddIngredient")}
              </button>
            </div>
          </div>

          {/* Steps */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-espresso">
              {t("communitySteps")}
              {errors.steps && <span className="ms-2 text-red-500 text-xs">{errors.steps}</span>}
            </label>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm text-xs font-bold text-white self-start mt-2">
                    {i + 1}
                  </div>
                  <textarea
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                    placeholder={t("communityStepPlaceholder")}
                    rows={2}
                    className="flex-1 resize-none rounded-xl border border-[#e5ddd4] bg-white px-4 py-2 text-sm text-espresso outline-none focus:border-warm focus:ring-2 focus:ring-warm/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="self-start mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
                  >
                    {t("communityRemoveStep")}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="text-sm font-semibold text-warm hover:text-warm/80 transition-colors"
              >
                {t("communityAddStep")}
              </button>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-espresso">
              {t("communityNote")}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("communityNotePlaceholder")}
              rows={2}
              className="w-full resize-none rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm text-espresso outline-none focus:border-warm focus:ring-2 focus:ring-warm/20"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-[#e5ddd4] bg-white px-4 py-3 text-sm font-semibold text-espresso transition-all hover:border-espresso/30 hover:bg-espresso/5"
            >
              {t("communityCancel")}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-gradient-to-r from-warm to-sage px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
            >
              {t("communitySubmit")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
