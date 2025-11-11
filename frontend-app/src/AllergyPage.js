import React, { useState } from 'react';

const ALLERGIES = [
  'Nuts', 'Dairy', 'Gluten', 'Shellfish',
  'Eggs', 'Soy', 'Fish', 'Sesame'
];

export default function AllergyPage({ onPrev, onNext }) {
  const [selected, setSelected] = useState([]);
  const [other, setOther] = useState('');

  function toggleAllergy(name) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#f9fbfd', borderRadius: 24, boxShadow: '0 2px 24px rgba(0,0,0,0.08)', padding: 40 }}>
      <div style={{ marginBottom: 24, color: '#1976d2', fontWeight: 600 }}>Step 5 of 7 <span style={{ float: 'right', color: '#5a6a7a', fontWeight: 400 }}>71% Complete</span></div>
      <div style={{ height: 6, background: '#e3eaf3', borderRadius: 3, marginBottom: 32 }}>
        <div style={{ width: '71%', height: '100%', background: '#1976d2', borderRadius: 3 }} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, color: '#ff9900', marginBottom: 8 }}>⚠️</div>
        <h2 style={{ margin: 0, color: '#222', fontWeight: 700 }}>Any food allergies?</h2>
        <div style={{ color: '#5a6a7a', marginTop: 8, marginBottom: 24 }}>
          Select any allergies or dietary restrictions we should know about
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 24 }}>
        {ALLERGIES.map((allergy) => (
          <label key={allergy} style={{ flex: '1 1 120px', minWidth: 120, maxWidth: 160, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, color: '#222', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selected.includes(allergy)}
              onChange={() => toggleAllergy(allergy)}
              style={{ accentColor: '#1976d2', width: 18, height: 18 }}
            />
            {allergy}
          </label>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 500, color: '#222', marginBottom: 8 }}>
          Other allergies or dietary restrictions:
        </div>
        <input
          type="text"
          value={other}
          onChange={e => setOther(e.target.value)}
          placeholder="e.g., Vegetarian, Vegan, Keto..."
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
        <button type="button" onClick={onPrev} style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 16, minWidth: 120 }}>Previous</button>
        <button type="button" onClick={onNext} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 16, minWidth: 120 }}>Next</button>
      </div>
    </div>
  );
}
