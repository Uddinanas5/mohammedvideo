import React from "react";
import { useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";
import { Scene, timeToFrame } from "./subtitleData";

export const PunchScale: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneStartFrame = timeToFrame(scene.startTime);
  const hasLineBreak = scene.lineBreakAfter !== undefined;

  const renderWord = (w: { word: string; start: number }, i: number) => {
    const wordFrame = timeToFrame(w.start) - sceneStartFrame;
    const localFrame = frame - wordFrame;
    const isActive = frame >= wordFrame;

    const scaleProgress = isActive
      ? spring({
          frame: localFrame,
          fps,
          config: { damping: 10, stiffness: 300, mass: 0.3, overshootClamping: false },
        })
      : 0;

    const scale = interpolate(scaleProgress, [0, 1], [1.8, 1]);
    const opacity = isActive
      ? interpolate(localFrame, [0, 2], [0, 1], { extrapolateRight: "clamp" })
      : 0;

    return (
      <span
        key={i}
        style={{
          display: "inline-block",
          fontSize: 72,
          fontWeight: 800,
          background: "linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textTransform: "none",
          letterSpacing: "-0.03em",
          opacity,
          transform: `scale(${scale})`,
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
