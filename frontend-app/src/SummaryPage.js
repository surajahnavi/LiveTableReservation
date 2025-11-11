import React from "react";

const SummaryPage = ({ cuisines, diningStyle, spiceLevel, allergies, partyDetails, onFindRestaurant }) => {
  
  const handleFindClick = () => {
    console.log('✅ "Yes, use my preferences" clicked - navigating to nearby restaurants');
    console.log('🔍 onFindRestaurant function type:', typeof onFindRestaurant);
    console.log('📦 Props received:', { cuisines, diningStyle, spiceLevel, allergies, partyDetails });
    
    if (typeof onFindRestaurant === 'function') {
      console.log('🚀 Calling onFindRestaurant...');
      onFindRestaurant();
      console.log('✅ onFindRestaurant called successfully');
    } else {
      console.error('❌ onFindRestaurant is not a function!');
    }
  };

  return (
    <div className="onboarding-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <div className="onboarding-card" style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 32px rgba(80,120,200,0.08)', padding: '48px 32px', maxWidth: 520, width: '100%', margin: '0 auto' }}>
        <div className="onboarding-step-label" style={{ color: '#222', fontWeight: 500, fontSize: 18, marginBottom: 8 }}>Step 7 of 7</div>
        <div className="onboarding-progress-bar" style={{ background: '#e6eaf3', borderRadius: 8, height: 7, width: '100%', marginBottom: 24 }}>
          <div className="onboarding-progress" style={{ width: "100%", background: 'linear-gradient(90deg, #4f8cff 0%, #009be5 100%)', height: 7, borderRadius: 8 }}></div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #009be5 0%, #4f8cff 100%)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '32px auto 0', boxShadow: '0 2px 8px rgba(80,120,200,0.10)' }}>
          <svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="18" fill="#fff"/><path d="M18 9c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16.2A7.2 7.2 0 1 1 18 10.8a7.2 7.2 0 0 1 0 14.4z" fill="#009be5"/><circle cx="18" cy="18" r="3.6" fill="#009be5"/></svg>
        </div>
        <h2 className="onboarding-title" style={{ marginTop: 24, fontWeight: 700, fontSize: 28, color: '#222' }}>Perfect! Your preferences are ready</h2>
        <div className="onboarding-subtitle" style={{ color: '#5a6a7a', fontSize: 18, marginBottom: 24 }}>Would you like to find restaurants based on these preferences?</div>
        <div style={{ background: '#f5f6fa', borderRadius: 16, padding: '24px 20px', margin: '0 auto 32px auto', maxWidth: 420 }}>
          <div style={{ fontWeight: 600, color: '#222', fontSize: 18, marginBottom: 10 }}>Your Preferences Summary:</div>
          <div style={{ color: '#222', fontSize: 16, marginBottom: 6 }}>
            <span style={{ fontWeight: 500 }}>Cuisines:</span>
            {cuisines && cuisines.length > 0 ? (
              cuisines.map((c, idx) => (
                <span key={c} style={{ background: '#e6eaf3', color: '#1976d2', borderRadius: 8, padding: '2px 12px', fontWeight: 600, marginLeft: 8, marginRight: 4, fontSize: 15 }}>
                  {c}
                </span>
              ))
            ) : (
              <span style={{ marginLeft: 8, color: '#888' }}>None</span>
            )}
          </div>
          <div style={{ color: '#222', fontSize: 16, marginBottom: 6 }}>
            <span style={{ fontWeight: 500 }}>Style:</span> {diningStyle}
          </div>
          <div style={{ color: '#222', fontSize: 16, marginBottom: 6 }}>
            <span style={{ fontWeight: 500 }}>Spice Level:</span> {spiceLevel}
          </div>
          <div style={{ color: '#222', fontSize: 16, marginBottom: 6 }}>
            <span style={{ fontWeight: 500 }}>Allergies:</span> {allergies && allergies.length > 0 ? allergies.join(', ') : 'None'}
          </div>
          <div style={{ color: '#222', fontSize: 16, marginBottom: 6 }}>
            <span style={{ fontWeight: 500 }}>Party Size:</span> {partyDetails?.people} {partyDetails?.people === 1 ? 'person' : 'people'}
          </div>
          <div style={{ color: '#222', fontSize: 16 }}>
            <span style={{ fontWeight: 500 }}>Preferred Dining Time:</span> {partyDetails?.diningTime ? partyDetails.diningTime : '--:--'}
          </div>
        </div>
        <button className="onboarding-btn onboarding-btn-primary" style={{ background: '#009be5', color: '#fff', border: 'none', borderRadius: 8, padding: '16px 0', fontWeight: 600, fontSize: 19, width: '100%', marginTop: 8, boxShadow: '0 1px 4px rgba(80,120,200,0.08)' }} onClick={handleFindClick}>
          ✅ Yes, use my preferences
        </button>
        <button style={{ background: '#fff', color: '#666', border: '2px solid #e1e5e9', borderRadius: 8, padding: '14px 0', fontWeight: 600, fontSize: 17, width: '100%', marginTop: 12, cursor: 'pointer' }} onClick={() => window.location.reload()}>
          🔄 Start over with different preferences
        </button>
      </div>
    </div>
  );
};

export default SummaryPage;
