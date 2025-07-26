import React, { useState, useEffect } from 'react';
import { Task, Avatar, GameState } from '../types';
import Timer from './Timer';
import HealthBar from './HealthBar';
import '../styles/GameScreen.css';

interface GameScreenProps {
  gameState: GameState;
  currentTask: Task;
  currentTaskIndex: number;
  totalTasks: number;
  breakDuration: number;
  hero: Avatar;
  villain: Avatar;
  soundEnabled: boolean;
  onTaskComplete: () => void;
  onBreakComplete: () => void;
  onBackToSetup: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  currentTask,
  currentTaskIndex,
  totalTasks,
  breakDuration,
  hero,
  villain,
  soundEnabled,
  onTaskComplete,
  onBreakComplete,
  onBackToSetup
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gameState === 'playing' && !showCountdown) {
      startCountdown();
      if (soundEnabled) {
        playBackgroundMusic();
      }
    }
    
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    }
  }, [gameState, currentTaskIndex, soundEnabled]);

  const playBackgroundMusic = () => {
    if (!soundEnabled) return;
    
    // Create a simple background music using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Tekken-style battle music pattern
    const melody = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440];
    let noteIndex = 0;
    
    const playMelody = () => {
      oscillator.frequency.setValueAtTime(melody[noteIndex % melody.length], audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      noteIndex++;
      
      if (gameState === 'playing') {
        setTimeout(playMelody, 500);
      }
    };
    
    oscillator.start();
    playMelody();
    
    setTimeout(() => {
      try {
        oscillator.stop();
      } catch (e) {
        // Oscillator already stopped
      }
    }, currentTask?.duration * 60 * 1000 || 25 * 60 * 1000);
  };

  const startCountdown = () => {
    setShowCountdown(true);
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          setCountdown(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playSound = (type: 'start' | 'complete' | 'victory') => {
    if (!soundEnabled) return;
    
    // Simple beep sounds using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequencies = {
      start: [523, 659, 784], // C, E, G
      complete: [784, 659, 523], // G, E, C
      victory: [523, 659, 784, 1047] // C, E, G, C
    };
    
    const freq = frequencies[type];
    let noteIndex = 0;
    
    const playNote = () => {
      if (noteIndex < freq.length) {
        oscillator.frequency.setValueAtTime(freq[noteIndex], audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        noteIndex++;
        setTimeout(playNote, 200);
      }
    };
    
    oscillator.start();
    playNote();
    setTimeout(() => oscillator.stop(), freq.length * 200 + 100);
  };

  const handleTimerComplete = () => {
    playSound('complete');
    if (gameState === 'playing') {
      onTaskComplete();
    } else if (gameState === 'break') {
      onBreakComplete();
    }
  };

  if (gameState === 'victory') {
    playSound('victory');
    return (
      <div className="game-screen victory-screen">
        <div className="victory-content">
          <h2 className="victory-title">PERFECT!</h2>
          <div className="victory-hero" style={{ color: hero.color }}>
            {hero.emoji}
          </div>
          <p className="victory-message">
            {hero.name} WINS! All {totalTasks} rounds completed!
          </p>
          <button onClick={onBackToSetup} className="victory-btn">
            CONTINUE?
          </button>
        </div>
      </div>
    );
  }

  const isBreak = gameState === 'break';
  const duration = isBreak ? breakDuration : currentTask?.duration || 25;

  return (
    <div className="game-screen">
      {showCountdown && countdown && (
        <div className="countdown-overlay">
          <div className="countdown-number">{countdown}</div>
          <div className="countdown-text">
            {countdown === 3 && 'READY?'}
            {countdown === 2 && 'FIGHT!'}
            {countdown === 1 && 'FIGHT!'}
          </div>
        </div>
      )}

      <div className="game-header">
        <div className="round-info">
          <span className="round-label">ROUND</span>
          <span className="round-number">{currentTaskIndex + 1}/{totalTasks}</span>
        </div>
        <div className="current-mission">
          {isBreak ? 'INTERMISSION' : currentTask?.name}
        </div>
        <button onClick={onBackToSetup} className="quit-btn">
          FORFEIT
        </button>
      </div>

      <div className="battle-arena">
        <div className="fighter hero-fighter">
          <div className="fighter-avatar" style={{ color: hero.color }}>
            {hero.emoji}
          </div>
          <div className="fighter-name">{hero.name}</div>
          <HealthBar 
            current={0} 
            max={duration * 60} 
            color={hero.color}
            label="HERO"
            isHero={true}
          />
        </div>

        <div className="vs-section">
          <Timer
            duration={duration}
            isActive={!showCountdown}
            onComplete={handleTimerComplete}
            isBreak={isBreak}
          />
        </div>

        <div className="fighter villain-fighter">
          <div className="fighter-avatar" style={{ color: villain.color }}>
            {villain.emoji}
          </div>
          <div className="fighter-name">{villain.name}</div>
          <HealthBar 
            current={duration * 60} 
            max={duration * 60} 
            color={villain.color}
            label="VILLAIN"
            isHero={false}
          />
        </div>
      </div>

      <div className="battle-status">
        <div className="status-text">
          {isBreak 
            ? `ROUND ${currentTaskIndex} COMPLETE`
            : `ROUND ${currentTaskIndex + 1}: ${currentTask?.name}`
          }
        </div>
      </div>
    </div>
  );
};

export default GameScreen;