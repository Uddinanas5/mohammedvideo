import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { loadFont as loadScript } from "@remotion/google-fonts/Cormorant";
import { Scene } from "./subtitleData";

const { fontFamily: scriptFont } = loadScript("italic", { weights: ["500"] });

// ── Word classification ──
const CONNECTOR_WORDS = new Set([
  "i", "a", "an", "the", "is", "it", "my", "in", "on", "of", "to", "at",
  "or", "and", "be", "do", "no", "up", "was", "but", "for", "not", "had",
  "has", "you", "her", "his", "its", "we", "he", "she", "me", "if", "so",
  "as", "by", "all", "got", "get", "one", "out",
  "that", "this", "with", "from", "they", "have", "been", "were", "will",
  "each", "when", "your", "what", "some", "them", "than", "also", "into",
  "it's", "i'd", "i'm", "didn't", "wasn't", "there's", "that's", "couldn't",
  "weren't", "where", "there", "their", "these", "those", "which", "would",
  "could", "about", "ever", "most", "more", "even", "very", "much", "once",
  "only", "over", "down", "back", "here", "then", "away", "else", "still",
]);

function isEmphasisWord(word: string): boolean {
  const clean = word.replace(/[.,!?;:]/g, "").toLowerCase();
  if (clean.length < 4) return false;
  return !CONNECTOR_WORDS.has(clean);
}

// ── Visual line grouping ──
interface VisualLine {
  words: { word: string; start: number }[];
  isEmphasis: boolean;
}

function buildLines(words: { word: string; start: number }[]): VisualLine[] {
  const lines: VisualLine[] = [];
  let buf: { word: string; start: number }[] = [];
  let bufIsEm: boolean | null = null;

  const flush = () => {
    if (buf.length > 0 && bufIsEm !== null) {
      lines.push({ words: [...buf], isEmphasis: bufIsEm });
      buf = [];
      bufIsEm = null;
    }
  };

  for (const w of words) {
    const em = isEmphasisWord(w.word);
    if (bufIsEm !== null && bufIsEm !== em) flush();
    buf.push(w);
    bufIsEm = em;
    const maxPerLine = em ? 2 : 3;
    if (buf.length >= maxPerLine) flush();
  }
  flush();
  return lines;
}

// ── Flicker-IN: starts visible, quick 4-frame flicker ──
const FLICKER = [1, 0, 1, 1];

const ALIGNS: ("left" | "right" | "center")[] = [
  "left", "right", "center", "left",
];

// ── Component ──
export const CinematicCaption: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();

  const lines = useMemo(() => buildLines(scene.words), [scene.words]);
  const hasEmphasis = useMemo(() => lines.some((l) => l.isEmphasis), [lines]);

  // Flicker: 4 frames, starts visible
  const flicker = frame < FLICKER.length ? FLICKER[frame] : 1;

  // Quick 3-frame slide (subtle)
  const slideY = interpolate(frame, [0, 3], [8, 0], {
    extrapolateRight: "clamp",
  });

  // ── Bridge mode (all function words) ──
  if (!hasEmphasis) {
    return (
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          bottom: 280,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          opacity: flicker,
          transform: `translateY(${slideY}px)`,
        }}
      >
        {scene.words.map((w, i) => (
          <span
            key={i}
            style={{
              fontSize: 72,
              fontWeight: 800,
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 16px rgba(0,0,0,0.7)",
              display: "inline-block",
              lineHeight: 1,
            }}
          >
            {w.word}
          </span>
        ))}
      </div>
    );
  }

  // ── Impact mode (has emphasis words) ──
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        bottom: 260,
        display: "flex",
        flexDirection: "column",
        opacity: flicker,
        transform: `translateY(${slideY}px)`,
      }}
    >
      {lines.map((line, li) => {
        const align = ALIGNS[li % ALIGNS.length];
        const isEm = line.isEmphasis;
        const prevIsEm = li > 0 ? lines[li - 1].isEmphasis : null;

        // Tight overlap between lines (like the Opener)
        let marginTop = 0;
        if (li > 0) {
          if (isEm && !prevIsEm) marginTop = -20; // emphasis after connector: overlap up
          else if (!isEm && prevIsEm) marginTop = -12; // connector after emphasis: tuck in
          else marginTop = -6; // same type: slight tighten
        }

        return (
          <div
            key={li}
            style={{
              display: "flex",
              gap: isEm ? 14 : 8,
              justifyContent:
                align === "left"
                  ? "flex-start"
                  : align === "right"
                    ? "flex-end"
                    : "center",
              marginTop,
              paddingLeft: align === "left" ? 8 : 0,
              paddingRight: align === "right" ? 8 : 0,
            }}
          >
            {line.words.map((w, wi) => (
              <span
                key={wi}
                style={{
                  fontFamily: isEm ? undefined : scriptFont,
                  fontSize: isEm ? 100 : 62,
                  fontWeight: isEm ? 800 : 500,
                  fontStyle: isEm ? "normal" : "italic",
                  background: isEm
                    ? "linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 100%)"
                    : "linear-gradient(180deg, #FFFFFF 0%, #B0B0B0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 16px rgba(0,0,0,0.7)",
                  lineHeight: 1,
                  display: "inline-block",
                }}
              >
                {w.word}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
