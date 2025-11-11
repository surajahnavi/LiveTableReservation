import React, { useState } from "react";

const PartyDetailsPage = ({ onPrevious, onNext, partyDetails, setPartyDetails }) => {
  const [people, setPeople] = useState(partyDetails?.people || 2);
  const [diningTime, setDiningTime] = useState(partyDetails?.diningTime || "");

  const handlePeopleChange = (e) => {
    setPeople(Number(e.target.value));
    setPartyDetails({ ...partyDetails, people: Number(e.target.value), diningTime });
  };

  const handleTimeChange = (e) => {
    setDiningTime(e.target.value);
    setPartyDetails({ ...partyDetails, people, diningTime: e.target.value });
  };

  const handleNext = () => {
    setPartyDetails({ ...partyDetails, people, diningTime });
    onNext();
  };

  return (
    <div className="onboarding-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <div className="onboarding-card" style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 32px rgba(80,120,200,0.08)', padding: '48px 32px', maxWidth: 520, width: '100%', margin: '0 auto' }}>
        <div className="onboarding-step-label" style={{ color: '#222', fontWeight: 500, fontSize: 18, marginBottom: 8 }}>Step 6 of 7</div>
        <div className="onboarding-progress-bar" style={{ background: '#e6eaf3', borderRadius: 8, height: 7, width: '100%', marginBottom: 24 }}>
          <div className="onboarding-progress" style={{ width: "86%", background: 'linear-gradient(90deg, #4f8cff 0%, #009be5 100%)', height: 7, borderRadius: 8 }}></div>
        </div>
  <div className="onboarding-icon" style={{ background: "linear-gradient(135deg, #4f8cff 0%, #a259ff 100%)", width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "32px auto 0", boxShadow: '0 2px 8px rgba(80,120,200,0.10)' }}>
          <svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="url(#paint0_linear)"/><path d="M18 18c2.485 0 4.5-2.015 4.5-4.5S20.485 9 18 9s-4.5 2.015-4.5 4.5S15.515 18 18 18zm0 2.25c-3.037 0-9 1.522-9 4.5V27h18v-2.25c0-2.978-5.963-4.5-9-4.5z" fill="#fff"/></svg>
        </div>
  <h2 className="onboarding-title" style={{ marginTop: 24, fontWeight: 700, fontSize: 30, color: '#222' }}>Party details</h2>
  <div className="onboarding-subtitle" style={{ color: '#5a6a7a', fontSize: 18, marginBottom: 8 }}>Tell us about your dining party and preferences</div>
        <div className="onboarding-form-group" style={{ marginTop: 32 }}>
          <label className="onboarding-label" htmlFor="people-slider" style={{ fontWeight: 500, color: '#222', fontSize: 17 }}>How many people? <span style={{ color: '#1976d2', fontWeight: 600 }}>({people} {people === 1 ? 'person' : 'people'})</span></label>
          <input
            id="people-slider"
            type="range"
            min="1"
            max="20"
            value={people}
            onChange={handlePeopleChange}
            className="onboarding-slider"
            style={{ width: '100%', marginTop: 8, accentColor: '#009be5' }}
          />
        </div>
        <div className="onboarding-form-group" style={{ marginTop: 24 }}>
          <label className="onboarding-label" htmlFor="dining-time" style={{ fontWeight: 500, color: '#222', fontSize: 17 }}>Preferred dining time:</label>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <input
              id="dining-time"
              type="time"
              value={diningTime}
              onChange={handleTimeChange}
              className="onboarding-time-input"
              style={{ fontSize: 18, padding: '8px 12px', borderRadius: 8, border: '1px solid #e0e0e0', width: 140, background: '#f8fafc' }}
            />
            <span style={{ marginLeft: 12, color: '#aaa', fontSize: 22 }}>
              <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" fill="#f5f6fa"/><path d="M11 6v5l3 3" stroke="#4f8cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
        </div>
        <div className="onboarding-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
          <button className="onboarding-btn onboarding-btn-secondary" style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 17, boxShadow: '0 1px 4px rgba(80,120,200,0.04)' }} onClick={onPrevious}>Previous</button>
          <button className="onboarding-btn onboarding-btn-primary" style={{ background: '#009be5', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 17, boxShadow: '0 1px 4px rgba(80,120,200,0.08)' }} onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default PartyDetailsPage;
