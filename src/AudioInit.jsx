import React, { useEffect } from "react";

// Load Tone.js from CDN
const loadTone = () => {
  if (!window.Tone) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tone@15.1.22/build/Tone.js";
    script.async = true;
    document.body.appendChild(script);
  }
};

const pianoKeys = [
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
  "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
  "C7"
];

const drumParts = [
  { label: "Kick (C1)", fn: "playKick" },
  { label: "Snare", fn: "playSnare" },
  { label: "Hi-Hat Closed", fn: "playHiHatClosed" },
  { label: "Hi-Hat Open", fn: "playHiHatOpen" },
  { label: "Tom 1", fn: "playTom1" },
  { label: "Tom 2", fn: "playTom2" },
  { label: "Tom 3", fn: "playTom3" },
  { label: "Crash Cymbal", fn: "playCrash" },
  { label: "Ride Cymbal", fn: "playRide" }
];

export default function AudioInit() {
  useEffect(() => {
    loadTone();
  }, []);

  // Ensure Tone.js context is started
  const ensureStarted = async () => {
    if (window.Tone && !window._toneStarted) {
      await window.Tone.start();
      window._toneStarted = true;
    }
  };

  // Synth setup (created once)
  const getSynths = () => {
    if (!window._synths && window.Tone) {
      const Tone = window.Tone;
      window._synths = {
        polySynth: new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "triangle" },
          envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 1.2 }
        }).toDestination(),
        kick: new Tone.MembraneSynth().toDestination(),
        snare: new Tone.NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
        }).toDestination(),
        hiHatClosed: new Tone.MetalSynth({
          frequency: 400,
          envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5
        }).toDestination(),
        hiHatOpen: new Tone.MetalSynth({
          frequency: 400,
          envelope: { attack: 0.01, decay: 0.3, release: 0.1 },
          harmonicity: 5.1,
          modulationIndex: 15,
          resonance: 3000,
          octaves: 1.5
        }).toDestination(),
        tom1: new Tone.MembraneSynth().toDestination(),
        tom2: new Tone.MembraneSynth().toDestination(),
        tom3: new Tone.MembraneSynth().toDestination(),
        crash: new Tone.MetalSynth({
          frequency: 200,
          envelope: { attack: 0.001, decay: 1.5, release: 0.1 },
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 1000,
          octaves: 3.5
        }).toDestination(),
        ride: new Tone.MetalSynth({
          frequency: 300,
          envelope: { attack: 0.001, decay: 1.2, release: 0.1 },
          harmonicity: 5.1,
          modulationIndex: 15,
          resonance: 3000,
          octaves: 3.5
        }).toDestination()
      };
    }
    return window._synths;
  };

  // Piano note handler
  const playPianoNote = async (note) => {
    await ensureStarted();
    const synths = getSynths();
    if (synths && synths.polySynth) {
      synths.polySynth.triggerAttackRelease(note, "8n");
    }
  };

  // Drum handlers
  const playKick = async () => {
    await ensureStarted();
    const synths = getSynths();
    synths.kick.triggerAttackRelease("C1", "8n");
  };
  const playSnare = async () => {
    await ensureStarted();
    const synths = getSynths();
    synths.snare.triggerAttackRelease("8n");
  };
  const playHiHatClosed = async () => {
    await ensureStarted();
    const synths = getSynths();
    synths.hiHatClosed.triggerAttackRelease("16n");
  };
  const playHiHatOpen = async () => {
    await ensureStarted();
    const synths = getSynths();
    synths.hiHatOpen.triggerAttackRelease("16n");
  };
  const playTom1 = async () => {
    await ensureStarted();
    const synths = getSynths();
    synths.tom1.triggerAttackRelease("D2", "8n");
  };
  const playTom2 = async () => {
    await ensureStarted();
    const synths = getSynths();
    synths.tom2.triggerAttackRelease("F2", "8n");
  };
  const playTom3 = async () => {
    await ensureStarted();
    const synths = getSynths();
    synths.tom3.triggerAttackRelease("A2", "8n");
  };
  const playCrash = async () => {
    await ensureStarted();
    const synths = getSynths();
    synths.crash.triggerAttackRelease("C3", "8n");
  };
  const playRide = async () => {
    await ensureStarted();
    const synths = getSynths();
    synths.ride.triggerAttackRelease("D3", "8n");
  };

  // Map drum part names to functions
  const drumFns = {
    playKick,
    playSnare,
    playHiHatClosed,
    playHiHatOpen,
    playTom1,
    playTom2,
    playTom3,
    playCrash,
    playRide
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "2em" }}>
      <h1>HandSonicCanvas Audio Init (React)</h1>
      <h2>Piano (PolySynth) - 61 Keys</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25em", marginBottom: "1em" }}>
        {pianoKeys.map((note) => (
          <button key={note} style={{ padding: "0.5em 1em", fontSize: "1em" }} onClick={() => playPianoNote(note)}>
            {note}
          </button>
        ))}
      </div>
      <h2>Drums (9 Sounds)</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25em" }}>
        {drumParts.map((drum) => (
          <button key={drum.label} style={{ padding: "0.5em 1em", fontSize: "1em" }} onClick={() => drumFns[drum.fn]()}> 
            {drum.label}
          </button>
        ))}
      </div>
    </div>
  );
}
