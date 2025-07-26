import React from 'react';
import '../styles/BreakSelector.css';

const BREAK_OPTIONS = [5, 10, 15, 20, 25, 30];

interface BreakSelectorProps {
  breakDuration: number;
  onBreakDurationChange: (duration: number) => void;
}

const BreakSelector: React.FC<BreakSelectorProps> = ({
  breakDuration,
  onBreakDurationChange
}) => {
  return (
    <div className="break-selector">
      <div className="break-options">
        {BREAK_OPTIONS.map(duration => (
          <button
            key={duration}
            className={`break-option ${breakDuration === duration ? 'selected' : ''}`}
            onClick={() => onBreakDurationChange(duration)}
          >
            <span className="break-duration">{duration}</span>
            <span className="break-label">MIN</span>
          </button>
        ))}
      </div>
      <p className="break-description">
        Recovery time between battles: <strong>{breakDuration} minutes</strong>
      </p>
    </div>
  );
};

export default BreakSelector;