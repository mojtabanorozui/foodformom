import { getFoodAllergens } from "../data/allergens";
import { useLanguage } from "../i18n/LanguageContext";
import type { Food } from "../type";
import { getFoodCategory } from "../utils/foodHelpers";
import { getHeroImage } from "../utils/getRecipe";
import { AllergenBadges } from "./AllergenBadges";
import { CategoryBadge } from "./CategoryBadge";
import { DifficultyBadge } from "./DifficultyBadge";
import { StepImage } from "./StepImage";

interface FoodBrowseCardProps {
  food: Food;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (food: Food) => void;
}

export function FoodBrowseCard({
  food,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: FoodBrowseCardProps) {
  const { foodName, ingredientLabel } = useLanguage();
  const hero = getHeroImage({ ...food, category: getFoodCategory(food) });
  const allergens = getFoodAllergens(food);

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-[#e5ddd4] transition-all hover:-translate-y-1 hover:shadow-xl">
      <button type="button" onClick={() => onOpen(food)} className="block w-full text-start">
        <div className="relative h-44 overflow-hidden">
          <StepImage
            imageKey={hero}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl drop-shadow-xl">{food.emoji ?? "🍽️"}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <CategoryBadge
            category={getFoodCategory(food)}
            className="absolute top-3 start-3"
          />
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-bold text-espresso">
            {foodName(food)}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={food.difficulty} />
            <AllergenBadges allergens={allergens} compact />
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-espresso/55">
            {food.ingredients.slice(0, 4).map(ingredientLabel).join(" · ")}
            {food.ingredients.length > 4 ? "…" : ""}
          </p>
        </div>
      </button>
      <div className="flex border-t border-[#e5ddd4] px-4 py-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(food.id);
          }}
          className={`ms-auto rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
            isFavorite
              ? "text-rose-500 hover:bg-rose-50"
              : "text-espresso/40 hover:bg-espresso/5 hover:text-rose-400"
          }`}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
    </article>
  );
}
