import React, { useState } from 'react';

const TableSelectionPage = ({ restaurant, partySize = 2, onBack, onTableSelect }) => {
  const [selectedTable, setSelectedTable] = useState(null);

  // Generate tables based on party size
  const generateTables = (partySize) => {
    const tables = [];
    const baseTableCount = Math.min(8, Math.max(4, partySize + 2)); // 4-8 tables depending on party size
    
    for (let i = 1; i <= baseTableCount; i++) {
      const isAvailable = Math.random() > 0.3; // 70% chance of availability
      const capacity = partySize <= 2 ? [2, 4][Math.floor(Math.random() * 2)] :
                      partySize <= 4 ? [4, 6][Math.floor(Math.random() * 2)] :
                      partySize <= 6 ? [6, 8][Math.floor(Math.random() * 2)] :
                      [8, 10, 12][Math.floor(Math.random() * 3)];
      
      // Only show tables that can accommodate the party size
      if (capacity >= partySize) {
        tables.push({
          id: i,
          number: `T${i.toString().padStart(2, '0')}`,
          capacity: capacity,
          location: ['Window', 'Garden View', 'Private Corner', 'Main Hall', 'Terrace'][Math.floor(Math.random() * 5)],
          features: getRandomFeatures(),
          isAvailable: isAvailable,
          price: capacity <= 4 ? 0 : capacity <= 6 ? 25 : 50 // Premium charges for larger tables
        });
      }
    }
    
    return tables.sort((a, b) => a.number.localeCompare(b.number));
  };

  const getRandomFeatures = () => {
    const allFeatures = ['WiFi', 'Power Outlet', 'Quiet Zone', 'Family Friendly', 'High Chair Available', 'Wheelchair Accessible'];
    const featureCount = Math.floor(Math.random() * 3) + 1; // 1-3 features
    const features = [];
    
    for (let i = 0; i < featureCount; i++) {
      const feature = allFeatures[Math.floor(Math.random() * allFeatures.length)];
      if (!features.includes(feature)) {
        features.push(feature);
      }
    }
    
    return features;
  };

  const tables = generateTables(partySize);
  const availableTables = tables.filter(table => table.isAvailable);

  const handleTableClick = (table) => {
    if (table.isAvailable) {
      setSelectedTable(table);
    }
  };

  const handleNext = () => {
    if (selectedTable && onTableSelect) {
      onTableSelect(selectedTable);
    }
  };

  return (
    <div className="onboarding-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <div className="onboarding-card" style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 32px rgba(80,120,200,0.08)', padding: '48px 32px', maxWidth: 800, width: '100%', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ color: '#1a202c', fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
            Select Your Table
          </h2>
          <div style={{ background: '#e8f4fd', padding: 16, borderRadius: 12, marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#1976d2', marginBottom: 4 }}>
              {restaurant.name}
            </div>
            <div style={{ color: '#666', fontSize: 14 }}>
              {restaurant.vicinity}
            </div>
            <div style={{ color: '#1976d2', fontSize: 16, marginTop: 8 }}>
              Party Size: {partySize} {partySize === 1 ? 'person' : 'people'}
            </div>
          </div>
        </div>

        {/* Available Tables Count */}
        <div style={{ background: '#e8f5e8', padding: 12, borderRadius: 8, marginBottom: 24, textAlign: 'center' }}>
          ✅ {availableTables.length} tables available for your party size
        </div>

        {/* Table Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={() => handleTableClick(table)}
              style={{
                border: `2px solid ${selectedTable?.id === table.id ? '#1976d2' : table.isAvailable ? '#e1e5e9' : '#ffcdd2'}`,
                borderRadius: 12,
                padding: 16,
                background: table.isAvailable ? (selectedTable?.id === table.id ? '#f0f8ff' : '#fff') : '#f5f5f5',
                cursor: table.isAvailable ? 'pointer' : 'not-allowed',
                opacity: table.isAvailable ? 1 : 0.6,
                transition: 'all 0.2s ease',
                transform: selectedTable?.id === table.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedTable?.id === table.id ? '0 4px 20px rgba(25, 118, 210, 0.15)' : '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              {/* Table Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: table.isAvailable ? '#1a202c' : '#666' }}>
                  Table {table.number}
                </div>
                <div style={{
                  background: table.isAvailable ? '#e8f5e8' : '#ffebee',
                  color: table.isAvailable ? '#2e7d32' : '#c62828',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {table.isAvailable ? 'Available' : 'Occupied'}
                </div>
              </div>

              {/* Table Details */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#666' }}>Capacity:</span>
                  <span style={{ fontWeight: 600 }}>{table.capacity} people</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#666' }}>Location:</span>
                  <span style={{ fontWeight: 600 }}>{table.location}</span>
                </div>
                {table.price > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: '#666' }}>Premium:</span>
                    <span style={{ fontWeight: 600, color: '#f57c00' }}>${table.price}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              {table.features.length > 0 && (
                <div>
                  <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>Features:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {table.features.map((feature, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#e3f2fd',
                          color: '#1565c0',
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 10,
                          fontWeight: 500
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Indicator */}
              {selectedTable?.id === table.id && (
                <div style={{
                  marginTop: 12,
                  padding: 8,
                  background: '#e8f5e8',
                  borderRadius: 6,
                  textAlign: 'center',
                  color: '#2e7d32',
                  fontWeight: 600,
                  fontSize: 14
                }}>
                  ✓ Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Available Tables Message */}
        {availableTables.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 32,
            background: '#fff3cd',
            borderRadius: 12,
            border: '1px solid #ffc107',
            marginBottom: 24
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#856404', marginBottom: 8 }}>
              No tables available for your party size
            </div>
            <div style={{ color: '#856404' }}>
              Please try a different time or contact the restaurant directly
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32 }}>
          <button 
            onClick={onBack}
            style={{
              background: '#fff',
              border: '2px solid #1976d2',
              color: '#1976d2',
              padding: '12px 32px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Back to Restaurants
          </button>
          
          {selectedTable && (
            <button 
              onClick={handleNext}
              style={{
                background: '#1976d2',
                border: 'none',
                color: '#fff',
                padding: '12px 32px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}
            >
              Next - Enter Details
            </button>
          )}
        </div>

        {/* Selection Info */}
        {selectedTable && (
          <div style={{
            marginTop: 24,
            padding: 16,
            background: '#f0f8ff',
            borderRadius: 12,
            border: '2px solid #1976d2'
          }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#1976d2', marginBottom: 8 }}>
              Selected Table Details:
            </div>
            <div style={{ color: '#333' }}>
              <strong>Table {selectedTable.number}</strong> • {selectedTable.capacity} people capacity • {selectedTable.location}
              {selectedTable.price > 0 && <span> • Premium: ${selectedTable.price}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSelectionPage;