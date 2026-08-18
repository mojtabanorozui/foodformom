import { writeFileSync } from "node:fs";
import { foods } from "../src/data/food.ts";

function assignCategory(name) {
  const n = name.toLowerCase();

  if (
    n.includes("shirini") ||
    n.includes("halva") ||
    n.includes("bastani") ||
    n.includes("faloodeh") ||
    n.includes("zoolbia") ||
    n.includes("bamieh") ||
    n.includes("ferni") ||
    n.includes("sholeh zard") ||
    n.includes("ranginak") ||
    n.includes("gaz") ||
    n.includes("sohan") ||
    n.includes("koloocheh") ||
    n.includes("masghati") ||
    n.includes("ghottab") ||
    n.includes("pashmak") ||
    n.includes("cake") ||
    n.includes("baklava") ||
    n.includes("nokhodchi") ||
    n.includes("kaak")
  ) {
    return "dessert";
  }

  if (
    n.includes("nimroo") ||
    n.includes("omlet") ||
    n.includes("kaleh joosh") ||
    n.includes("kachi") ||
    n.includes("shir berenj") ||
    n.includes("nan-o-panir") ||
    n.includes("nan-o panir") ||
    n.includes("adasi") ||
    n.includes("halim")
  ) {
    return "breakfast";
  }

  if (
    n.includes("ash") ||
    n.includes("soup") ||
    n.startsWith("soup")
  ) {
    return "soup";
  }

  if (
    n.includes("salad") ||
    n.includes("mast") ||
    n.includes("borani") ||
    n.includes("torshi") ||
    n.includes("kashk") ||
    n.includes("hummus") ||
    n.includes("zeytoon") ||
    n.includes("dolmeh") ||
    n.includes("panir-o") ||
    n.includes("mirza ghasemi")
  ) {
    return "appetizer";
  }

  if (
    (n.includes("nan") && !n.includes("panir")) ||
    n.includes("komaj") ||
    n.includes("sirabi")
  ) {
    return "snack";
  }

  if (
    n.includes("kuku") ||
    n.includes("kotlet") ||
    n.includes("shami") ||
    n.includes("sambuseh") ||
    n.includes("piroshki") ||
    n.includes("falafel")
  ) {
    return "lunch";
  }

  return "dinner";
}

const categories = {};
for (const food of foods) {
  categories[food.id] = assignCategory(food.name);
}

writeFileSync(
  "src/data/foodCategories.ts",
  `import type { MealCategory } from "../type";\n\nexport const foodCategories: Record<string, MealCategory> = ${JSON.stringify(categories, null, 2)};\n`,
);

const counts = {};
for (const c of Object.values(categories)) {
  counts[c] = (counts[c] ?? 0) + 1;
}
console.log("Category counts:", counts);
