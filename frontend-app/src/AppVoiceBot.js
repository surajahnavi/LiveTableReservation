import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// Global VoiceBot for App-wide functionality
const VoiceBotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  transition: all 0.3s ease;
`;

const VoiceBotCard = styled.div`
  background: rgba(20, 184, 166, 0.95);
  backdrop-filter: blur(20px);
  border-radius: ${props => props.isExpanded ? '20px' : '50%'};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(20, 184, 166, 0.4);
  transition: all 0.3s ease;
  overflow: hidden;
  width: ${props => props.isExpanded ? '350px' : '60px'};
  height: ${props => props.isExpanded ? '400px' : '60px'};
  padding: ${props => props.isExpanded ? '20px' : '0'};
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 15px rgba(20, 184, 166, 0.4); }
  50% { box-shadow: 0 0 25px rgba(20, 184, 166, 0.7); }
  100% { box-shadow: 0 0 15px rgba(20, 184, 166, 0.4); }
`;

const VoiceBotButton = styled.button`
  background: ${props => 
    props.isListening 
      ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
      : 'linear-gradient(135deg, #14b8a6, #0d9488)'};
  border: none;
  border-radius: 50%;
  width: ${props => props.isExpanded ? '50px' : '60px'};
  height: ${props => props.isExpanded ? '50px' : '60px'};
  color: white;
  font-size: ${props => props.isExpanded ? '1.2rem' : '1.5rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${props => props.isExpanded ? '0 auto 15px auto' : '0'};
  animation: ${props => props.isListening ? pulse : glow} 2s infinite;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const TranscriptDisplay = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 12px;
  margin: 10px 0;
  min-height: 100px;
  max-height: 150px;
  overflow-y: auto;
  color: white;
  font-size: 0.85rem;
  line-height: 1.4;
  border: 1px solid rgba(20, 184, 166, 0.3);
  display: ${props => props.isExpanded ? 'block' : 'none'};
`;

const StatusText = styled.p`
  color: ${props => props.isListening ? '#ef4444' : 'rgba(255, 255, 255, 0.8)'};
  margin: 8px 0;
  font-weight: 500;
  font-size: 0.8rem;
  text-align: center;
  display: ${props => props.isExpanded ? 'block' : 'none'};
`;

const QuickActionsContainer = styled.div`
  display: ${props => props.isExpanded ? 'flex' : 'none'};
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const QuickActionButton = styled.button`
  background: rgba(20, 184, 166, 0.2);
  border: 1px solid rgba(20, 184, 166, 0.4);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(20, 184, 166, 0.3);
    border-color: rgba(20, 184, 166, 0.6);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const AppVoiceBot = ({ 
  onNavigate, 
  currentPage, 
  currentUser,
  restaurants = [] 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [recognition, setRecognition] = useState(null);

  // Process voice commands for app navigation with improved accuracy
  const processVoiceCommand = useCallback((command, alternatives = []) => {
    const allCommands = [command, ...alternatives].map(c => c.toLowerCase().trim());
    console.log('🎤 Processing voice commands:', allCommands);
    
    setResponse('Processing your command...');
    
    setTimeout(() => {
      let matched = false;
      
      // Check all command variations for better accuracy
      for (const cmd of allCommands) {
        console.log('🎤 Checking command:', cmd);
        
        // Login/Sign-in commands (multiple variations)
        if (cmd.includes('login') || cmd.includes('sign in') || cmd.includes('signin') || 
            cmd.includes('log in') || cmd === 'login' || cmd === 'sign in') {
          console.log('✅ LOGIN command detected');
          setResponse('✅ Going to login page...');
          setTimeout(() => onNavigate('login'), 1500);
          matched = true;
          break;
        }
        
        // Register/Sign-up commands
        if (cmd.includes('register') || cmd.includes('sign up') || cmd.includes('signup') || 
            cmd.includes('create account') || cmd === 'register') {
          console.log('✅ REGISTER command detected');
          setResponse('✅ Going to registration page...');
          setTimeout(() => onNavigate('register'), 1500);
          matched = true;
          break;
        }
        
        // Restaurant commands - enhanced matching
        if (cmd.includes('restaurant') || cmd.includes('food') || cmd.includes('eat') || 
            cmd.includes('dining') || cmd.includes('nearby') || cmd === 'restaurants' || 
            cmd.includes('show restaurants') || cmd.includes('find restaurants')) {
          console.log('✅ RESTAURANT command detected');
          setResponse('✅ Finding nearby restaurants...');
          setTimeout(() => onNavigate('nearby'), 1500);
          matched = true;
          break;
        }
        
        // Reservation/Booking commands
        if (cmd.includes('reservation') || cmd.includes('booking') || cmd.includes('my bookings') || 
            cmd.includes('my reservations') || cmd === 'reservations' || cmd.includes('book table')) {
          console.log('✅ RESERVATION command detected');
          setResponse('✅ Showing your reservations...');
          setTimeout(() => onNavigate('reservations'), 1500);
          matched = true;
          break;
        }
        
        // Home commands
        if (cmd.includes('home') || cmd.includes('main') || cmd.includes('start') || 
            cmd === 'home' || cmd === 'go home' || cmd.includes('back to home')) {
          console.log('✅ HOME command detected');
          setResponse('✅ Going to home page...');
          setTimeout(() => onNavigate('home'), 1500);
          matched = true;
          break;
        }
        
        // Logout commands
        if (cmd.includes('logout') || cmd.includes('sign out') || cmd.includes('log out') || 
            cmd === 'logout') {
          console.log('✅ LOGOUT command detected');
          setResponse('✅ Logging you out...');
          setTimeout(() => {
            // Clear local storage or perform logout logic
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            onNavigate('login');
          }, 1500);
          matched = true;
          break;
        }
        
        // Help commands
        if (cmd.includes('help') || cmd.includes('what can you do') || cmd.includes('commands') || 
            cmd === 'help' || cmd.includes('how to') || cmd.includes('assist')) {
          console.log('✅ HELP command detected');
          setResponse('📋 Voice commands: "login", "register", "restaurants", "reservations", "home", "book table"');
          matched = true;
          break;
        }
      }
      
      // If no command matched
      if (!matched) {
        console.log('❌ No command matched for:', allCommands);
        setResponse(`❓ I heard: "${command}". Try: "login", "restaurants", "reservations", "home", or "help"`);
      }
    }, 500); // Shorter delay for better responsiveness
  }, [onNavigate]); // Add dependencies for useCallback

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice not supported. Please use Chrome or Edge browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      
      // Enhanced configuration for better recognition
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false; // Only final results
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 3; // Get multiple alternatives
      
      // More aggressive settings for better accuracy
      if ('webkitSpeechGrammarList' in window) {
        const grammar = '#JSGF V1.0; grammar commands; public <command> = login | register | restaurants | reservations | home | dashboard | help | book | table;';
        const speechRecognitionList = new window.webkitSpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognitionInstance.grammars = speechRecognitionList;
      }
      
      recognitionInstance.onstart = () => {
        console.log('🎤 Voice recognition started');
        setIsListening(true);
        setError(null);
        setResponse('🎤 Listening... Speak now!');
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('🎤 Speech recognition error:', event.error);
        setIsListening(false);
        
        // More descriptive error messages
        if (event.error === 'network') {
          setError('❌ Network error. Check your internet connection.');
        } else if (event.error === 'no-speech') {
          setError('❌ No speech detected. Try again.');
        } else if (event.error === 'not-allowed') {
          setError('❌ Microphone access denied. Please allow microphone access.');
        } else {
          setError(`❌ Voice recognition error: ${event.error}. Try using Chrome or Edge.`);
        }
      };
      
      recognitionInstance.onend = () => {
        console.log('🎤 Voice recognition ended');
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        const alternatives = [];
        
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript = result[0].transcript.trim().toLowerCase();
            
            // Collect alternatives for better matching
            for (let j = 0; j < result.length; j++) {
              if (result[j].transcript.trim()) {
                alternatives.push(result[j].transcript.trim().toLowerCase());
              }
            }
          }
        }
        
        console.log('🎤 Final transcript:', finalTranscript);
        console.log('🎤 Alternatives:', alternatives);
        
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
  }, []); // Remove processVoiceCommand dependency to avoid circular dependency

  // Quick action handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case 'restaurants':
        onNavigate('nearby');
        break;
      case 'login':
        onNavigate('login');
        break;
      case 'help':
        setResponse('Say: "show restaurants", "login", "register", "my reservations", or "book table at [restaurant name]"');
        break;
      default:
        console.log('Unknown quick action:', action);
        break;
    }
  };

  // Toggle listening with better feedback
  const toggleListening = () => {
    if (!recognition) {
      setError('Voice recognition not available. Please use Chrome or Edge browser.');
      return;
    }
    
    if (isListening) {
      console.log('🛑 Stopping voice recognition');
      recognition.stop();
      setResponse('Voice recognition stopped.');
    } else {
      console.log('▶️ Starting voice recognition');
      setTranscript('');
      setResponse('🎤 Listening... Say commands like: "login", "restaurants", "home"');
      setError(null);
      
      try {
        recognition.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
        setError('Failed to start voice recognition. Try again.');
      }
    }
  };

  const toggleExpansion = () => setIsExpanded(!isExpanded);
  
  const closeWidget = () => {
    setIsExpanded(false);
    setTranscript('');
    setResponse('');
    setError(null);
    if (recognition && isListening) recognition.stop();
  };

  const displayText = error || response || transcript || 
    (isExpanded ? 'Click microphone to start voice navigation...' : '');

  return (
    <VoiceBotContainer>
      <VoiceBotCard isExpanded={isExpanded}>
        {isExpanded && (
          <>
            <CloseButton onClick={closeWidget}>×</CloseButton>
            <h3 style={{ 
              color: 'white', 
              margin: '0 0 10px 0', 
              fontSize: '1rem',
              textAlign: 'center' 
            }}>
              🎤 Voice Navigation
            </h3>
          </>
        )}
        
        <VoiceBotButton
          isListening={isListening}
          isExpanded={isExpanded}
          onClick={isExpanded ? toggleListening : toggleExpansion}
          title={isExpanded ? 
            (isListening ? 'Stop listening' : 'Start voice recognition') : 
            'Open voice assistant'
          }
        >
          {isListening ? '🛑' : '🎤'}
        </VoiceBotButton>

        <StatusText isExpanded={isExpanded} isListening={isListening}>
          {isListening ? 'Listening...' : 'Click microphone to speak'}
        </StatusText>

        <TranscriptDisplay isExpanded={isExpanded}>
          {displayText || 'Voice feedback will appear here...'}
        </TranscriptDisplay>

        {isExpanded && (
          <>
            <QuickActionsContainer isExpanded={isExpanded}>
              <QuickActionButton onClick={() => handleQuickAction('restaurants')}>
                🍽️ Restaurants
              </QuickActionButton>
              {!currentUser && (
                <QuickActionButton onClick={() => handleQuickAction('login')}>
                  🔑 Login
                </QuickActionButton>
              )}
              <QuickActionButton onClick={() => handleQuickAction('help')}>
                ❓ Voice Commands
              </QuickActionButton>
            </QuickActionsContainer>

            <div style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '0.65rem', 
              marginTop: '10px',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              Current page: {currentPage}
            </div>
          </>
        )}
      </VoiceBotCard>
    </VoiceBotContainer>
  );
};

export default AppVoiceBot;