import React, { useState } from 'react';

const CUISINES = [
  { name: 'Italian', emoji: '🍝', desc: 'Pizza, Pasta, Risotto' },
  { name: 'North Indian', emoji: '🍛', desc: 'Curry, Naan, Biryani' },
  { name: 'South Indian', emoji: '🥚', desc: 'Dosa, Idli, Sambar' },
  { name: 'Chinese', emoji: '🥢', desc: 'Noodles, Dim Sum, Stir Fry' },
  { name: 'Mexican', emoji: '🌮', desc: 'Tacos, Burritos, Quesadillas' },
  { name: 'Thai', emoji: '🍜', desc: 'Pad Thai, Tom Yum, Green Curry' },
];

export default function CuisinePage({ onNext, onPrev, selectedCuisines, setSelectedCuisines }) {
  const [selected, setSelected] = useState(selectedCuisines || []);
  const [custom, setCustom] = useState('');
  const [customList, setCustomList] = useState([]);

  function toggleCuisine(name) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  function handleAddCustom() {
    if (custom.trim() && !customList.includes(custom.trim())) {
      setCustomList([...customList, custom.trim()]);
      setCustom('');
    }
  }

  function handleNext() {
    // Combine selected and custom cuisines
    setSelectedCuisines([...selected, ...customList]);
    onNext();
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#f9fbfd', borderRadius: 24, boxShadow: '0 2px 24px rgba(0,0,0,0.08)', padding: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, color: '#ff6600', marginBottom: 8 }}>🍽️</div>
        <h2 style={{ margin: 0, color: '#222', fontWeight: 700 }}>What cuisine do you crave?</h2>
        <div style={{ color: '#5a6a7a', marginTop: 8, marginBottom: 24 }}>
          Select all the cuisines you'd like to explore (you can choose multiple)
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginBottom: 32 }}>
        {CUISINES.map((cuisine) => (
          <div
            key={cuisine.name}
            onClick={() => toggleCuisine(cuisine.name)}
            style={{
              flex: '1 1 200px',
              minWidth: 200,
              maxWidth: 220,
              background: selected.includes(cuisine.name) ? '#e3f2fd' : '#fff',
              border: selected.includes(cuisine.name) ? '2px solid #1976d2' : '1px solid #e3eaf3',
              borderRadius: 16,
              padding: 28,
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>{cuisine.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{cuisine.name}</div>
            <div style={{ color: '#5a6a7a', fontSize: 15, marginTop: 6 }}>{cuisine.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <div style={{ fontWeight: 500, color: '#222', marginBottom: 8 }}>
          Don't see your favorite cuisine? Add it here:
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="e.g., Korean, Lebanese, Ethiopian..."
            style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
          />
          <button type="button" onClick={handleAddCustom} style={{ background: '#b3e5fc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 600, fontSize: 16 }}>
            Add
          </button>
        </div>
        {customList.length > 0 && (
          <div style={{ marginTop: 12, color: '#1976d2', fontWeight: 500 }}>
            Added: {customList.join(', ')}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
  <button type="button" onClick={onPrev} style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 16, minWidth: 120 }}>Previous</button>
  <button type="button" onClick={handleNext} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 16, minWidth: 120 }}>Next</button>
      </div>
    </div>
  );
}
