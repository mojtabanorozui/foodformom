import type { Food, Recipe } from "../type";

type DishCategory =
  | "khoresh"
  | "polo"
  | "kabab"
  | "ash"
  | "kuku"
  | "dolmeh"
  | "bread"
  | "side"
  | "dessert"
  | "other";

function detectCategory(food: Food): DishCategory {
  const n = food.name.toLowerCase();

  if (
    n.includes("khoresh") ||
    n.includes("ghormeh") ||
    n.includes("fesenjan") ||
    n.includes("gheimeh") ||
    n.includes("ghelyeh") ||
    n.includes("ghalyeh")
  ) {
    return "khoresh";
  }
  if (
    n.includes("polo") ||
    n.includes("tahchin") ||
    n.includes("tahdig") ||
    n.startsWith("dami ")
  ) {
    return "polo";
  }
  if (
    n.includes("kabab") ||
    n.includes("kabob") ||
    n.includes("jujeh") ||
    n.includes("joojeh") ||
    n.includes("shishlik") ||
    n.includes("kotlet") ||
    n.includes("shami")
  ) {
    return "kabab";
  }
  if (n.includes("ash") || n.includes("soup") || n.includes("halim")) {
    return "ash";
  }
  if (n.includes("kuku") || n.includes("nimroo") || n.includes("omlet")) {
    return "kuku";
  }
  if (n.includes("dolmeh")) return "dolmeh";
  if (n.includes("nan") && !n.includes("panir")) return "bread";
  if (
    n.includes("salad") ||
    n.includes("mast") ||
    n.includes("borani") ||
    n.includes("torshi") ||
    n.includes("kashk") ||
    n.includes("hummus") ||
    n.includes("zeytoon")
  ) {
    return "side";
  }
  if (
    n.includes("shirini") ||
    n.includes("cake") ||
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
    n.includes("koloocheh")
  ) {
    return "dessert";
  }
  return "other";
}

function ingredientList(food: Food, locale: "en" | "fa"): string {
  if (locale === "en") return food.ingredients.join(", ");
  return food.ingredients.join("، ");
}

const templates: Record<
  DishCategory,
  (food: Food) => Recipe
