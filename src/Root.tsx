import { Composition } from "remotion";
import { MorrisVideo } from "./MorrisVideo";
import { MoReel } from "./MoReel/MoReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MoReel"
        component={MoReel}
        durationInFrames={Math.ceil(59.7 * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MorrisVideo"
        component={MorrisVideo}
        durationInFrames={Math.ceil(54.5 * 30)}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
