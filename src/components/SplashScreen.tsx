import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  function handleEnter() {
    setLeaving(true);
    setTimeout(onEnter, 600);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-600 ${
        leaving ? "opacity-0" : visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ transition: "opacity 0.6s ease" }}
    >
      {/* Full-bleed wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('/wp1955168-cooking-wallpapers.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center gap-6 px-8 text-center transition-all duration-700 ${
          visible && !leaving
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
        style={{ transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s" }}
      >
        {/* Logo / icon */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-6xl shadow-2xl backdrop-blur-sm ring-2 ring-white/30">
          🍽️
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-5xl font-bold tracking-tight text-white drop-shadow-lg sm:text-6xl">
            {t("appTitle")}
          </h1>
          <p className="text-lg font-medium text-white/80 drop-shadow">
            {t("appSubtitle")}
          </p>
        </div>

        <button
          onClick={handleEnter}
          className="mt-4 rounded-2xl bg-warm px-10 py-4 text-lg font-bold text-white shadow-xl ring-2 ring-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-warm-dark hover:shadow-warm/40 active:scale-95"
        >
          {t("splashEnter")}
        </button>
      </div>

      {/* Bottom subtle brand */}
      <p className="absolute bottom-8 z-10 text-sm text-white/40 drop-shadow">
        {t("builtBy")}{" "}
        <span className="font-semibold text-white/60">@Clevi666</span>
      </p>
    </div>
  );
}