> = {
  khoresh: (food) => ({
    stepsEn: [
      `Gather ingredients: ${ingredientList(food, "en")}.`,
      "Dice onions and sauté in oil until golden brown.",
      "Add meat and brown on all sides. Stir in turmeric and pepper.",
      "Add chopped herbs or vegetables and tomato paste if using. Cover with water and simmer until tender (1–2 hours).",
      "Add dried lime, beans, or fruit in the last 30 minutes. Adjust salt and simmer until the stew is thick and fragrant.",
      "Serve hot with steamed saffron rice and fresh herbs.",
    ],
    stepsFa: [
      `مواد لازم را آماده کنید: ${ingredientList(food, "fa")}.`,
      "پیاز را خرد کرده و در روغن تا طلایی شدن تفت دهید.",
      "گوشت را اضافه کنید و سرخ کنید. زردچوبه و فلفل بزنید.",
      "سبزی یا سبزیجات خردشده و در صورت نیاز رب گوجه را اضافه کنید. با آب بپوشانید و ۱ تا ۲ ساعت بپزید.",
      "در ۳۰ دقیقه آخر لیمو عمانی، لوبیا یا میوه را اضافه کنید. نمک بزنید تا خورش غلیظ و خوش‌عطر شود.",
      "با برنج زعفرانی داغ و سبزی تازه سرو کنید.",
    ],
  }),

  polo: (food) => ({
    stepsEn: [
      `Prepare: ${ingredientList(food, "en")}.`,
      "Wash rice until water runs clear. Soak with salt for 30 minutes, then parboil until al dente. Drain.",
      "Sauté aromatics, meat, or toppings in a pot with oil and butter.",
      "Layer parboiled rice over the topping. Dot with butter and saffron water.",
      "Steam on low heat for 45–60 minutes until fluffy. For tahdig, increase heat briefly at the end for a golden crust.",
      "Serve inverted onto a platter so the crispy tahdig is on top.",
    ],
    stepsFa: [
      `آماده‌سازی: ${ingredientList(food, "fa")}.`,
      "برنج را بشویید و ۳۰ دقیقه خیس کنید. نیم‌پز کرده و آبکش کنید.",
      "مواد تزیین یا گوشت را در قابلمه با روغن و کره تفت دهید.",
      "برنج را روی مواد بریزید. کره و آب زعفران اضافه کنید.",
      "۴۵ تا ۶۰ دقیقه روی حرارت کم دم بگذارید. برای ته‌دیگ، در پایان حرارت را کمی زیاد کنید.",
      "پلو را برگردانید و با ته‌دیگ طلایی سرو کنید.",
    ],
  }),

  kabab: (food) => ({
    stepsEn: [
      `Ingredients: ${ingredientList(food, "en")}.`,
      "Mix meat or chicken with grated onion, yogurt, saffron, lemon juice, salt, and pepper. Marinate at least 2 hours (overnight is best).",
      "Form koobideh around flat skewers, or thread chicken pieces onto skewers.",
      "Grill over hot charcoal, turning often, until cooked through and slightly charred.",
      "Rest briefly, then serve with grilled tomatoes, sumac onions, and saffron rice or flatbread.",
    ],
    stepsFa: [
      `مواد: ${ingredientList(food, "fa")}.`,
      "گوشت یا مرغ را با پیاز رنده‌شده، ماست، زعفران، آب‌لیمو، نمک و فلفل مخلوط و حداقل ۲ ساعت (ترجیحاً یک شب) مزه‌دار کنید.",
      "کوبیده را دور سیخ بپیچید یا تکه‌های مرغ را سیخ کنید.",
      "روی زغال داغ بپزید و مرتب بچرخانید تا پخته و کمی دودی شود.",
      "با گوجه کبابی، پیاز و سماق، برنج زعفرانی یا نان سرو کنید.",
    ],
  }),

  ash: (food) => ({
    stepsEn: [
      `You'll need: ${ingredientList(food, "en")}.`,
      "Soak legumes overnight. Simmer beans and chickpeas in water until soft.",
      "Add chopped greens, herbs, and noodles. Stir gently and cook until noodles are tender.",
      "Season with salt, turmeric, and pepper. Simmer until thick and hearty.",
      "Serve in bowls topped with kashk, fried onions, and mint. Add extra kashk at the table.",
    ],
    stepsFa: [
      `مواد لازم: ${ingredientList(food, "fa")}.`,
      "حبوبات را از شب قبل خیس کنید. لوبیا و نخود را بپزید تا نرم شود.",
      "سبزیجات، سبزی و رشته را اضافه کنید و هم بزنید تا رشته نرم شود.",
      "نمک، زردچوبه و فلفل بزنید. بگذارید غلیظ و جا بیفتد.",
      "در کاسه با کشک، پیاز داغ و نعنا سرو کنید.",
    ],
  }),

  kuku: (food) => ({
    stepsEn: [
      `Ingredients: ${ingredientList(food, "en")}.`,
      "Wash and finely chop herbs or vegetables. Beat eggs with salt and pepper.",
      "Fold herbs into eggs. Add walnuts or spices if using.",
      "Heat oil in a wide pan. Pour mixture in and cook on medium-low until set on the bottom.",
      "Flip carefully (or finish under a lid/broiler) until golden on both sides.",
      "Slice and serve warm or at room temperature with bread and yogurt.",
    ],
    stepsFa: [
      `مواد: ${ingredientList(food, "fa")}.`,
      "سبزی یا سبزیجات را بشویید و ریز خرد کنید. تخم‌مرغ را با نمک و فلفل بزنید.",
      "سبزی را به تخم‌مرغ اضافه کنید. گردو یا ادویه را در صورت نیاز بریزید.",
      "روغن را در تابه گرم کنید. مخلوط را بریزید و روی حرارت متوسط تا ته آن ببندد.",
      "برگردانید (یا با درب بپزید) تا دو طرف طلایی شود.",
      "برش بزنید و با نان و ماست سرو کنید.",
    ],
  }),

  dolmeh: (food) => ({
    stepsEn: [
      `Prepare: ${ingredientList(food, "en")}.`,
      "Mix rice, herbs, split peas, and spices with sautéed onion.",
      "Blanch grape leaves or hollow peppers. Fill each with the mixture and roll tightly.",
      "Arrange in a pot, add water and lemon juice, and place a plate on top to weigh down.",
      "Simmer 45–60 minutes until tender. Serve warm with yogurt.",
    ],
    stepsFa: [
      `آماده‌سازی: ${ingredientList(food, "fa")}.`,
      "برنج، سبزی، لپه و ادویه را با پیاز تفت‌داده مخلوط کنید.",
      "برگ مو یا فلفل را آماده کنید. با مخلوط پر کرده و محکم بپیچید.",
      "در قابلمه بچینید، آب و آب‌لیمو اضافه کنید و با بشقاب سنگین کنید.",
      "۴۵ تا ۶۰ دقیقه بپزید. با ماست سرو کنید.",
    ],
  }),

  bread: (food) => ({
    stepsEn: [
      `Ingredients: ${ingredientList(food, "en")}.`,
      "Mix flour, water, yeast, and salt. Knead until smooth and elastic.",
      "Let dough rise until doubled in size.",
      "Shape into flat rounds or loaves. Score the top if desired.",
      "Bake on a hot stone or tray until golden and hollow-sounding when tapped.",
      "Brush with water or oil while hot. Serve warm.",
    ],
    stepsFa: [
      `مواد: ${ingredientList(food, "fa")}.`,
      "آرد، آب، مخمر و نمک را مخلوط و ورز دهید تا خمیر یکدست شود.",
      "بگذارید خمیر دو برابر حجمش برسد.",
      "به شکل نان پهن یا بربری درآورید.",
      "در فر داغ بپزید تا طلایی و توخالی شود.",
      "با آب یا روغن براق کنید و گرم سرو کنید.",
    ],
  }),

  side: (food) => ({
    stepsEn: [
      `You'll need: ${ingredientList(food, "en")}.`,
      "Prep vegetables: dice, grate, or chop as needed.",
      "Combine ingredients in a bowl. Season with salt, pepper, and dried mint or vinegar.",
      "Chill for at least 30 minutes so flavors meld.",
      "Serve as a side dish or appetizer alongside main courses.",
    ],
    stepsFa: [
      `مواد لازم: ${ingredientList(food, "fa")}.`,
      "سبزیجات را خرد، رنده یا آماده کنید.",
      "همه مواد را مخلوط کنید. نمک، فلفل، نعنا یا سرکه بزنید.",
      "حداقل ۳۰ دقیقه در یخچال بگذارید تا مزه‌ها جا بیفتد.",
      "به عنوان پیش‌غذا یا کنار غذا سرو کنید.",
    ],
  }),

  dessert: (food) => ({
    stepsEn: [
      `Ingredients: ${ingredientList(food, "en")}.`,
      "Prepare syrup or base: dissolve sugar in water with rosewater or saffron if using.",
      "Cook main components (rice flour, nuts, or dough) until thickened or golden.",
      "Shape or pour into a pan. Cool slightly before cutting or plating.",
      "Garnish with pistachio, cinnamon, or coconut. Serve at room temperature or chilled.",
    ],
    stepsFa: [
      `مواد: ${ingredientList(food, "fa")}.`,
      "شربت یا پایه را آماده کنید: شکر را در آب با گلاب یا زعفران حل کنید.",
      "مواد اصلی (آرد برنج، مغزها یا خمیر) را بپزید تا غلیظ یا طلایی شود.",
      "در قالب بریزید یا شکل دهید. کمی خنک کنید و برش بزنید.",
      "با پسته، دارچین یا نارگیل تزیین کنید. سرو کنید.",
    ],
  }),

  other: (food) => ({
    stepsEn: [
      `Gather: ${ingredientList(food, "en")}.`,
      "Prep all ingredients — wash, chop, and measure before cooking.",
      "Cook the main protein or base ingredient until tender using gentle heat.",
      "Combine remaining ingredients and simmer until flavors come together.",
      "Taste and adjust seasoning. Serve warm with rice, bread, or fresh herbs.",
    ],
    stepsFa: [
      `مواد: ${ingredientList(food, "fa")}.`,
      "همه مواد را آماده کنید — بشویید، خرد کنید و اندازه بگیرید.",
      "مواد اصلی را با حرارت ملایم بپزید تا نرم شود.",
      "بقیه مواد را اضافه کنید و بگذارید مزه‌ها با هم ترکیب شوند.",
      "مزه کنید و نمک بزنید. با برنج، نان یا سبزی تازه سرو کنید.",
    ],
  }),
};

export function generateRecipe(food: Food): Recipe {
  const category = detectCategory(food);
  return templates[category](food);
}
