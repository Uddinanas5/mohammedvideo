import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont as loadScript } from "@remotion/google-fonts/Cormorant";
import { Scene, timeToFrame } from "./subtitleData";

const { fontFamily: scriptFont } = loadScript("italic", { weights: ["500"] });

function flickerPattern(frame: number, seed: number): number {
  return Math.sin(seed * 9301 + frame * 49297) * 0.5 + 0.5;
}

export const Opener: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneStartFrame = timeToFrame(scene.startTime);
  const sceneDuration = timeToFrame(scene.endTime) - sceneStartFrame;

  // Staggered: each line starts after the previous, slow and smooth
  const smoothConfig = { damping: 28, stiffness: 60, mass: 1.2 };
  const stagger = 10; // frames between each line

  // "Leaving your" — slides DOWN from top
  const leavingProgress = spring({ frame, fps, config: smoothConfig });
  const leavingY = interpolate(leavingProgress, [0, 1], [-50, 0]);
  const leavingOpacity = interpolate(leavingProgress, [0, 1], [0, 1]);

  // "country" — slides LEFT TO RIGHT
  const countryFrame2 = Math.max(0, frame - stagger);
  const countryProgress = frame >= stagger
    ? spring({ frame: countryFrame2, fps, config: smoothConfig })
    : 0;
  const countryX = interpolate(countryProgress, [0, 1], [-120, 0]);
  const countryOpacity = interpolate(countryProgress, [0, 1], [0, 1]);

  // "is not exciting" — slides UP
  const isFrame2 = Math.max(0, frame - stagger * 2);
  const isProgress = frame >= stagger * 2
    ? spring({ frame: isFrame2, fps, config: smoothConfig })
    : 0;
  const isY = interpolate(isProgress, [0, 1], [50, 0]);
  const isOpacity = interpolate(isProgress, [0, 1], [0, 1]);

  // Flicker out over last 18 frames
  let containerOpacity = 1;
  if (scene.flickerOut) {
    const flickerFrames = 10;
    const flickerStart = sceneDuration - flickerFrames;
    if (frame >= flickerStart) {
      const flickFrame = frame - flickerStart;
      // Hard on/off pattern: 1,0,1,0,1,0,0,1,0,0
      const pattern = [1, 0, 1, 0, 1, 0, 0, 1, 0, 0];
      containerOpacity = pattern[flickFrame] ?? 0;
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: "78%",
        transform: "translateY(-50%)",
        opacity: containerOpacity,
      }}
    >
      {/* "Leaving your" — small, left-aligned, flush left */}
      <div
        style={{
          fontFamily: scriptFont,
          fontSize: 90,
          fontWeight: 700,
          background: "linear-gradient(180deg, #FFFFFF 0%, #B0B0B0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: leavingOpacity,
          transform: `translateY(${leavingY}px)`,
          textShadow: "none",
          filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.6))",
          textAlign: "left",
          marginBottom: -50,
        }}
      >
        {scene.words[0].word} {scene.words[1].word}
      </div>

      {/* "country" — huge, indented to align under "your" */}
      <div
        style={{
          fontSize: 160,
          fontWeight: 800,
          background: "linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: countryOpacity,
          transform: `translateX(${countryX}px)`,
          textShadow: "none",
          filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.6))",
          lineHeight: 1,
          marginLeft: 80,
        }}
      >
        {scene.words[2].word}
      </div>

      {/* "is not exciting" — right-aligned to flush with end of "country" */}
      <div
        style={{
          fontFamily: scriptFont,
          fontSize: 90,
          fontWeight: 700,
          background: "linear-gradient(180deg, #FFFFFF 0%, #B0B0B0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: isOpacity,
          transform: `translateY(${isY}px)`,
          textShadow: "none",
          filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.6))",
          textAlign: "right",
          marginTop: -10,
          paddingRight: 10,
        }}
      >
        {scene.words[3].word} {scene.words[4].word} {scene.words[5].word}
      </div>
    </div>
  );
};
