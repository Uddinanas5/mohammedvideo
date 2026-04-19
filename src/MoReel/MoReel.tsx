import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Video,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { scenes, timeToFrame } from "./subtitleData";
import { CinematicCaption } from "./CinematicCaption";
import { Opener } from "./Opener";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
});

const AnimationComponent = {
  slideUp: CinematicCaption,
  punchScale: CinematicCaption,
  glowReveal: CinematicCaption,
  opener: Opener,
} as const;

export const MoReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black", fontFamily }}>
      {/* Background video */}
      <Video
        src={staticFile("mo-reel2.mov")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Subtle dark gradient at bottom for text readability */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "45%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      />

      {/* Subtitle scenes */}
      {scenes.map((scene, i) => {
        const startFrame = timeToFrame(scene.startTime);
        const endFrame = timeToFrame(scene.endTime);
        const duration = endFrame - startFrame;

        if (duration <= 0) return null;

        const Component = AnimationComponent[scene.animation];

        return (
          <Sequence key={i} from={startFrame} durationInFrames={duration}>
            <Component scene={scene} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
