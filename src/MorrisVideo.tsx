import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { subtitleChunks } from "./subtitles";
import { SubtitleWord } from "./SubtitleWord";

const { fontFamily } = loadFont("normal", {
  weights: ["600"],
});

export const MorrisVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black", fontFamily }}>
      {subtitleChunks.map((chunk, i) => (
        <Sequence
          key={i}
          from={chunk.startFrame}
          durationInFrames={chunk.endFrame - chunk.startFrame + 1}
        >
          <SubtitleWord chunk={chunk} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
