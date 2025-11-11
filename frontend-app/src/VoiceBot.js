import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Floating VoiceBot Widget Styles
const VoiceBotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  transition: all 0.3s ease;
`;

const VoiceBotCard = styled.div`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-radius: ${props => props.isExpanded ? '20px' : '50%'};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  width: ${props => props.isExpanded ? '400px' : '70px'};
  height: ${props => props.isExpanded ? '500px' : '70px'};
  padding: ${props => props.isExpanded ? '20px' : '0'};
`;

const VoiceBotTitle = styled.h2`
  color: white;
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: ${props => props.isExpanded ? 'block' : 'none'};
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
  100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
`;

const successGlow = keyframes`
  0% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
  50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.8); }
  100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
`;

const VoiceBotButton = styled.button`
  background: ${props => 
    props.isSuccess 
      ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
      : props.isListening 
        ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
        : 'linear-gradient(135deg, #3b82f6, #2563eb)'};
  border: none;
  border-radius: 50%;
  width: ${props => props.isExpanded ? '60px' : '70px'};
  height: ${props => props.isExpanded ? '60px' : '70px'};
  color: white;
  font-size: ${props => props.isExpanded ? '1.5rem' : '2rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${props => props.isExpanded ? '0 auto 15px auto' : '0'};
  animation: ${props => 
    props.isSuccess 
      ? successGlow 
      : props.isListening 
        ? pulse 
        : glow} 2s infinite;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const TranscriptDisplay = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 15px;
  margin: 10px 0;
  min-height: 120px;
  max-height: 200px;
  overflow-y: auto;
  color: white;
  font-size: 0.9rem;
  line-height: 1.4;
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: ${props => props.isExpanded ? 'block' : 'none'};
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.5);
    border-radius: 2px;
  }
`;

const StatusText = styled.p`
  color: ${props => props.isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.7)'};
  margin: 10px 0;
  font-weight: 500;
  font-size: 0.85rem;
  text-align: center;
  display: ${props => props.isExpanded ? 'block' : 'none'};
