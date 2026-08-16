import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { Food } from "../type";

interface SlotReelProps {
  foods: Food[];
  onResult: (food: Food) => void;
}

const CARD_WIDTH = 140;
const REPEAT_COUNT = 8;
const VIEWPORT_WIDTH = 500;

export function SlotReel({ foods, onResult }: SlotReelProps) {
  const { t, foodName } = useLanguage();
  const [translateX, setTranslateX] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const strip: Food[] = [];
  for (let i = 0; i < REPEAT_COUNT; i++) {
    strip.push(...foods);
  }

  function handleSpin() {
    if (spinning) return;
    setSpinning(true);

    const targetIndex = Math.floor(Math.random() * foods.length);
    const landingOccurrence = REPEAT_COUNT - 2;
    const landingPosition = landingOccurrence * foods.length + targetIndex;
    const newTranslateX =
      -(landingPosition * CARD_WIDTH) +
      VIEWPORT_WIDTH / 2 -
      CARD_WIDTH / 2;

    setTranslateX(newTranslateX);

    window.setTimeout(() => {
      setSpinning(false);
      onResult(foods[targetIndex]);
    }, 4000);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full max-w-[540px] rounded-[28px] bg-gradient-to-b from-[#4a4a52] via-[#2e2e35] to-[#1a1a1f] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]">
        <div className="mb-3 rounded-2xl bg-gradient-to-r from-[#8b0000] via-[#c41e3a] to-[#8b0000] px-4 py-2 text-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
          <p className="font-display text-sm font-bold tracking-[0.2em] text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] sm:text-base">
            {t("slotMarquee")}
          </p>
        </div>

        <div className="mb-2 flex justify-center gap-1.5 px-2">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="slot-led h-2 w-2 rounded-full bg-[#ffd700]"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        <div className="relative rounded-[20px] bg-gradient-to-b from-[#1c1c22] to-[#0f0f12] p-[6px] shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]">
          <div className="pointer-events-none absolute inset-[6px] z-10 rounded-[14px] bg-gradient-to-b from-white/10 via-transparent to-black/20" />

          <div className="absolute -top-1 left-1/2 z-20 -translate-x-1/2">
            <div className="h-0 w-0 border-x-[14px] border-t-[22px] border-x-transparent border-t-[#ffd700] drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
            <div className="mx-auto -mt-[18px] h-0 w-0 border-x-[8px] border-t-[14px] border-x-transparent border-t-[#fff8dc]" />
          </div>

          <div
            className="slot-reel-mask relative h-[168px] overflow-hidden rounded-[14px] border border-[#3a3a42] bg-[#0a0a0c] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]"
            style={{ width: `${VIEWPORT_WIDTH}px`, maxWidth: "calc(90vw - 2rem)" }}
            dir="ltr"
          >
            <div className="absolute inset-y-0 left-1/2 z-[5] w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#ffd700] to-transparent shadow-[0_0_12px_rgba(255,215,0,0.8)]" />

            <div
              className="flex gap-2 p-2 will-change-transform"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: spinning
                  ? "transform 4s cubic-bezier(0.12, 0.75, 0.13, 1.0)"
                  : "none",
              }}
            >
              {strip.map((food, i) => (
                <div
                  key={`${food.id}-${i}`}
                  className="flex h-[152px] w-[132px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-[#d4c4a8]/30 bg-gradient-to-b from-[#fffef9] to-[#f5ebe0] p-2 shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.8)]"
                >
                  <span className="text-4xl drop-shadow-sm">{food.emoji}</span>
                  <span
                    dir="auto"
                    className="w-full px-1 text-center text-[0.7rem] font-bold leading-tight text-espresso [font-family:var(--font-persian,inherit)]"
                  >
                    {foodName(food)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full ${spinning ? "animate-pulse bg-[#ff4444]" : "bg-[#333]"}`}
              />
            ))}
          </div>
          <span className="text-[0.65rem] font-medium tracking-widest text-[#888] uppercase">
            {t("insertLuck")}
          </span>
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className={`group relative overflow-hidden rounded-full px-10 py-4 text-lg font-bold tracking-wide text-white shadow-lg transition-all duration-200 ${
          spinning
            ? "cursor-not-allowed bg-gray-400 shadow-none"
            : "cursor-pointer bg-gradient-to-b from-[#ff6b4a] to-[#c45c42] shadow-[0_6px_0_#8b3a2a,0_10px_25px_rgba(224,122,95,0.5)] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#8b3a2a,0_14px_30px_rgba(224,122,95,0.6)] active:translate-y-1 active:shadow-[0_2px_0_#8b3a2a]"
        }`}
      >
        <span className="relative z-10">
          {spinning ? t("spinning") : t("spin")}
        </span>
        {!spinning && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </button>
    </div>
  );
}
