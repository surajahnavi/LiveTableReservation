import React, { useState } from 'react';

const SPICE_LEVELS = [
  { value: 1, label: 'Mild', emoji: '🌶️', desc: 'Little to no heat' },
  { value: 2, label: 'Mild-Medium', emoji: '🌶️🌶️', desc: 'Gentle warmth' },
  { value: 3, label: 'Medium', emoji: '🌶️🌶️🌶️', desc: 'Balanced heat' },
  { value: 4, label: 'Medium-High', emoji: '🌶️🌶️🌶️🌶️', desc: 'Noticeable kick' },
  { value: 5, label: 'Hot', emoji: '🌶️🌶️🌶️🌶️🌶️', desc: 'Fiery and bold' },
];

export default function SpiceLevelPage({ onPrev, onNext }) {
  const [level, setLevel] = useState(3);
  const spice = SPICE_LEVELS[level - 1];

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#f9fbfd', borderRadius: 24, boxShadow: '0 2px 24px rgba(0,0,0,0.08)', padding: 40 }}>
      <div style={{ marginBottom: 24, color: '#1976d2', fontWeight: 600 }}>Step 4 of 7 <span style={{ float: 'right', color: '#5a6a7a', fontWeight: 400 }}>57% Complete</span></div>
      <div style={{ height: 6, background: '#e3eaf3', borderRadius: 3, marginBottom: 32 }}>
        <div style={{ width: '57%', height: '100%', background: '#1976d2', borderRadius: 3 }} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, color: '#ff6600', marginBottom: 8 }}>🔥</div>
        <h2 style={{ margin: 0, color: '#222', fontWeight: 700 }}>How spicy do you like it?</h2>
        <div style={{ color: '#5a6a7a', marginTop: 8, marginBottom: 24 }}>
          Tell us your preferred spice level
        </div>
      </div>
      <div style={{ margin: '32px 0 24px 0' }}>
        <input
          type="range"
          min={1}
          max={5}
          value={level}
          onChange={e => setLevel(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 32 }}>{spice.emoji}</div>
        <div style={{ fontWeight: 700, fontSize: 22, margin: '8px 0' }}>{spice.label}</div>
        <div style={{ color: '#5a6a7a', fontSize: 16 }}>{spice.desc}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
        <button type="button" onClick={onPrev} style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 16, minWidth: 120 }}>Previous</button>
        <button type="button" onClick={onNext} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 16, minWidth: 120 }}>Next</button>
      </div>
    </div>
  );
}
