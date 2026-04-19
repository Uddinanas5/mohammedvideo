export interface WordTiming {
  word: string;
  startFrame: number;
  endFrame: number;
}

export interface SubtitleChunk {
  words: WordTiming[];
  startFrame: number;
  endFrame: number;
}

const FPS = 30;

const words = [
  { word: "Every", start: 0.0, end: 0.42 },
  { word: "time", start: 0.42, end: 0.58 },
  { word: "life", start: 0.58, end: 0.76 },
  { word: "hit", start: 0.76, end: 0.94 },
  { word: "me", start: 0.94, end: 1.02 },
  { word: "hard,", start: 1.02, end: 1.26 },
  { word: "I", start: 1.38, end: 1.44 },
  { word: "made", start: 1.44, end: 1.6 },
  { word: "the", start: 1.6, end: 1.8 },
  { word: "same", start: 1.8, end: 2.02 },
  { word: "mistake.", start: 2.02, end: 2.38 },
  { word: "When", start: 3.24, end: 3.52 },
  { word: "things", start: 3.52, end: 3.76 },
  { word: "got", start: 3.76, end: 3.94 },
  { word: "tough,", start: 3.94, end: 4.28 },
  { word: "stress,", start: 4.52, end: 4.94 },
  { word: "problems,", start: 5.28, end: 5.76 },
  { word: "life,", start: 6.04, end: 6.32 },
  { word: "I", start: 6.96, end: 7.44 },
  { word: "stopped", start: 7.44, end: 7.64 },
  { word: "working", start: 7.64, end: 7.96 },
  { word: "out.", start: 7.96, end: 8.2 },
  { word: "I", start: 8.32, end: 8.4 },
  { word: "told", start: 8.4, end: 8.52 },
  { word: "myself", start: 8.52, end: 8.92 },
  { word: "I'd", start: 8.92, end: 9.22 },
  { word: "get", start: 9.22, end: 9.34 },
  { word: "back", start: 9.34, end: 9.56 },
  { word: "to", start: 9.56, end: 9.74 },
  { word: "it", start: 9.74, end: 9.98 },
  { word: "when", start: 9.98, end: 10.46 },
  { word: "things", start: 10.46, end: 10.7 },
  { word: "calm", start: 10.7, end: 10.92 },
  { word: "down,", start: 10.92, end: 11.28 },
  { word: "when", start: 11.34, end: 11.6 },
  { word: "things", start: 11.6, end: 11.8 },
  { word: "never", start: 11.8, end: 12.06 },
  { word: "calm", start: 12.06, end: 12.34 },
  { word: "down.", start: 12.34, end: 12.68 },
  { word: "And", start: 13.6, end: 14.08 },
  { word: "then", start: 14.08, end: 14.2 },
  { word: "I", start: 14.2, end: 14.32 },
  { word: "started", start: 14.32, end: 14.78 },
  { word: "feeling", start: 14.78, end: 15.0 },
  { word: "lost,", start: 15.0, end: 15.34 },
  { word: "no", start: 15.66, end: 15.82 },
  { word: "confidence,", start: 15.82, end: 16.28 },
  { word: "no", start: 16.86, end: 17.0 },
  { word: "edge,", start: 17.0, end: 17.36 },
  { word: "mentally", start: 17.56, end: 17.88 },
  { word: "all", start: 17.88, end: 18.14 },
  { word: "over", start: 18.14, end: 18.3 },
  { word: "the", start: 18.3, end: 18.4 },
  { word: "place.", start: 18.4, end: 18.76 },
  { word: "Couldn't", start: 19.46, end: 19.94 },
  { word: "show", start: 19.94, end: 20.22 },
  { word: "up", start: 20.22, end: 20.42 },
  { word: "the", start: 20.42, end: 20.58 },
  { word: "way", start: 20.58, end: 20.74 },
  { word: "I", start: 20.74, end: 20.9 },
  { word: "used", start: 20.9, end: 21.16 },
  { word: "to.", start: 21.16, end: 21.34 },
  { word: "I", start: 21.6, end: 21.68 },
  { word: "kept", start: 21.68, end: 21.84 },
  { word: "thinking,", start: 21.84, end: 22.14 },
  { word: "why", start: 22.38, end: 22.52 },
  { word: "do", start: 22.52, end: 22.66 },
  { word: "I", start: 22.66, end: 22.74 },
  { word: "feel", start: 22.74, end: 22.9 },
  { word: "like", start: 22.9, end: 23.06 },
  { word: "this?", start: 23.06, end: 23.3 },
  { word: "Until", start: 23.9, end: 24.14 },
  { word: "one", start: 24.14, end: 24.38 },
  { word: "day", start: 24.38, end: 24.54 },
  { word: "it", start: 24.54, end: 24.62 },
  { word: "hit", start: 24.62, end: 24.74 },
  { word: "me.", start: 24.74, end: 24.92 },
  { word: "I", start: 25.42, end: 25.56 },
  { word: "don't", start: 25.56, end: 25.68 },
  { word: "feel", start: 25.68, end: 25.82 },
  { word: "like", start: 25.82, end: 25.96 },
  { word: "this", start: 25.96, end: 26.1 },
  { word: "because", start: 26.1, end: 26.34 },
  { word: "life", start: 26.34, end: 26.6 },
  { word: "is", start: 26.6, end: 26.78 },
  { word: "hard.", start: 26.78, end: 27.02 },
  { word: "I", start: 27.02, end: 27.92 },
  { word: "feel", start: 27.92, end: 28.06 },
  { word: "like", start: 28.06, end: 28.18 },
  { word: "this", start: 28.18, end: 28.3 },
  { word: "because", start: 28.3, end: 28.48 },
  { word: "I", start: 28.48, end: 28.64 },
  { word: "stopped", start: 28.64, end: 28.84 },
  { word: "doing", start: 28.84, end: 29.2 },
  { word: "the", start: 29.2, end: 29.36 },
  { word: "things", start: 29.36, end: 29.56 },
  { word: "that", start: 29.56, end: 29.76 },
  { word: "make", start: 29.76, end: 30.02 },
  { word: "me", start: 30.02, end: 30.22 },
  { word: "be.", start: 30.22, end: 30.4 },
  { word: "So", start: 31.88, end: 32.36 },
  { word: "I", start: 32.36, end: 32.46 },
  { word: "made", start: 32.46, end: 32.6 },
  { word: "the", start: 32.6, end: 32.72 },
  { word: "decision.", start: 32.72, end: 33.08 },
  { word: "Not", start: 34.08, end: 34.22 },
  { word: "when", start: 34.22, end: 34.38 },
  { word: "I", start: 34.38, end: 34.5 },
  { word: "felt", start: 34.5, end: 34.76 },
  { word: "ready,", start: 34.76, end: 35.14 },
  { word: "not", start: 36.12, end: 36.34 },
  { word: "when", start: 36.34, end: 36.54 },
  { word: "life", start: 36.54, end: 36.74 },
  { word: "got", start: 36.74, end: 36.94 },
  { word: "easier,", start: 36.94, end: 37.4 },
  { word: "I", start: 38.34, end: 38.5 },
  { word: "just", start: 38.5, end: 38.72 },
  { word: "started", start: 38.72, end: 39.1 },
  { word: "one", start: 39.1, end: 39.96 },
  { word: "workout,", start: 39.96, end: 40.42 },
  { word: "then", start: 41.92, end: 42.42 },
  { word: "another,", start: 42.42, end: 42.8 },
  { word: "and", start: 43.32, end: 43.46 },
  { word: "slowly", start: 43.46, end: 43.8 },
  { word: "I", start: 43.8, end: 44.36 },
  { word: "got", start: 44.36, end: 44.46 },
  { word: "myself", start: 44.46, end: 44.78 },
  { word: "back.", start: 44.78, end: 45.02 },
  { word: "The", start: 45.5, end: 45.62 },
  { word: "confidence,", start: 45.62, end: 45.92 },
  { word: "the", start: 46.24, end: 46.28 },
  { word: "sharpness,", start: 46.28, end: 46.82 },
  { word: "the", start: 47.0, end: 47.1 },
  { word: "edge,", start: 47.1, end: 47.52 },
  { word: "it", start: 48.52, end: 48.8 },
  { word: "all", start: 48.8, end: 48.92 },
  { word: "came", start: 48.92, end: 49.12 },
  { word: "back.", start: 49.12, end: 49.34 },
  { word: "It", start: 49.88, end: 50.26 },
  { word: "starts", start: 50.26, end: 50.48 },
  { word: "in", start: 50.48, end: 50.68 },
  { word: "your", start: 50.68, end: 50.76 },
  { word: "mind,", start: 50.76, end: 51.0 },
  { word: "and", start: 51.44, end: 51.68 },
  { word: "it", start: 51.68, end: 51.78 },
  { word: "takes", start: 51.78, end: 51.98 },
  { word: "one", start: 51.98, end: 52.22 },
  { word: "step,", start: 52.22, end: 52.52 },
  { word: "then", start: 52.74, end: 53.1 },
  { word: "another.", start: 53.1, end: 53.42 },
];

