import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { Difficulty, MealCategory } from "../type";

interface AddPeopleRecipeModalProps {
  authorName: string;
  onClose: () => void;
  onSubmit: (data: {
    authorName: string;
    name: string;
    emoji?: string;
    difficulty: Difficulty;
    category?: MealCategory;
    ingredients: string[];
    steps: string[];
    note?: string;
  }) => void;
}

const CATEGORIES: MealCategory[] = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "appetizer",
  "soup",
  "snack",
];

const EMOJI_OPTIONS = ["🍽️", "🥘", "🍲", "🥗", "🍰", "🥙", "🧆", "🍢", "🥟", "🫕"];

export function AddPeopleRecipeModal({
  authorName,
  onClose,
  onSubmit,
}: AddPeopleRecipeModalProps) {
  const { t, locale } = useLanguage();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍽️");
  const [difficulty, setDifficulty] = useState<Difficulty>("Normal");
  const [category, setCategory] = useState<MealCategory>("dinner");
  const [note, setNote] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>(["", ""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function addIngredient() {
    setIngredients((p) => [...p, ""]);
  }
  function removeIngredient(i: number) {
    setIngredients((p) => (p.length === 1 ? [""] : p.filter((_, idx) => idx !== i)));
  }
  function updateIngredient(i: number, v: string) {
    setIngredients((p) => p.map((x, idx) => (idx === i ? v : x)));
  }

  function addStep() {
    setSteps((p) => [...p, ""]);
  }
  function removeStep(i: number) {
    setSteps((p) => (p.length === 1 ? [""] : p.filter((_, idx) => idx !== i)));
  }
  function updateStep(i: number, v: string) {
    setSteps((p) => p.map((x, idx) => (idx === i ? v : x)));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Required";
    if (ingredients.every((s) => !s.trim())) errs.ingredients = "Required";
    if (steps.every((s) => !s.trim())) errs.steps = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      authorName,
      name: name.trim(),
      emoji,
      difficulty,
      category,
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
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto my-4 w-full max-w-xl overflow-hidden rounded-3xl bg-cream shadow-2xl ring-1 ring-white/60"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="relative flex items-center justify-between bg-gradient-to-r from-sage to-warm px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {t("peopleRecipeAddOwn")}
            </h2>
            <p className="mt-0.5 text-sm text-white/80">{t("peopleRecipeAddOwnSubtitle")}</p>
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
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-espresso">
              {t("peopleRecipeFoodName")}
              {errors.name && <span className="ms-2 text-xs text-red-500">{errors.name}</span>}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("peopleRecipeFoodNamePlaceholder")}
              className="w-full rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm text-espresso outline-none focus:border-warm focus:ring-2 focus:ring-warm/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-espresso">
              {t("peopleRecipeEmoji")}
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`rounded-xl px-3 py-2 text-2xl transition-all ${
                    emoji === e
                      ? "bg-warm/20 ring-2 ring-warm"
                      : "bg-white ring-1 ring-[#e5ddd4] hover:bg-warm/10"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-espresso">
                {t("peopleRecipeCategory")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MealCategory)}
                className="w-full rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm text-espresso outline-none focus:border-warm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`cat_${cat}` as "cat_breakfast")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-espresso">
                {t("peopleRecipeDifficulty")}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full rounded-xl border border-[#e5ddd4] bg-white px-4 py-2.5 text-sm text-espresso outline-none focus:border-warm"
              >
                <option value="Easy">{t("difficultyEasy")}</option>
                <option value="Normal">{t("difficultyNormal")}</option>
                <option value="Hard">{t("difficultyHard")}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-espresso">
              {t("communityIngredients")}
              {errors.ingredients && (
                <span className="ms-2 text-xs text-red-500">{errors.ingredients}</span>
              )}
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
                    className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-100"
                  >
                    {t("communityRemoveStep")}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="text-sm font-semibold text-warm hover:text-warm/80"
              >
                {t("communityAddIngredient")}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-espresso">
              {t("communitySteps")}
              {errors.steps && (
                <span className="ms-2 text-xs text-red-500">{errors.steps}</span>
              )}
            </label>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-2">
                  <div className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-bold text-white">
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
                    className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-100"
                  >
                    {t("communityRemoveStep")}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="text-sm font-semibold text-warm hover:text-warm/80"
              >
                {t("communityAddStep")}
              </button>
            </div>
          </div>

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

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-[#e5ddd4] bg-white px-4 py-3 text-sm font-semibold text-espresso"
            >
              {t("communityCancel")}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-gradient-to-r from-sage to-warm px-4 py-3 text-sm font-bold text-white shadow-md"
            >
              {t("peopleRecipeSubmit")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
