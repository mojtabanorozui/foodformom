import { useState } from "react";
import type { Food } from "../type";

interface WheelProps {
  foods: Food[];
  onResult: (food: Food) => void;
}

const COLORS = [
  "#E07A5F",
  "#3D405B",
  "#81B29A",
  "#F2CC8F",
  "#5C7A99",
  "#B56576",
];

export function Wheel({ foods, onResult }: WheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const sliceAngle = 360 / foods.length;

  // Build the conic-gradient string, e.g. "red 0deg 60deg, blue 60deg 120deg, ..."
  const gradient = foods
    .map((_, i) => {
      const color = COLORS[i % COLORS.length];
      const start = i * sliceAngle;
      const end = start + sliceAngle;
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");

  function handleSpin() {
    if (spinning) return; // ignore clicks while already spinning

    setSpinning(true);

    const randomIndex = Math.floor(Math.random() * foods.length);

    // We want the chosen slice to end up under the pointer (top, i.e. 0deg).
    // Each slice spans sliceAngle degrees; aim for its middle.
    const targetSliceCenter = randomIndex * sliceAngle + sliceAngle / 2;

    // Spin at least 5 full rotations, then land so targetSliceCenter is at the top.
    // The wheel spins clockwise, so we rotate to (360*5) - targetSliceCenter,
    // adjusted by current rotation so it always spins forward, never backward.
    const extraSpins = 5 * 360;
    const newRotation =
      rotation +
      extraSpins +
      (360 - (targetSliceCenter % 360)) +
      (rotation % 360 === 0 ? 0 : 0);

    setRotation(newRotation);

    // Wait for the CSS transition to finish (matches the duration below: 4s)
    window.setTimeout(() => {
      setSpinning(false);
      onResult(foods[randomIndex]);
    }, 4000);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
      }}
    >
      <div style={{ position: "relative", width: "300px", height: "300px" }}>
        {/* Pointer arrow */}
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "20px solid #333",
            zIndex: 2,
          }}
        />

        {/* The wheel itself */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `conic-gradient(${gradient})`,
            transform: `rotate(${rotation}deg)`,
            transition: "transform 4s cubic-bezier(0.17, 0.67, 0.32, 1.02)",
            position: "relative",
          }}
        >
          {foods.map((food, i) => {
            const angle = i * sliceAngle + sliceAngle / 2; // middle of this slice, in degrees
            const radians = (angle * Math.PI) / 180; // CSS/trig work in radians, not degrees
            const radius = 100; // how far from center to place the label
            const x = radius * Math.sin(radians);
            const y = -radius * Math.cos(radians);

            return (
              <div
                key={food.id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "white",
                  textAlign: "center",
                  width: "70px",
                }}
              >
                {food.emoji} {food.name}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1.1rem",
          fontWeight: 700,
          borderRadius: "999px",
          border: "none",
          background: spinning ? "#aaa" : "#E07A5F",
          color: "white",
          cursor: spinning ? "not-allowed" : "pointer",
        }}
      >
        {spinning ? "Spinning..." : "Roll 🎲"}
      </button>
    </div>
  );
}
