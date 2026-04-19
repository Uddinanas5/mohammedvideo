import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Scene, timeToFrame } from "./subtitleData";

function flickerPattern(frame: number, seed: number): number {
  return Math.sin(seed * 9301 + frame * 49297) * 0.5 + 0.5;
}

export const SlideUpWord: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneStartFrame = timeToFrame(scene.startTime);
  const sceneDuration = timeToFrame(scene.endTime) - sceneStartFrame;
  const hasLineBreak = scene.lineBreakAfter !== undefined;

  // Flicker out over last 18 frames — slow, deliberate
  let containerOpacity = 1;
  if (scene.flickerOut) {
    const flickerFrames = 18;
    const flickerStart = sceneDuration - flickerFrames;
    if (frame >= flickerStart) {
      const flickFrame = frame - flickerStart;
      const flick = flickerPattern(flickFrame, 77);
      // Gradually reduce chance of being visible
      const threshold = 0.3 + (flickFrame / flickerFrames) * 0.5;
      containerOpacity = flickFrame < flickerFrames - 2 ? (flick > threshold ? 1 : 0) : 0;
    }
  }

  const renderWord = (w: { word: string; start: number }, i: number) => {
    const wordFrame = timeToFrame(w.start) - sceneStartFrame;
    const localFrame = frame - wordFrame;
    const isActive = frame >= wordFrame;

    // Slower spring for gentle slide up
    const slideProgress = isActive
      ? spring({
          frame: localFrame,
          fps,
          config: { damping: 14, stiffness: 260, mass: 0.4 },
        })
      : 0;

    const translateY = interpolate(slideProgress, [0, 1], [50, 0]);
    const opacity = interpolate(slideProgress, [0, 1], [0, 1]);

    return (
      <span
        key={i}
        style={{
          display: "inline-block",
          fontSize: 68,
          fontWeight: 800,
          background: "linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textTransform: "none",
          letterSpacing: "-0.02em",
          opacity,
          transform: `translateY(${translateY}px)`,
          filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.6))",
        }}
      >
        {w.word}
      </span>
    );
  };

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: 40,
    right: 40,
    top: "78%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: hasLineBreak ? "column" : "row",
    justifyContent: "center",
    alignItems: "center",
    gap: hasLineBreak ? 8 : 14,
    opacity: containerOpacity,
  };

  if (hasLineBreak) {
    const breakIdx = scene.lineBreakAfter! + 1;
    const line1 = scene.words.slice(0, breakIdx);
    const line2 = scene.words.slice(breakIdx);
    return (
      <div style={containerStyle}>
        <div style={{ display: "flex", gap: 14 }}>{line1.map(renderWord)}</div>
        <div style={{ display: "flex", gap: 14 }}>{line2.map((ww, i) => renderWord(ww, i + breakIdx))}</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {scene.words.map(renderWord)}
    </div>
  );
};
