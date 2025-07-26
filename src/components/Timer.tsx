import React, { useState, useEffect } from 'react';
import '../styles/Timer.css';

interface TimerProps {
  duration: number; // in minutes
  isActive: boolean;
  onComplete: () => void;
  isBreak: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, isActive, onComplete, isBreak }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsPaused(false);
  }, [duration]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className={`timer ${isBreak ? 'break-timer' : 'work-timer'}`}>
      <div className="timer-display">
        <div className="timer-time">{formatTime(timeLeft)}</div>
        <div className="timer-label">
          {isBreak ? 'INTERMISSION' : 'FIGHT!'}
        </div>
      </div>
      
      <div className="timer-progress">
        <div 
          className="timer-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button 
        onClick={() => setIsPaused(!isPaused)}
        className="pause-btn"
        disabled={!isActive}
      >
        {isPaused ? 'RESUME' : 'PAUSE'}
      </button>
    </div>
  );
};

export default Timer;