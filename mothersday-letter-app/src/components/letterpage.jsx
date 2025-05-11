// src/components/LetterPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PenTool, Heart, RefreshCw, Printer, Volume2, VolumeX } from 'lucide-react';
import letterTemplates from '../assets/templates';

function LetterPage() {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [writingComplete, setWritingComplete] = useState(false);
  const [visibleText, setVisibleText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const penRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  // Pen writing sound effect
  useEffect(() => {
    audioRef.current = new Audio('https://cdnjs.cloudflare.com/ajax/libs/sound-effects/1.0.0/writing.mp3');
    audioRef.current.loop = true;
  }, []);

  // Play/pause audio based on user preference
  useEffect(() => {
    if (audioRef.current) {
      if (audioEnabled && !writingComplete) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioEnabled, writingComplete]);

  // Load letter data
  useEffect(() => {
    const fetchLetter = () => {
      // In a real app, you'd fetch this from a database
      const storedLetter = localStorage.getItem(`letter_${id}`);
      
      if (storedLetter) {
        const parsedLetter = JSON.parse(storedLetter);
        
        // Find template
        const template = letterTemplates.find(t => t.id === parsedLetter.templateId);
        
        if (template) {
          let content = template.content;
          
          // Add custom line if provided
          if (parsedLetter.customLine) {
            content += `\n\n${parsedLetter.customLine}`;
          }
          
          // Add signature
          content += `\n\n${parsedLetter.customName || 'With love'}`;
          
          setLetter({
            ...parsedLetter,
            fullContent: content
          });
        }
      }
      
      setLoading(false);
    };
    
    fetchLetter();
  }, [id]);

  // Split content into lines for animation
  const contentLines = letter?.fullContent.split('\n') || [];

  // Handle writing animation
  useEffect(() => {
    if (loading || !letter || writingComplete || isReplaying) return;
    
    const writeNextChar = () => {
      if (currentLine >= contentLines.length) {
        setWritingComplete(true);
        return;
      }
      
      const currentLineText = contentLines[currentLine];
      
      if (currentChar >= currentLineText.length) {
        // Move to next line
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
        setVisibleText(prev => prev + '\n');
        return;
      }
      
      // Write next character
      const nextChar = currentLineText[currentChar];
      setVisibleText(prev => prev + nextChar);
      setCurrentChar(prev => prev + 1);
      
      // Position pen at current writing position
      if (penRef.current && containerRef.current) {
        const textMeasure = document.createElement('span');
        textMeasure.style.font = '22px "Caveat", cursive';
        textMeasure.style.position = 'absolute';
        textMeasure.style.visibility = 'hidden';
        textMeasure.style.whiteSpace = 'pre';
        textMeasure.innerText = currentLineText.substring(0, currentChar + 1);
        document.body.appendChild(textMeasure);
        
        // Calculate position
        const lineHeight = 36; // px, matches CSS
        const initialOffset = { x: 60, y: 150 }; // initial pen position
        
        const xPos = initialOffset.x + textMeasure.offsetWidth;
        const yPos = initialOffset.y + (currentLine * lineHeight);
        
        // Set pen position
        penRef.current.style.left = `${xPos}px`;
        penRef.current.style.top = `${yPos}px`;
        
        document.body.removeChild(textMeasure);
      }
    };
    
    // Set writing speed (adjust for more natural rhythm)
    const getRandomDelay = () => {
      // Occasionally pause longer at punctuation
      const lastChar = visibleText.slice(-1);
      if (['.', ',', '!', '?'].includes(lastChar)) {
        return Math.random() * 300 + 150;
      }
      return Math.random() * 100 + 50; // Normal character delay
    };
    
    const timeoutId = setTimeout(writeNextChar, getRandomDelay());
    
    return () => clearTimeout(timeoutId);
  }, [loading, letter, currentLine, currentChar, contentLines, visibleText, writingComplete, isReplaying]);

  // Handle replay
  const handleReplay = () => {
    setIsReplaying(true);
    setVisibleText('');
    setCurrentLine(0);
    setCurrentChar(0);
    setWritingComplete(false);
    
    // Small delay before starting replay
    setTimeout(() => {
      setIsReplaying(false);
    }, 500);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Toggle sound
  const toggleSound = () => {
    setAudioEnabled(!audioEnabled);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading your special letter...</div>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="not-found-container">
        <div className="not-found-text">Letter not found</div>
        <Link to="/" className="not-found-link">
          Create a new letter
        </Link>
      </div>
    );
  }

  return (
    <div className="letter-page-container">
      <div 
        ref={containerRef}
        className="letter-paper"
      >
        {/* Animated pen */}
        {!writingComplete && (
          <div 
            ref={penRef}
            className="animated-pen"
            style={{ 
              left: '60px',
              top: '150px'
            }}
          >
            <PenTool size={32} className="pen-icon" />
          </div>
        )}
        
        {/* Letter content */}
        <div className="letter-content">
          {visibleText}
        </div>
      </div>
      
      {/* Controls */}
      <div className="letter-controls">
        <button 
          onClick={handleReplay}
          className="control-btn replay-btn"
        >
          <RefreshCw className="btn-icon" size={18} />
          Replay Animation
        </button>
        
        <button 
          onClick={handlePrint}
          className="control-btn print-btn"
        >
          <Printer className="btn-icon" size={18} />
          Print Letter
        </button>
        
        <button 
          onClick={toggleSound}
          className="control-btn sound-btn"
        >
          {audioEnabled ? <VolumeX className="btn-icon" size={18} /> : <Volume2 className="btn-icon" size={18} />}
          {audioEnabled ? 'Mute Sound' : 'Enable Sound'}
        </button>
      </div>
    </div>
  );
}

export default LetterPage;