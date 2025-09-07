let prevLeft = [];
let prevRight = [];
let selectedOctave = 0;
import bass_drum from "../sound/bass_drum.mp3";
import crash_drum from "../sound/crash.mp3";
import htom_drum from "../sound/htom.mp3";
import ftom_drum from "../sound/ftom.mp3";

import snare_drum from "../sound/snare.mp3";
import hihat_drum from "../sound/hihat.mp3";
import ride_drum from "../sound/ride.mp3";
import mtom_drum from "../sound/mtom.mp3";

// Helper: play only when state changes to "closed"
function playFingerSound(fingerState, prevState, audio) {
  if (fingerState === "closed" && prevState !== "closed") {
    audio.currentTime = 0;
    audio.play().catch((err) => console.error("Audio play error:", err));
  }
}

function getState(states, fingers) {
  for (const finger of fingers) {
    if (states[finger] === "closed") {
      return "closed";
    }
  }
  return "open";
}

const keySounds = [
  [
    new Audio(bass_drum),
    new Audio(snare_drum),
    new Audio(hihat_drum),
    new Audio(ride_drum),
    new Audio(crash_drum),
    new Audio(ftom_drum),
    new Audio(mtom_drum),
    new Audio(htom_drum),
    new Audio(bass_drum),
    new Audio(snare_drum),
    new Audio(hihat_drum),
    new Audio(ride_drum),
  ],
  [
    new Audio(bass_drum),
    new Audio(snare_drum),
    new Audio(hihat_drum),
    new Audio(ride_drum),
    new Audio(crash_drum),
    new Audio(ftom_drum),
    new Audio(mtom_drum),
    new Audio(htom_drum),
    new Audio(bass_drum),
    new Audio(snare_drum),
    new Audio(hihat_drum),
    new Audio(ride_drum),
  ],
  [
    new Audio(bass_drum),
    new Audio(snare_drum),
    new Audio(hihat_drum),
    new Audio(ride_drum),
    new Audio(crash_drum),
    new Audio(ftom_drum),
    new Audio(mtom_drum),
    new Audio(htom_drum),
    new Audio(bass_drum),
    new Audio(snare_drum),
    new Audio(hihat_drum),
    new Audio(ride_drum),
  ],
  [
    new Audio(bass_drum),
    new Audio(snare_drum),
    new Audio(hihat_drum),
    new Audio(ride_drum),
    new Audio(crash_drum),
    new Audio(ftom_drum),
    new Audio(mtom_drum),
    new Audio(htom_drum),
    new Audio(bass_drum),
    new Audio(snare_drum),
    new Audio(hihat_drum),
    new Audio(ride_drum),
  ],
  [
    new Audio(bass_drum),
    new Audio(snare_drum),
    new Audio(hihat_drum),
    new Audio(ride_drum),
    new Audio(crash_drum),
    new Audio(ftom_drum),
    new Audio(mtom_drum),
    new Audio(htom_drum),
    new Audio(bass_drum),
    new Audio(snare_drum),
    new Audio(hihat_drum),
    new Audio(ride_drum),
  ],
];

export default function piano(left = [], right = []) {
  // Left hand → octaves
  const octaves = [
    getState(right, [0]),
    getState(right, [0, 1]),
    getState(right, [0, 2]),
    getState(right, [0, 3]),
    getState(right, [0, 4]),
    getState(right, [0, 1, 2, 3, 4, 5]),
  ];

  // Right hand → keys
  const keys = [
    getState(left, [0]),
    getState(left, [1]),
    getState(left, [2]),
    getState(left, [3]),
    getState(left, [4]),
    getState(left, [0, 1]),
    getState(left, [0, 2]),
    getState(left, [0, 3]),
    getState(left, [0, 4]),
    getState(left, [2, 3, 4]),
    getState(left, [1, 2, 3, 4, 5]),
    getState(left, [0, 1, 2, 3, 4, 5]),
  ];

  const idx = octaves.findIndex((s) => s === "closed");
  if (idx !== -1) selectedOctave = idx;

  keys.forEach((state, i) => {
    const prev = prevLeft[i] || "open";
    playFingerSound(state, prev, keySounds[selectedOctave][i]);
  });

  // Update previous states
  prevLeft = [...keys];
  prevRight = [...octaves];
}
