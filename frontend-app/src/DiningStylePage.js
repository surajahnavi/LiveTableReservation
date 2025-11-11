import React, { useState } from 'react';

const STYLES = [
  { name: 'Fast Food', desc: 'Quick service, casual dining' },
  { name: 'Casual Dining', desc: 'Relaxed atmosphere, table service' },
  { name: 'Fine Dining', desc: 'Upscale, premium experience' },
  { name: 'Buffet', desc: 'All-you-can-eat variety' },
];

export default function DiningStylePage({ onPrev, onNext }) {
  const [selected, setSelected] = useState('');

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#f9fbfd', borderRadius: 24, boxShadow: '0 2px 24px rgba(0,0,0,0.08)', padding: 40 }}>
      <div style={{ marginBottom: 24, color: '#1976d2', fontWeight: 600 }}>Step 3 of 7 <span style={{ float: 'right', color: '#5a6a7a', fontWeight: 400 }}>43% Complete</span></div>
      <div style={{ height: 6, background: '#e3eaf3', borderRadius: 3, marginBottom: 32 }}>
        <div style={{ width: '43%', height: '100%', background: '#1976d2', borderRadius: 3 }} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, color: '#00b050', marginBottom: 8 }}>🕒</div>
        <h2 style={{ margin: 0, color: '#222', fontWeight: 700 }}>What's your dining style?</h2>
        <div style={{ color: '#5a6a7a', marginTop: 8, marginBottom: 24 }}>
          Choose the type of dining experience you prefer
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32 }}>
        {STYLES.map((style) => (
          <div
            key={style.name}
            onClick={() => setSelected(style.name)}
            style={{
              background: selected === style.name ? '#e3f2fd' : '#fff',
              border: selected === style.name ? '2px solid #1976d2' : '1px solid #e3eaf3',
              borderRadius: 16,
              padding: '22px 28px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 18,
              color: '#222',
              boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              transition: 'all 0.2s',
            }}
          >
            <span style={{
              display: 'inline-block',
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: selected === style.name ? '8px solid #1976d2' : '2px solid #d1d5db',
              marginRight: 18,
              background: '#fff',
            }} />
            <span>{style.name}</span>
            <span style={{ color: '#5a6a7a', fontWeight: 400, fontSize: 15, marginLeft: 12 }}>{style.desc}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
        <button type="button" onClick={onPrev} style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 16, minWidth: 120 }}>Previous</button>
        <button type="button" onClick={onNext} style={{ background: '#8fd4ff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 16, minWidth: 120 }} disabled={!selected}>Next</button>
      </div>
    </div>
  );
}
