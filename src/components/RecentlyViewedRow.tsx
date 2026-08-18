import { useLanguage } from "../i18n/LanguageContext";
import type { Food } from "../type";
import { FoodBrowseCard } from "./FoodBrowseCard";

interface RecentlyViewedRowProps {
  foods: Food[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (food: Food) => void;
}

export function RecentlyViewedRow({
  foods,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: RecentlyViewedRowProps) {
  const { t } = useLanguage();

  if (foods.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="mb-3 font-display text-xl font-bold text-espresso">
        {t("recentlyViewed")}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {foods.map((food) => (
          <div key={food.id} className="w-56 shrink-0">
            <FoodBrowseCard
              food={food}
              isFavorite={isFavorite(food.id)}
              onToggleFavorite={onToggleFavorite}
              onOpen={onOpen}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
