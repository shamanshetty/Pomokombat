import React, { useState, useEffect } from 'react';
import '../styles/HealthBar.css';

interface HealthBarProps {
  current: number;
  max: number;
  color: string;
  label: string;
  isHero: boolean;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max, color, label, isHero }) => {
  const [animatedCurrent, setAnimatedCurrent] = useState(current);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedCurrent(prev => {
        if (isHero) {
          // Hero's health increases over time (progress)
          const target = max - current;
          return prev < target ? prev + (max * 0.01) : target;
        } else {
          // Villain's health decreases over time
          return prev > current ? prev - (max * 0.01) : current;
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [current, max, isHero]);

  const percentage = Math.max(0, Math.min(100, (animatedCurrent / max) * 100));

  return (
    <div className="health-bar">
      <div className="health-label">{label}</div>
      <div className="health-bar-container">
        <div 
          className="health-bar-fill"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 15px ${color}, inset 0 0 10px rgba(255,255,255,0.3)`
          }}
        />
        <div className="health-bar-bg" />
      </div>
      <div className="health-percentage">
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

export default HealthBar;