import React, { useState, useEffect } from 'react';

export default function RegisterForm({ onRegister, error, success }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLocalError('');
    setSubmitting(false);
  }, [error, success]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    setLocalError('');
    setSubmitting(true);
    onRegister(form);
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input 
          name="name" 
          placeholder="Full Name" 
          value={form.name} 
          onChange={handleChange} 
          required 
          style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }}
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Email Address" 
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
        <input 
          name="confirmPassword" 
          type="password" 
          placeholder="Confirm Password" 
          value={form.confirmPassword} 
          onChange={handleChange} 
          required 
          style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }}
        />
        {(localError || error) && <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{localError || error}</div>}
        {success && <div style={{ color: 'green', fontSize: '14px', textAlign: 'center' }}>{success}</div>}
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
          {submitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
