import { stepImages } from "../data/stepImages";
import type { StepImageKey } from "../data/stepImages";

interface StepImageProps {
  imageKey: string;
  className?: string;
}

export function StepImage({ imageKey, className = "" }: StepImageProps) {
  const key = (imageKey in stepImages ? imageKey : "prep") as StepImageKey;
  const { emoji, gradient } = stepImages[key];

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
    >
      <span className="select-none text-5xl drop-shadow-sm">{emoji}</span>
    </div>
  );
}
