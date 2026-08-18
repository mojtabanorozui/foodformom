import type { Food, Recipe } from "../type";
import { heroImageForCategory } from "../data/stepImages";
import { getFoodCategory } from "./foodHelpers";
import { buildRecipe } from "./recipeBuilder";
import { generateRecipe } from "./generateRecipe";

const overrideData: Record<string, { stepsEn: string[]; stepsFa: string[] }> =
  {
    "1": {
      stepsEn: [
        "Finely chop parsley, cilantro, and leek (a large bundle of each).",
        "Sauté herbs in oil on low heat for 20–30 minutes until dark and fragrant — do not burn.",
        "Brown diced lamb or beef with fried onions. Add turmeric and pepper.",
        "Add soaked kidney beans and enough water to cover. Simmer 1 hour.",
        "Add fried herbs and pierced dried limes (limoo amani). Simmer 1 more hour until thick.",
        "Serve with chelo (steamed rice) and fresh sabzi.",
      ],
      stepsFa: [
        "جعفری، گشنیز و تره را ریز خرد کنید (هر کدام یک دسته بزرگ).",
        "سبزی را با روغن روی حرارت کم ۲۰–۳۰ دقیقه تفت دهید تا تیره و معطر شود — نسوزانید.",
        "گوشت خردشده را با پیاز داغ سرخ کنید. زردچوبه و فلفل بزنید.",
        "لوبیا قرمز خیس‌خورده و آب کافی اضافه کنید. ۱ ساعت بپزید.",
        "سبزی تفت‌داده و لیمو عمانی سوراخ‌شده را بریزید. ۱ ساعت دیگر بپزید تا غلیظ شود.",
        "با چلو و سبزی خوردن سرو کنید.",
      ],
    },
    "2": {
      stepsEn: [
        "Parboil basmati rice until al dente. Drain.",
        "Mix yogurt, saffron, egg yolk, and a scoop of rice. Spread on the bottom of a non-stick pot.",
        "Layer remaining rice over the yogurt mixture. Dot with butter.",
        "Wrap lid with a towel. Steam on low 45 minutes, then increase heat 5 minutes for golden tahdig.",
        "Invert onto a platter — the crispy golden crust should be on top.",
      ],
      stepsFa: [
        "برنج را نیم‌پز کنید و آبکش کنید.",
        "ماست، زعفران، زرده تخم‌مرغ و کمی برنج را مخلوط کنید. کف قابلمه را بپوشانید.",
        "بقیه برنج را روی آن بریزید. کره اضافه کنید.",
        "درب را با دستمال بپیچید. ۴۵ دقیقه دم بگذارید، ۵ دقیقه حرارت را زیاد کنید برای ته‌دیگ.",
        "برگردانید — پوست طلایی روی پلو باشد.",
      ],
    },
    "4": {
      stepsEn: [
        "Grind walnuts to a fine paste. Sauté grated onion until golden.",
        "Add walnut paste and pomegranate molasses. Stir and cook 10 minutes.",
        "Add chicken pieces and enough water to cover. Simmer 45–60 minutes.",
        "The stew should be thick, dark, and balance sweet-sour. Adjust molasses to taste.",
        "Serve with rice. Traditionally garnished with pomegranate seeds.",
      ],
      stepsFa: [
        "گردو را آسیاب کنید. پیاز رنده‌شده را سرخ کنید.",
        "گردو و رب انار را اضافه کنید. ۱۰ دقیقه هم بزنید.",
        "مرغ را بریزید و با آب بپوشانید. ۴۵–۶۰ دقیقه بپزید.",
        "خورش باید غلیظ و ترش‌وشیرین باشد. رب انار را تنظیم کنید.",
        "با برنج سرو کنید. با دانه انار تزیین کنید.",
      ],
    },
    "50": {
      stepsEn: [
        "Mix ground beef and lamb with grated onion, salt, and pepper. Knead until sticky.",
        "Refrigerate 30 minutes. Form around wide flat skewers, pressing firmly.",
        "Grill over hot charcoal, turning frequently, until charred outside and juicy inside.",
        "Serve with sangak bread, grilled tomato, raw onion, and sumac.",
      ],
      stepsFa: [
        "گوشت چرخ‌کرده گوسفند و گاو را با پیاز رنده‌شده، نمک و فلفل ورز دهید.",
        "۳۰ دقیقه یخچال. دور سیخ پهن محکم بپیچید.",
        "روی زغال داغ بپزید تا بیرون دودی و داخل آبدار باشد.",
        "با نان سنگک، گوجه کبابی، پیاز خام و سماق سرو کنید.",
      ],
    },
    "5": {
      stepsEn: [
        "Soak chickpeas and kidney beans overnight. Simmer until tender.",
        "Sauté onions, garlic, and turmeric. Add to the pot with water.",
        "Add chopped spinach, parsley, dill, and reshteh (noodles). Cook until noodles are soft.",
        "Season well. Serve with kashk, fried onion, and mint on top.",
      ],
      stepsFa: [
        "نخود و لوبیا را از شب قبل خیس کنید. بپزید تا نرم شود.",
        "پیاز، سیر و زردچوبه را تفت دهید. با آب به قابلمه اضافه کنید.",
        "اسفناج، جعفری، شوید و رشته را بریزید. تا نرم شدن رشته بپزید.",
        "نمک بزنید. با کشک، پیاز داغ و نعنا سرو کنید.",
      ],
    },
  };

export function getRecipe(food: Food): Recipe {
  const override = overrideData[food.id];
  if (override) {
    return buildRecipe(food, override.stepsEn, override.stepsFa);
  }
  return generateRecipe(food);
}

export function getHeroImage(food: Food): string {
  const cat = getFoodCategory(food);
  return heroImageForCategory(cat);
}
