export type AnimationType = "slideUp" | "punchScale" | "glowReveal" | "opener";

export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export interface Scene {
  words: WordTiming[];
  animation: AnimationType;
  startTime: number;
  endTime: number;
  /** If set, break into 2 lines after this word index (0-based) */
  lineBreakAfter?: number;
  /** Flicker out exit animation */
  flickerOut?: boolean;
}

const FPS = 30;

// Full transcript word timings from Whisper
const w: WordTiming[] = [
  /*  0 */ { word: "Leaving", start: 0.0, end: 0.36 },
  /*  1 */ { word: "your", start: 0.36, end: 0.60 },
  /*  2 */ { word: "country", start: 0.60, end: 0.98 },
  /*  3 */ { word: "is", start: 0.98, end: 1.46 },
  /*  4 */ { word: "not", start: 1.46, end: 1.62 },
  /*  5 */ { word: "exciting.", start: 1.62, end: 2.12 },
  /*  6 */ { word: "It's", start: 2.74, end: 2.78 },
  /*  7 */ { word: "an", start: 2.78, end: 2.88 },
  /*  8 */ { word: "adventure.", start: 2.88, end: 3.40 },
  /*  9 */ { word: "It's", start: 3.82, end: 4.00 },
  /* 10 */ { word: "one", start: 4.00, end: 4.18 },
  /* 11 */ { word: "of", start: 4.18, end: 4.26 },
  /* 12 */ { word: "the", start: 4.26, end: 4.38 },
  /* 13 */ { word: "most", start: 4.38, end: 4.68 },
  /* 14 */ { word: "painful", start: 4.68, end: 4.94 },
  /* 15 */ { word: "things", start: 4.94, end: 5.36 },
  /* 16 */ { word: "you", start: 5.36, end: 5.54 },
  /* 17 */ { word: "will", start: 5.54, end: 5.64 },
  /* 18 */ { word: "ever", start: 5.64, end: 5.82 },
  /* 19 */ { word: "do.", start: 5.82, end: 6.02 },
  /* 20 */ { word: "By", start: 6.52, end: 6.62 },
  /* 21 */ { word: "18,", start: 6.62, end: 7.06 },
  /* 22 */ { word: "I'd", start: 7.42, end: 7.60 },
  /* 23 */ { word: "been", start: 7.60, end: 7.70 },
  /* 24 */ { word: "cutting", start: 7.70, end: 7.98 },
  /* 25 */ { word: "hair", start: 7.98, end: 8.22 },
  /* 26 */ { word: "for", start: 8.22, end: 8.42 },
  /* 27 */ { word: "four", start: 8.42, end: 8.66 },
  /* 28 */ { word: "years.", start: 8.66, end: 8.90 },
  /* 29 */ { word: "I", start: 9.34, end: 9.46 },
  /* 30 */ { word: "was", start: 9.46, end: 9.60 },
  /* 31 */ { word: "good", start: 9.60, end: 9.76 },
  /* 32 */ { word: "at", start: 9.76, end: 9.94 },
  /* 33 */ { word: "it,", start: 9.94, end: 10.06 },
  /* 34 */ { word: "but", start: 10.30, end: 10.36 },
  /* 35 */ { word: "I", start: 10.36, end: 10.48 },
  /* 36 */ { word: "looked", start: 10.48, end: 10.64 },
  /* 37 */ { word: "around", start: 10.64, end: 10.98 },
  /* 38 */ { word: "and", start: 10.98, end: 11.32 },
  /* 39 */ { word: "I", start: 11.32, end: 11.40 },
  /* 40 */ { word: "knew", start: 11.40, end: 11.58 },
  /* 41 */ { word: "if", start: 11.58, end: 12.14 },
  /* 42 */ { word: "I", start: 12.14, end: 12.28 },
  /* 43 */ { word: "stayed", start: 12.28, end: 12.50 },
  /* 44 */ { word: "in", start: 12.50, end: 12.62 },
  /* 45 */ { word: "Syria,", start: 12.62, end: 12.94 },
  /* 46 */ { word: "there's", start: 13.34, end: 13.62 },
  /* 47 */ { word: "a", start: 13.62, end: 13.70 },
  /* 48 */ { word: "ceiling", start: 13.70, end: 14.06 },
  /* 49 */ { word: "on", start: 14.06, end: 14.26 },
  /* 50 */ { word: "my", start: 14.26, end: 14.42 },
  /* 51 */ { word: "life.", start: 14.42, end: 14.78 },
  /* 52 */ { word: "The", start: 15.40, end: 15.54 },
  /* 53 */ { word: "war", start: 15.54, end: 15.72 },
  /* 54 */ { word: "wasn't", start: 15.72, end: 16.00 },
  /* 55 */ { word: "stopping.", start: 16.00, end: 16.40 },
  /* 56 */ { word: "The", start: 16.84, end: 16.90 },
  /* 57 */ { word: "opportunities", start: 16.90, end: 17.34 },
  /* 58 */ { word: "were", start: 17.34, end: 17.68 },
  /* 59 */ { word: "incoming.", start: 17.68, end: 18.06 },
  /* 60 */ { word: "I", start: 18.60, end: 18.74 },
  /* 61 */ { word: "had", start: 18.74, end: 18.82 },
  /* 62 */ { word: "to", start: 18.82, end: 18.94 },
  /* 63 */ { word: "make", start: 18.94, end: 19.06 },
  /* 64 */ { word: "a", start: 19.06, end: 19.16 },
  /* 65 */ { word: "choice.", start: 19.16, end: 19.30 },
  /* 66 */ { word: "Stay", start: 19.74, end: 19.98 },
  /* 67 */ { word: "where", start: 19.98, end: 20.14 },
  /* 68 */ { word: "it's", start: 20.14, end: 20.34 },
  /* 69 */ { word: "comfortable,", start: 20.34, end: 20.70 },
  /* 70 */ { word: "where", start: 21.04, end: 21.20 },
  /* 71 */ { word: "my", start: 21.20, end: 21.36 },
  /* 72 */ { word: "family", start: 21.36, end: 21.70 },
  /* 73 */ { word: "is,", start: 21.70, end: 22.04 },
  /* 74 */ { word: "where", start: 22.22, end: 22.38 },
  /* 75 */ { word: "I", start: 22.38, end: 22.56 },
  /* 76 */ { word: "know", start: 22.56, end: 22.70 },
  /* 77 */ { word: "every", start: 22.70, end: 22.96 },
  /* 78 */ { word: "street", start: 22.96, end: 23.26 },
  /* 79 */ { word: "and", start: 23.26, end: 23.76 },
  /* 80 */ { word: "every", start: 23.76, end: 23.98 },
  /* 81 */ { word: "face,", start: 23.98, end: 24.36 },
  /* 82 */ { word: "or", start: 24.70, end: 24.78 },
  /* 83 */ { word: "leave", start: 24.78, end: 24.98 },
  /* 84 */ { word: "everything,", start: 24.98, end: 25.40 },
  /* 85 */ { word: "and", start: 25.84, end: 25.90 },
  /* 86 */ { word: "I", start: 25.90, end: 26.02 },
  /* 87 */ { word: "mean", start: 26.02, end: 26.16 },
  /* 88 */ { word: "everything", start: 26.16, end: 26.62 },
  /* 89 */ { word: "and", start: 26.62, end: 27.10 },
  /* 90 */ { word: "be", start: 27.10, end: 27.24 },
  /* 91 */ { word: "on", start: 27.24, end: 27.38 },
  /* 92 */ { word: "myself", start: 27.38, end: 27.70 },
  /* 93 */ { word: "somewhere", start: 27.70, end: 28.08 },
  /* 94 */ { word: "else.", start: 28.08, end: 28.38 },
  /* 95 */ { word: "I", start: 28.38, end: 28.78 },
  /* 96 */ { word: "chose", start: 28.78, end: 29.02 },
  /* 97 */ { word: "Dubai.", start: 29.02, end: 29.38 },
  /* 98 */ { word: "I", start: 29.96, end: 30.10 },
  /* 99 */ { word: "didn't", start: 30.10, end: 30.24 },
  /*100 */ { word: "have", start: 30.24, end: 30.40 },
  /*101 */ { word: "a", start: 30.40, end: 30.52 },
  /*102 */ { word: "plan.", start: 30.52, end: 30.78 },
  /*103 */ { word: "I", start: 31.12, end: 31.18 },
  /*104 */ { word: "didn't", start: 31.18, end: 31.34 },
  /*105 */ { word: "have", start: 31.34, end: 31.50 },
  /*106 */ { word: "money.", start: 31.50, end: 31.80 },
  /*107 */ { word: "I", start: 32.12, end: 32.12 },
  /*108 */ { word: "didn't", start: 32.12, end: 32.28 },
  /*109 */ { word: "have", start: 32.28, end: 32.44 },
  /*110 */ { word: "anything.", start: 32.44, end: 32.86 },
  /*111 */ { word: "All", start: 33.16, end: 33.26 },
  /*112 */ { word: "I", start: 33.26, end: 33.42 },
  /*113 */ { word: "had", start: 33.42, end: 33.58 },
  /*114 */ { word: "was", start: 33.58, end: 33.80 },
  /*115 */ { word: "my", start: 33.80, end: 34.00 },
  /*116 */ { word: "skill", start: 34.00, end: 34.26 },
  /*117 */ { word: "and", start: 34.26, end: 34.84 },
  /*118 */ { word: "my", start: 34.84, end: 35.00 },
  /*119 */ { word: "knowledge", start: 35.00, end: 35.34 },
  /*120 */ { word: "and", start: 35.34, end: 35.90 },
  /*121 */ { word: "that", start: 35.90, end: 36.08 },
  /*122 */ { word: "feeling", start: 36.08, end: 36.40 },
  /*123 */ { word: "inside", start: 36.40, end: 36.82 },
  /*124 */ { word: "my", start: 36.82, end: 37.04 },
  /*125 */ { word: "gut", start: 37.04, end: 37.22 },
  /*126 */ { word: "that", start: 37.22, end: 37.70 },
  /*127 */ { word: "I", start: 37.70, end: 37.84 },
  /*128 */ { word: "meant", start: 37.84, end: 38.10 },
  /*129 */ { word: "for", start: 38.10, end: 38.68 },
  /*130 */ { word: "something", start: 38.68, end: 39.06 },
  /*131 */ { word: "more", start: 39.06, end: 39.34 },
  /*132 */ { word: "than", start: 39.34, end: 39.50 },
  /*133 */ { word: "just", start: 39.50, end: 39.64 },
  /*134 */ { word: "surviving.", start: 39.64, end: 40.08 },
  /*135 */ { word: "The", start: 40.64, end: 40.80 },
  /*136 */ { word: "day", start: 40.80, end: 40.94 },
  /*137 */ { word: "I", start: 40.94, end: 41.08 },
  /*138 */ { word: "left,", start: 41.08, end: 41.34 },
  /*139 */ { word: "I", start: 41.56, end: 41.72 },
  /*140 */ { word: "didn't", start: 41.72, end: 41.90 },
  /*141 */ { word: "know", start: 41.90, end: 42.08 },
  /*142 */ { word: "when", start: 42.08, end: 42.28 },
  /*143 */ { word: "I", start: 42.28, end: 42.44 },
  /*144 */ { word: "would", start: 42.44, end: 42.58 },
  /*145 */ { word: "see", start: 42.58, end: 42.72 },
  /*146 */ { word: "my", start: 42.72, end: 42.86 },
  /*147 */ { word: "family", start: 42.86, end: 43.14 },
  /*148 */ { word: "again.", start: 43.14, end: 43.42 },
  /*149 */ { word: "That's", start: 43.92, end: 44.12 },
  /*150 */ { word: "about,", start: 44.12, end: 44.34 },
  /*151 */ { word: "nobody", start: 44.44, end: 44.70 },
  /*152 */ { word: "talks", start: 44.70, end: 44.94 },
  /*153 */ { word: "about", start: 44.94, end: 45.26 },
  /*154 */ { word: "when", start: 45.26, end: 45.46 },
  /*155 */ { word: "they", start: 45.46, end: 45.62 },
  /*156 */ { word: "see", start: 45.62, end: 45.82 },
  /*157 */ { word: "you", start: 45.82, end: 45.98 },
  /*158 */ { word: "live", start: 45.98, end: 46.14 },
  /*159 */ { word: "in", start: 46.14, end: 46.28 },
  /*160 */ { word: "the", start: 46.28, end: 46.40 },
  /*161 */ { word: "dream", start: 46.40, end: 46.66 },
  /*162 */ { word: "in", start: 46.66, end: 47.16 },
  /*163 */ { word: "Dubai.", start: 47.16, end: 47.42 },
  /*164 */ { word: "The", start: 47.98, end: 48.20 },
  /*165 */ { word: "sacrifice", start: 48.20, end: 48.84 },
  /*166 */ { word: "that", start: 48.84, end: 49.46 },
  /*167 */ { word: "it", start: 49.46, end: 49.66 },
  /*168 */ { word: "took", start: 49.66, end: 49.94 },
  /*169 */ { word: "just", start: 49.94, end: 50.52 },
  /*170 */ { word: "to", start: 50.52, end: 50.70 },
  /*171 */ { word: "get", start: 50.70, end: 50.84 },
  /*172 */ { word: "here.", start: 50.84, end: 51.06 },
  /*173 */ { word: "I", start: 51.64, end: 51.80 },
  /*174 */ { word: "was", start: 51.80, end: 51.94 },
  /*175 */ { word: "18.", start: 51.94, end: 52.20 },
  /*176 */ { word: "I", start: 52.72, end: 52.78 },
  /*177 */ { word: "left", start: 52.78, end: 52.96 },
  /*178 */ { word: "everything", start: 52.96, end: 53.48 },
  /*179 */ { word: "and", start: 53.48, end: 53.96 },
  /*180 */ { word: "I", start: 53.96, end: 54.10 },
  /*181 */ { word: "landed", start: 54.10, end: 54.40 },
  /*182 */ { word: "in", start: 54.40, end: 54.60 },
  /*183 */ { word: "a", start: 54.60, end: 54.70 },
  /*184 */ { word: "city", start: 54.70, end: 55.02 },
  /*185 */ { word: "where", start: 55.02, end: 55.66 },
  /*186 */ { word: "I", start: 55.66, end: 55.84 },
  /*187 */ { word: "knew", start: 55.84, end: 56.04 },
  /*188 */ { word: "nobody", start: 56.04, end: 56.48 },
  /*189 */ { word: "and", start: 56.48, end: 57.20 },
  /*190 */ { word: "that's", start: 57.20, end: 57.60 },
  /*191 */ { word: "where", start: 57.60, end: 57.82 },
  /*192 */ { word: "the", start: 57.82, end: 57.98 },
  /*193 */ { word: "real", start: 57.98, end: 58.10 },
  /*194 */ { word: "story", start: 58.10, end: 58.42 },
  /*195 */ { word: "begins.", start: 58.42, end: 58.72 },
];