`;

const ControlsContainer = styled.div`
  display: ${props => props.isExpanded ? 'flex' : 'none'};
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(59, 130, 246, 0.3);
    border-color: rgba(59, 130, 246, 0.6);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const VoiceBot = ({ onRestaurantFound, restaurants = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [recognition, setRecognition] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      
      // Enhanced configuration
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false; // Only final results
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 3;

      recognitionInstance.onstart = () => {
        console.log('🎤 Restaurant voice search started');
        setIsListening(true);
        setError(null);
      };
      
      recognitionInstance.onend = () => {
        console.log('🎤 Restaurant voice search ended');
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('🎤 Restaurant voice search error:', event.error);
        setIsListening(false);
        let errorMsg = 'Voice search failed. ';
        switch(event.error) {
          case 'no-speech':
            errorMsg += 'No speech detected. Speak louder.';
            break;
          case 'audio-capture':
            errorMsg += 'Microphone not available.';
            break;
          case 'not-allowed':
            errorMsg += 'Microphone access denied.';
            break;
          default:
            errorMsg += 'Try speaking again.';
        }
        setError(errorMsg);
      };

      recognitionInstance.onresult = (event) => {
        console.log('🎤 Restaurant search result:', event);
        
        let finalTranscript = '';
        let alternatives = [];
        
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript = result[0].transcript.trim();
            
            for (let j = 0; j < result.length; j++) {
              if (result[j].transcript.trim()) {
                alternatives.push(result[j].transcript.trim());
              }
            }
          }
        }
        
        console.log('🎤 Restaurant search transcript:', finalTranscript);
        console.log('🎤 Restaurant search alternatives:', alternatives);
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processVoiceCommand(finalTranscript, alternatives);
        } else if (alternatives.length > 0) {
          setTranscript(alternatives[0]);
          processVoiceCommand(alternatives[0], alternatives);
        }
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Process voice command to find restaurants with enhanced accuracy
  const processVoiceCommand = (command, alternatives = []) => {
    const allCommands = [command, ...alternatives].map(c => c.toLowerCase().trim());
    console.log('🎤 Processing restaurant search commands:', allCommands);
    
    setIsProcessing(true);
    setResponse('Searching for restaurants...');

    // Enhanced restaurant name matching
    setTimeout(() => {
      let foundRestaurants = [];
      
      // Try multiple search strategies for better accuracy
      for (const cmd of allCommands) {
        console.log('🎤 Searching with command:', cmd);
        
        // Strategy 1: Direct name matching
        const directMatches = restaurants.filter(restaurant => {
          const restaurantName = restaurant.name.toLowerCase();
          return restaurantName.includes(cmd) || cmd.includes(restaurantName);
        });
        
        // Strategy 2: Word-by-word matching
        const words = cmd.split(' ').filter(word => word.length > 2); // Filter out short words
        const wordMatches = restaurants.filter(restaurant => {
          const restaurantWords = restaurant.name.toLowerCase().split(' ');
          return words.some(word => 
            restaurantWords.some(rWord => 
              rWord.includes(word) || word.includes(rWord)
            )
          );
        });
        
        // Strategy 3: Partial name matching (for cases like "TAJ" matching "Hotel TAJ")
        const partialMatches = restaurants.filter(restaurant => {
          const restaurantName = restaurant.name.toLowerCase();
          return words.some(word => restaurantName.includes(word) && word.length > 2);
        });
        
        // Combine all matches
        foundRestaurants = [...new Set([...directMatches, ...wordMatches, ...partialMatches])];
        
        if (foundRestaurants.length > 0) {
          console.log('✅ Found restaurants:', foundRestaurants.map(r => r.name));
          break;
        }
      }
      
      setIsProcessing(false);
      
      if (foundRestaurants.length > 0) {
        const restaurant = foundRestaurants[0]; // Take the first match
        setIsSuccess(true);
        setResponse(`✅ Found ${restaurant.name}! Highlighted below. Click to book a table.`);
        
        // Notify parent component
        if (onRestaurantFound) {
          onRestaurantFound(restaurant);
        }
        
        // Reset success state after 4 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setResponse('');
        }, 4000);
      } else {
        // Enhanced fallback with suggestions
        console.log('❌ No restaurants found for commands:', allCommands);
        
        // Try to give helpful suggestions
        const availableNames = restaurants.slice(0, 5).map(r => r.name).join(', ');
        
        if (allCommands.some(cmd => cmd.includes('book') || cmd.includes('reserve') || cmd.includes('table'))) {
          setResponse(`❓ Restaurant not found in "${command}". Available: ${availableNames}. Try saying the exact name.`);
        } else {
          setResponse('🎤 Try saying "Book a table at [restaurant name]". Say the exact restaurant name clearly.');
        }
      }
    }, 1000);
  };

  // Toggle voice listening with better feedback
  const toggleListening = () => {
    if (!recognition) {
      setError('Voice recognition not available. Use Chrome or Edge browser.');
      return;
    }
    
    if (isListening) {
      console.log('🛑 Stopping restaurant voice search');
      recognition.stop();
      setResponse('Voice search stopped.');
    } else {
      console.log('▶️ Starting restaurant voice search');
      setTranscript('');
      setResponse('🎤 Listening... Say "Book a table at [restaurant name]"');
      setError(null);
      
      try {
        recognition.start();
      } catch (err) {
        console.error('Error starting restaurant search:', err);
        setError('Failed to start voice search. Please try again.');
      }
    }
  };

  // Toggle widget expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Close widget
  const closeWidget = () => {
    setIsExpanded(false);
    setTranscript('');
    setResponse('');
    setError(null);
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const displayText = error || response || transcript || 
    (isExpanded ? 'Click the microphone and speak your request...' : '');

  return (
    <VoiceBotContainer>
      <VoiceBotCard isExpanded={isExpanded}>
        {isExpanded && (
          <>
            <CloseButton onClick={closeWidget}>×</CloseButton>
            <VoiceBotTitle isExpanded={isExpanded}>
              🎤 Voice Search
            </VoiceBotTitle>
          </>
        )}
        
        <VoiceBotButton 
          onClick={isExpanded ? toggleListening : toggleExpansion}
          isListening={isListening}
          isExpanded={isExpanded}
          isSuccess={isSuccess}
          disabled={isProcessing}
        >
          {isProcessing ? '⏳' : isSuccess ? '✅' : isListening ? '🔴' : '🎤'}
        </VoiceBotButton>

        {isExpanded && (
          <>
            <StatusText isListening={isListening} isExpanded={isExpanded}>
              {isProcessing ? 'Processing...' :
               isListening ? 'Listening... Speak now!' : 
               'Click microphone to speak'}
            </StatusText>

            <TranscriptDisplay isExpanded={isExpanded}>
              {displayText}
            </TranscriptDisplay>

            <ControlsContainer isExpanded={isExpanded}>
              <ActionButton onClick={() => setResponse('Say something like: "Book a table at Hotel TAJ" or "Find Pizza World restaurant"')}>
                Voice Commands Help
              </ActionButton>
            </ControlsContainer>

            <div style={{ 
              color: 'rgba(255,255,255,0.6)', 
              fontSize: '0.75rem', 
              marginTop: '15px',
              textAlign: 'left',
              lineHeight: '1.3'
            }}>
              <strong>🎯 Try saying:</strong><br />
              • "Book a table at Hotel TAJ"<br />
              • "Find Pizza World restaurant"<br />
              • "Reserve at Hotel Nagasai"<br />
              • "Show me Italian restaurants"<br />
            </div>
          </>
        )}
      </VoiceBotCard>
    </VoiceBotContainer>
  );
};

export default VoiceBot;