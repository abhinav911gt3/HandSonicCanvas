import React, { useEffect } from "react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";

// Replace with your Google Drive MIDI file ID
const GOOGLE_DRIVE_MIDI_FILE_ID = "your-midi-file-id";

// Instruments
const midiInstruments = [
  { label: "Piano", synth: "polySynth" },
  { label: "Guitar", synth: "guitar" },
  { label: "Synth", synth: "fmSynth" },
  { label: "Drums", synth: "kick" }
];

// Synth waveforms
const synthWaveforms = [
  { label: "Sine (Wave Up)", type: "sine" },
  { label: "Sawtooth (Wave Down)", type: "sawtooth" },
  { label: "Square", type: "square" }
];

// Guitar notes (6 strings x 5 frets)
const guitarStrings = [
  { string: 6, base: "E3", notes: ["E3", "F3", "F#3", "G3", "G#3"] },  // Low E string
  { string: 5, base: "A3", notes: ["A3", "A#3", "B3", "C4", "C#4"] },  // A string
  { string: 4, base: "D4", notes: ["D4", "D#4", "E4", "F4", "F#4"] },  // D string
  { string: 3, base: "G4", notes: ["G4", "G#4", "A4", "A#4", "B4"] },  // G string
  { string: 2, base: "B4", notes: ["B4", "C5", "C#5", "D5", "D#5"] },  // B string
  { string: 1, base: "E5", notes: ["E5", "F5", "F#5", "G5", "G#5"] }   // High E string
];

// Piano keys
const pianoKeys = Array.from({ length: 61 }, (_, i) => {
  const oct = 2 + Math.floor(i / 12);
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return notes[i % 12] + oct;
});

// Drum parts
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

// Ensure Tone context is started
const ensureStarted = async () => {
  if (!window._toneStarted) {
    await Tone.start();
    window._toneStarted = true;
  }
};

// Initialize synthesizers
const getSynths = () => {
  if (!window._synths) {
    window._synths = {
      polySynth: new Tone.PolySynth(Tone.Synth).toDestination(),
      fmSynth: new Tone.FMSynth().toDestination(),
      guitar: new Tone.AMSynth().toDestination(),
      kick: new Tone.MembraneSynth().toDestination(),
      snare: new Tone.MembraneSynth().toDestination(),
      hiHatClosed: new Tone.MetalSynth().toDestination(),
      hiHatOpen: new Tone.MetalSynth().toDestination(),
      tom1: new Tone.MembraneSynth().toDestination(),
      tom2: new Tone.MembraneSynth().toDestination(),
      tom3: new Tone.MembraneSynth().toDestination(),
      crash: new Tone.MetalSynth().toDestination(),
      ride: new Tone.MetalSynth().toDestination()
    };
  }
  return window._synths;
};

// Fetch MIDI file from Google Drive
const fetchMidiFile = async (url) => {
  const res = await fetch(url);
  return await res.arrayBuffer();
};

// Play MIDI
const playMidiFile = async (url, synthName) => {
  await ensureStarted();
  const synths = getSynths();
  const buffer = await fetchMidiFile(url);
  const midi = new Midi(buffer);

  midi.tracks.forEach(track => {
    track.notes.forEach(note => {
      setTimeout(() => {
        synths[synthName]?.triggerAttackRelease(note.name, note.duration || "8n");
      }, note.time * 1000);
    });
  });
};

// Drum handlers
const drumFns = {
  playKick: async () => { await ensureStarted(); getSynths().kick.triggerAttackRelease("C1","8n"); },
  playSnare: async () => { await ensureStarted(); getSynths().snare.triggerAttackRelease("C2","8n"); },
  playHiHatClosed: async () => { await ensureStarted(); getSynths().hiHatClosed.triggerAttackRelease("16n"); },
  playHiHatOpen: async () => { await ensureStarted(); getSynths().hiHatOpen.triggerAttackRelease("16n"); },
  playTom1: async () => { await ensureStarted(); getSynths().tom1.triggerAttackRelease("D2","8n"); },
  playTom2: async () => { await ensureStarted(); getSynths().tom2.triggerAttackRelease("F2","8n"); },
  playTom3: async () => { await ensureStarted(); getSynths().tom3.triggerAttackRelease("A2","8n"); },
  playCrash: async () => { await ensureStarted(); getSynths().crash.triggerAttackRelease("C3","8n"); },
  playRide: async () => { await ensureStarted(); getSynths().ride.triggerAttackRelease("D3","8n"); }
};

// Synth waveform
const playSynthWaveform = async (type) => {
  await ensureStarted();
  const synth = getSynths().fmSynth;
  synth.oscillator.type = type;
  synth.modulation.type = type;
  synth.triggerAttackRelease("C4","8n");
};

// Guitar
const playGuitarNote = async (note) => { await ensureStarted(); getSynths().guitar.triggerAttackRelease(note,"8n"); };
const playGuitarChordStrum = async (notes) => {
  await ensureStarted();
  const guitar = getSynths().guitar;
  notes.forEach((note, i) => setTimeout(() => guitar.triggerAttackRelease(note,"8n"), i*80));
};

// Piano
const playPianoNote = async (note) => { await ensureStarted(); getSynths().polySynth.triggerAttackRelease(note,"8n"); };
const playPianoChord = async () => { await ensureStarted(); getSynths().polySynth.triggerAttackRelease(["C4","E4","G4"],"8n"); };

export default function AudioInit() {
  useEffect(() => { ensureStarted(); }, []);

  return (
    <div style={{ fontFamily:"Arial, sans-serif", margin:"2em" }}>
      <h1>HandSonicCanvas Audio Init (React)</h1>

      <h2>MIDI Playback (Tone.js)</h2>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5em", marginBottom:"1em" }}>
        {midiInstruments.map(inst => (
          <button key={inst.label} style={{ padding:"0.5em 1em", background:"#c8e6c9" }}
            onClick={() => playMidiFile(`https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_MIDI_FILE_ID}`, inst.synth)}>
            Play MIDI ({inst.label})
          </button>
        ))}
      </div>

      <h2>Synthesizer (FMSynth)</h2>
      {synthWaveforms.map(wave => (
        <button key={wave.type} style={{ padding:"0.5em 1em", margin:"0.25em" }} onClick={() => playSynthWaveform(wave.type)}>
          {wave.label}
        </button>
      ))}

      <h2>Guitar (6 strings x 5 frets)</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
        {guitarStrings.map((stringData) => (
          <div key={stringData.string} style={{ display: "flex", gap: "0.5em" }}>
            {stringData.notes.map((note, fret) => (
              <button 
                key={note} 
                onClick={() => playGuitarNote(note)}
                style={{ 
                  width: "60px",
                  background: fret === 0 ? "#c8e6c9" : "#e8eaf6",
                  padding: "0.5em"
                }}
              >
                {`String ${stringData.string} Fret ${fret}`}
              </button>
            ))}
          </div>
        ))}
      </div>

      <h2>Piano</h2>
      {pianoKeys.map(n => <button key={n} onClick={() => playPianoNote(n)}>{n}</button>)}
      <button onClick={playPianoChord}>Play Chord (C4+E4+G4)</button>

      <h2>Drums</h2>
      {drumParts.map(d => <button key={d.label} onClick={() => drumFns[d.fn]()}>{d.label}</button>)}
    </div>
  );
}