// ── Scene definitions ──
// Rules: max 4 words, no overlapping time ranges, 2-liner only where noted
export const scenes: Scene[] = [
  // 0: "Leaving your country / is not exciting." — opener
  { words: [w[0], w[1], w[2], w[3], w[4], w[5]], animation: "opener", startTime: 0.0, endTime: 2.30, flickerOut: true },
  // 1: "It's an adventure."
  { words: [w[6], w[7], w[8]], animation: "punchScale", startTime: 2.74, endTime: 3.60 },
  // 2: "It's one of the"
  { words: [w[9], w[10], w[11], w[12]], animation: "slideUp", startTime: 3.82, endTime: 4.38 },
  // 3: "most painful things"
  { words: [w[13], w[14], w[15]], animation: "punchScale", startTime: 4.38, endTime: 5.36 },
  // 4: "you will ever do."
  { words: [w[16], w[17], w[18], w[19]], animation: "glowReveal", startTime: 5.36, endTime: 6.40 },
  // 5: "By 18,"
  { words: [w[20], w[21]], animation: "punchScale", startTime: 6.52, endTime: 7.30 },
  // 6: "I'd been cutting hair"
  { words: [w[22], w[23], w[24], w[25]], animation: "slideUp", startTime: 7.42, endTime: 8.22 },
  // 7: "for four years."
  { words: [w[26], w[27], w[28]], animation: "glowReveal", startTime: 8.22, endTime: 9.20 },
  // 8: "I was good at it,"
  { words: [w[29], w[30], w[31], w[32], w[33]], animation: "slideUp", startTime: 9.34, endTime: 10.20 },
  // 11: "but I looked around" — slide
  { words: [w[34], w[35], w[36], w[37]], animation: "slideUp", startTime: 10.30, endTime: 10.98 },
  // 12: "and I knew" — glow
  { words: [w[38], w[39], w[40]], animation: "glowReveal", startTime: 10.98, endTime: 11.58 },
  // 13: "if I stayed" — slide
  { words: [w[41], w[42], w[43]], animation: "slideUp", startTime: 11.58, endTime: 12.62 },
  // 14: "in Syria," — flicker (weight)
  { words: [w[44], w[45]], animation: "punchScale", startTime: 12.62, endTime: 13.20 },
  // 15: "there's a ceiling" — punch
  { words: [w[46], w[47], w[48]], animation: "punchScale", startTime: 13.34, endTime: 14.06 },
  // 16: "on my life." — flicker
  { words: [w[49], w[50], w[51]], animation: "punchScale", startTime: 14.06, endTime: 15.20 },
  // 17: "The war wasn't stopping." — punch
  { words: [w[52], w[53], w[54], w[55]], animation: "punchScale", startTime: 15.40, endTime: 16.70 },
  // 18: "The opportunities" — slide
  { words: [w[56], w[57]], animation: "slideUp", startTime: 16.84, endTime: 17.34 },
  // 19: "were incoming." — flicker
  { words: [w[58], w[59]], animation: "punchScale", startTime: 17.34, endTime: 18.40 },
  // 20: "I had to make" — glow
  { words: [w[60], w[61], w[62], w[63]], animation: "glowReveal", startTime: 18.60, endTime: 19.06 },
  // 21: "a choice." — punch
  { words: [w[64], w[65]], animation: "punchScale", startTime: 19.06, endTime: 19.60 },
  // 22: "Stay where it's" — slide
  { words: [w[66], w[67], w[68]], animation: "slideUp", startTime: 19.74, endTime: 20.34 },
  // 23: "comfortable," — flicker
  { words: [w[69]], animation: "punchScale", startTime: 20.34, endTime: 20.90 },
  // 24: "where my family is," — glow
  { words: [w[70], w[71], w[72], w[73]], animation: "glowReveal", startTime: 21.04, endTime: 22.10 },
  // 25: "where I know" — slide
  { words: [w[74], w[75], w[76]], animation: "slideUp", startTime: 22.22, endTime: 22.70 },
  // 26: "every street" — punch   (2-liner: "every street / and every face,")
  { words: [w[77], w[78], w[79], w[80]], animation: "punchScale", startTime: 22.70, endTime: 24.00, lineBreakAfter: 1 },
  // 27: "every face," — moved into scene 26 as 2-liner ^^
  // 28: "or leave everything," — flicker
  { words: [w[82], w[83], w[84]], animation: "punchScale", startTime: 24.70, endTime: 25.70 },
  // 29: "and I mean everything" — punch 2-liner: "and I mean / everything"
  { words: [w[85], w[86], w[87], w[88]], animation: "punchScale", startTime: 25.84, endTime: 26.62, lineBreakAfter: 2 },
  // 30: "and be on myself" — slide
  { words: [w[89], w[90], w[91], w[92]], animation: "slideUp", startTime: 26.62, endTime: 27.70 },
  // 31: "somewhere else." — glow
  { words: [w[93], w[94]], animation: "glowReveal", startTime: 27.70, endTime: 28.38 },
  // 32: "I chose Dubai." — punch
  { words: [w[95], w[96], w[97]], animation: "punchScale", startTime: 28.38, endTime: 29.70 },
  // 33: "I didn't have" — flicker
  { words: [w[98], w[99], w[100]], animation: "punchScale", startTime: 29.96, endTime: 30.52 },
  // 34: "a plan." — punch
  { words: [w[101], w[102]], animation: "punchScale", startTime: 30.52, endTime: 31.00 },
  // 35: "I didn't have money." — flicker
  { words: [w[103], w[104], w[105], w[106]], animation: "punchScale", startTime: 31.12, endTime: 32.00 },
  // 36: "I didn't have anything." — flicker
  { words: [w[107], w[108], w[109], w[110]], animation: "punchScale", startTime: 32.12, endTime: 33.00 },
  // 37: "All I had was" — slide
  { words: [w[111], w[112], w[113], w[114]], animation: "slideUp", startTime: 33.16, endTime: 33.80 },
  // 38: "my skill" — punch
  { words: [w[115], w[116]], animation: "punchScale", startTime: 33.80, endTime: 34.26 },
  // 39: "and my knowledge" — glow
  { words: [w[117], w[118], w[119]], animation: "glowReveal", startTime: 34.26, endTime: 35.34 },
  // 40: "and that feeling" — slide
  { words: [w[120], w[121], w[122]], animation: "slideUp", startTime: 35.34, endTime: 36.40 },
  // 41: "inside my gut" — punch
  { words: [w[123], w[124], w[125]], animation: "punchScale", startTime: 36.40, endTime: 37.22 },
  // 42: "that I meant for" — glow
  { words: [w[126], w[127], w[128], w[129]], animation: "glowReveal", startTime: 37.22, endTime: 38.68 },
  // 43: "something more" — punch
  { words: [w[130], w[131]], animation: "punchScale", startTime: 38.68, endTime: 39.34 },
  // 44: "than just surviving." — flicker
  { words: [w[132], w[133], w[134]], animation: "punchScale", startTime: 39.34, endTime: 40.40 },
  // 45: "The day I left," — slide
  { words: [w[135], w[136], w[137], w[138]], animation: "slideUp", startTime: 40.64, endTime: 41.50 },
  // 46: "I didn't know when" — glow
  { words: [w[139], w[140], w[141], w[142]], animation: "glowReveal", startTime: 41.56, endTime: 42.28 },
  // 47: "I would see" — slide
  { words: [w[143], w[144], w[145]], animation: "slideUp", startTime: 42.28, endTime: 42.72 },
  // 48: "my family again." — flicker
  { words: [w[146], w[147], w[148]], animation: "punchScale", startTime: 42.72, endTime: 43.70 },
  // 49: "That's about," — glow
  { words: [w[149], w[150]], animation: "glowReveal", startTime: 43.92, endTime: 44.44 },
  // 50: "nobody talks about" — punch
  { words: [w[151], w[152], w[153]], animation: "punchScale", startTime: 44.44, endTime: 45.26 },
  // 51: "when they see you" — slide
  { words: [w[154], w[155], w[156], w[157]], animation: "slideUp", startTime: 45.26, endTime: 45.98 },
  // 52: "live in the dream" — glow
  { words: [w[158], w[159], w[160], w[161]], animation: "glowReveal", startTime: 45.98, endTime: 46.66 },
  // 53: "in Dubai." — punch
  { words: [w[162], w[163]], animation: "punchScale", startTime: 46.66, endTime: 47.70 },
  // 54: "The sacrifice" — flicker
  { words: [w[164], w[165]], animation: "punchScale", startTime: 47.98, endTime: 48.84 },
  // 55: "that it took" — slide
  { words: [w[166], w[167], w[168]], animation: "slideUp", startTime: 48.84, endTime: 49.94 },
  // 56: "just to get here." — punch
  { words: [w[169], w[170], w[171], w[172]], animation: "punchScale", startTime: 49.94, endTime: 51.40 },
  // 57: "I was 18." — flicker
  { words: [w[173], w[174], w[175]], animation: "punchScale", startTime: 51.64, endTime: 52.50 },
  // 58: "I left everything" — punch
  { words: [w[176], w[177], w[178]], animation: "punchScale", startTime: 52.72, endTime: 53.48 },
  // 59: "and I landed" — slide
  { words: [w[179], w[180], w[181]], animation: "slideUp", startTime: 53.48, endTime: 54.60 },
  // 60: "in a city" — glow
  { words: [w[182], w[183], w[184]], animation: "glowReveal", startTime: 54.60, endTime: 55.02 },
  // 61: "where I knew nobody" — flicker
  { words: [w[185], w[186], w[187], w[188]], animation: "punchScale", startTime: 55.02, endTime: 56.48 },
  // 62: "and that's where the" — slide (2-liner: "and that's / where the")
  { words: [w[189], w[190], w[191], w[192]], animation: "slideUp", startTime: 56.48, endTime: 57.98, lineBreakAfter: 1 },
  // 63: "real story begins." — punch (final)
  { words: [w[193], w[194], w[195]], animation: "punchScale", startTime: 57.98, endTime: 59.00 },
];

export function timeToFrame(time: number): number {
  return Math.round(time * FPS);
}
