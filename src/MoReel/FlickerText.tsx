import React from "react";
import { useCurrentFrame } from "remotion";
import { Scene, timeToFrame } from "./subtitleData";

function flickerPattern(frame: number, seed: number): number {
  return Math.sin(seed * 9301 + frame * 49297) * 0.5 + 0.5;
}

export const FlickerText: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const sceneStartFrame = timeToFrame(scene.startTime);
  const hasLineBreak = scene.lineBreakAfter !== undefined;

  const renderWord = (w: { word: string; start: number }, i: number) => {
    const wordFrame = timeToFrame(w.start) - sceneStartFrame;
    const localFrame = frame - wordFrame;
    const isActive = frame >= wordFrame;

    if (!isActive) return <span key={i} style={{ opacity: 0, fontSize: 68, display: "inline-block" }}>{w.word}</span>;

    const flickerDuration = 8;
    let opacity = 1;
    let scaleX = 1;

    if (localFrame < flickerDuration) {
      const flick = flickerPattern(localFrame, i + 1);
      opacity = flick > 0.35 ? 1 : 0;
      scaleX = 1 + (flick - 0.5) * 0.08;
    }

    const glowPulse = Math.sin((frame + i * 10) * 0.15) * 0.3 + 0.7;

    return (
      <span
        key={i}
        style={{
          display: "inline-block",
          fontSize: 68,
          fontWeight: 800,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          opacity,
          transform: `scaleX(${scaleX})`,
          textShadow: `0 0 ${20 * glowPulse}px rgba(255,255,255,0.6), 0 4px 30px rgba(0,0,0,0.7)`,
        }}
      >
        {w.word}
      </span>
    );
  };

  if (hasLineBreak) {
    const breakIdx = scene.lineBreakAfter! + 1;
    const line1 = scene.words.slice(0, breakIdx);
    const line2 = scene.words.slice(breakIdx);
    return (
      <div style={{ position: "absolute", bottom: 160, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 14 }}>{line1.map(renderWord)}</div>
        <div style={{ display: "flex", gap: 14 }}>{line2.map((ww, i) => renderWord(ww, i + breakIdx))}</div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", bottom: 180, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
      {scene.words.map(renderWord)}
    </div>
  );
};
