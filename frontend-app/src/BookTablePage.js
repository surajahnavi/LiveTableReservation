import React, { useState } from "react";

const BookTablePage = ({ restaurant, table, onBack, onConfirmBooking }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: table?.capacity || 2,
    specialRequests: '',
    customerName: '',
    customerPhone: '',
    customerEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Get today's date for minimum date selection
  const today = new Date().toISOString().split('T')[0];
  
  // Generate time slots
  const timeSlots = [
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', 
    '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call backend API to create reservation with email confirmation
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurant,
          table,
          booking: formData
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBookingConfirmed(true);
        
        // Call parent callback if provided
        if (onConfirmBooking) {
          onConfirmBooking({
            restaurant,
            booking: formData,
            confirmationId: data.reservation.confirmationId,
            emailSent: data.emailSent
          });
        }
      } else {
        alert('Failed to create reservation: ' + (data.msg || 'Unknown error'));
      }
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Failed to create reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.date && formData.time && formData.customerName && 
                     formData.customerPhone && formData.customerEmail;

  if (bookingConfirmed) {
    return (
      <div className="onboarding-container" style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#f5f6fa' 
      }}>
        <div className="onboarding-card" style={{ 
          background: '#fff', 
          borderRadius: 24, 
          boxShadow: '0 4px 32px rgba(80,120,200,0.08)', 
          padding: '48px 32px', 
          maxWidth: 600, 
          width: '100%', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
          <h2 style={{ 
            fontWeight: 700, 
            fontSize: 32, 
            color: '#4caf50', 
            marginBottom: 16 
          }}>
            Booking Confirmed!
          </h2>
          
          <div style={{ 
            background: '#f8f9fa', 
            padding: 24, 
            borderRadius: 12, 
            marginBottom: 32,
            textAlign: 'left'
          }}>
            <h3 style={{ marginBottom: 16, color: '#333' }}>Reservation Details</h3>
            <div style={{ marginBottom: 8 }}><strong>Restaurant:</strong> {restaurant.name}</div>
            {table && (
              <>
                <div style={{ marginBottom: 8 }}><strong>Table:</strong> {table.number} ({table.location})</div>
                <div style={{ marginBottom: 8 }}><strong>Table Capacity:</strong> {table.capacity} people</div>
                {table.price > 0 && (
                  <div style={{ marginBottom: 8 }}><strong>Premium Charge:</strong> ${table.price}</div>
                )}
              </>
            )}
            <div style={{ marginBottom: 8 }}><strong>Date:</strong> {formData.date}</div>
            <div style={{ marginBottom: 8 }}><strong>Time:</strong> {formData.time}</div>
            <div style={{ marginBottom: 8 }}><strong>Guests:</strong> {formData.guests} people</div>
            <div style={{ marginBottom: 8 }}><strong>Name:</strong> {formData.customerName}</div>
            <div style={{ marginBottom: 8 }}><strong>Phone:</strong> {formData.customerPhone}</div>
            <div style={{ marginBottom: 16 }}><strong>Email:</strong> {formData.customerEmail}</div>
            {formData.specialRequests && (
              <div><strong>Special Requests:</strong> {formData.specialRequests}</div>
            )}
          </div>

          <p style={{ color: '#666', marginBottom: 32, fontSize: 16 }}>
            A confirmation email has been sent to {formData.customerEmail}. 
            Please arrive 10 minutes before your reservation time.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button 
              onClick={() => onBack && onBack()}
              style={{
                background: '#fff',
                border: '2px solid #1976d2',
                color: '#1976d2',
                padding: '12px 24px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Back to Restaurants
            </button>
            
            <button 
              onClick={() => {
                const phone = restaurant.phone?.replace(/[^\d]/g, '');
                if (phone) {
                  window.open(`tel:${phone}`, '_self');
                }
              }}
              style={{
                background: '#4caf50',
                border: 'none',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📞 Call Restaurant
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container" style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f5f6fa' 
    }}>
      <div className="onboarding-card" style={{ 
        background: '#fff', 
        borderRadius: 24, 
        boxShadow: '0 4px 32px rgba(80,120,200,0.08)', 
        padding: '48px 32px', 
        maxWidth: 700, 
        width: '100%', 
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <button 
            onClick={() => onBack && onBack()}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#1976d2',
              fontSize: 24,
              cursor: 'pointer',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            ← Back
          </button>
          
          <h2 style={{ 
            fontWeight: 700, 
            fontSize: 28, 
            color: '#222', 
            marginBottom: 8 
          }}>
            Book a Table
          </h2>
          
          <div style={{
            background: '#e3f2fd',
            padding: 16,
            borderRadius: 12,
            marginBottom: 16
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: 20, 
              color: '#1565c0', 
              marginBottom: 8 
            }}>
              {restaurant.name}
            </h3>
            <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
              📍 {restaurant.vicinity}
            </div>
            {restaurant.phone && (
              <div style={{ color: '#666', fontSize: 14 }}>
                📞 {restaurant.phone}
              </div>
            )}
            {restaurant.rating && (
              <div style={{ marginTop: 8 }}>
                <span style={{ color: '#ff9800' }}>★</span>
                <span style={{ fontWeight: 600, marginLeft: 4 }}>{restaurant.rating}</span>
                <span style={{ color: '#666', marginLeft: 4 }}>
                  ({restaurant.user_ratings_total} reviews)
                </span>
              </div>
            )}
            {table && (
              <div style={{
                marginTop: 16,
                padding: 12,
                background: '#f0f8ff',
                borderRadius: 8,
                border: '2px solid #1976d2'
              }}>
                <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 4 }}>
                  Selected Table: {table.number}
                </div>
                <div style={{ fontSize: 14, color: '#333' }}>
                  📍 {table.location} • 👥 {table.capacity} people capacity
                  {table.price > 0 && <span> • 💰 Premium: ${table.price}</span>}
                </div>
                {table.features && table.features.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Features:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {table.features.map((feature, index) => (
                        <span
                          key={index}
                          style={{
                            background: '#e3f2fd',
                            color: '#1565c0',
                            padding: '2px 6px',
                            borderRadius: 8,
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
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit}>
          {/* Date and Time Selection */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 16, 
            marginBottom: 24 
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontWeight: 600, 
                marginBottom: 8, 
                color: '#333' 
              }}>
                Select Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={today}
                required
                style={{
                  width: '100%',
                  padding: 12,
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 16,
                  background: '#fff'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontWeight: 600, 
                marginBottom: 8, 
                color: '#333' 
              }}>
                Select Time *
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: 12,
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 16,
                  background: '#fff'
                }}
              >
                <option value="">Choose time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Number of Guests */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginBottom: 8, 
              color: '#333' 
            }}>
              Number of Guests
            </label>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: 12,
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                fontSize: 16,
                background: '#fff'
              }}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Information */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: 24, 
            borderRadius: 12, 
            marginBottom: 24 
          }}>
            <h3 style={{ marginBottom: 16, color: '#333' }}>Contact Information</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 600, 
                marginBottom: 8, 
                color: '#333' 
              }}>
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: 12,
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 16,
                  background: '#fff'
                }}
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 16, 
              marginBottom: 16 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 600, 
                  marginBottom: 8, 
                  color: '#333' 
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  placeholder="+1 (555) 123-4567"
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    background: '#fff'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 600, 
                  marginBottom: 8, 
                  color: '#333' 
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: 16,
                    background: '#fff'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontWeight: 600, 
                marginBottom: 8, 
                color: '#333' 
              }}>
                Special Requests (Optional)
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Allergies, dietary restrictions, celebration, etc."
                rows={3}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '2px solid #e0e0e0',
                  borderRadius: 8,
                  fontSize: 16,
                  background: '#fff',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            style={{
              width: '100%',
              background: isFormValid ? '#4caf50' : '#ccc',
              border: 'none',
              color: '#fff',
              padding: '16px 24px',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.3s ease'
            }}
          >
            {isSubmitting ? (
              <>
                <span>🔄</span>
                Confirming Reservation...
              </>
            ) : (
              <>
                <span>🍽️</span>
                Confirm Reservation
              </>
            )}
          </button>

          <p style={{ 
            textAlign: 'center', 
            color: '#666', 
            fontSize: 14, 
            marginTop: 16 
          }}>
            By booking, you agree to arrive on time and follow the restaurant's policies.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookTablePage;