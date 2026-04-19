import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { SubtitleChunk } from "./subtitles";

export const SubtitleWord: React.FC<{ chunk: SubtitleChunk }> = ({ chunk }) => {
  const frame = useCurrentFrame();
  const {} = useVideoConfig();
  const durationFrames = chunk.endFrame - chunk.startFrame;

  // Smooth fade out over last 10 frames
  const fadeOutStart = Math.max(0, durationFrames - 10);
  const fadeOut = interpolate(frame, [fadeOutStart, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "center",
          gap: "0px 14px",
          whiteSpace: "nowrap",
          opacity: fadeOut,
        }}
      >
        {chunk.words.map((w, i) => {
          const localFrame = frame - w.startFrame;
          const isActive = frame >= w.startFrame;

          // Instant appear — 1 frame fade in
          const opacity = isActive
            ? interpolate(localFrame, [0, 1], [0, 1], {
                extrapolateRight: "clamp",
              })
            : 0;
          const y = isActive
            ? interpolate(localFrame, [0, 1], [4, 0], {
                extrapolateRight: "clamp",
              })
            : 0;
          const blur = 0;

          return (
            <span
              key={i}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: 72,
                color: "white",
                display: "inline-block",
                visibility: "visible",
                opacity,
                transform: `translateY(${y}px)`,
                filter: blur > 0.01 ? `blur(${blur}px)` : "none",
                letterSpacing: "-0.01em",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
