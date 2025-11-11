import React, { useState } from 'react';

export default function LoginForm({ onLogin, onShowRegister, error }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await onLogin(form);
    setSubmitting(false);
  }

  return (
    <div style={{ maxWidth: 350, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Sign In</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={form.password} 
          onChange={handleChange} 
          required 
          style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }}
        />
        {error && <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
        <button 
          type="submit" 
          disabled={submitting}
          style={{ 
            padding: '12px', 
            background: submitting ? '#ccc' : '#1976d2', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '16px', 
            fontWeight: '600',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Signing In...' : 'Login'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <span>Don't have an account? </span>
        <button style={{ background: 'none', color: '#1976d2', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }} onClick={onShowRegister}>Register</button>
      </div>
    </div>
  );
}