// Group into sentence-like chunks based on pauses (>0.5s gap)
// Words within a chunk accumulate on screen as spoken
function groupWords(): SubtitleChunk[] {
  const rawGroups: (typeof words)[] = [];
  let current: typeof words = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prev = current[current.length - 1];

    const hasPause = prev && word.start - prev.end > 0.5;

    if (current.length >= 5 || (current.length > 0 && hasPause)) {
      rawGroups.push(current);
      current = [];
    }

    current.push(word);
  }
  if (current.length > 0) rawGroups.push(current);

  // Convert to chunks with per-word frame timings
  return rawGroups.map((group, gi) => {
    const chunkStart = group[0].start;
    const chunkEnd = group[group.length - 1].end;

    // Hold until next chunk starts, or +0.8s, capped at 1.5s extra
    const nextStart =
      gi < rawGroups.length - 1 ? rawGroups[gi + 1][0].start : chunkEnd + 0.8;
    const holdUntil = Math.min(nextStart, chunkEnd + 1.5);

    return {
      words: group.map((w) => ({
        word: w.word,
        // Frame relative to chunk start — so word appears at exact speech time
        startFrame: Math.round((w.start - chunkStart) * FPS),
        endFrame: Math.round((w.end - chunkStart) * FPS),
      })),
      startFrame: Math.round(chunkStart * FPS),
      endFrame: Math.round(holdUntil * FPS),
    };
  });
}

export const subtitleChunks = groupWords();
