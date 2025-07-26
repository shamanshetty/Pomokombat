import React from 'react';
import { Avatar } from '../types';
import '../styles/AvatarSelector.css';

const HEROES: Avatar[] = [
  { id: 'jin', name: 'JIN KAZAMA', color: '#FFD700', emoji: '🥋' },
  { id: 'king', name: 'KING', color: '#FF6B35', emoji: '🐆' },
  { id: 'nina', name: 'NINA WILLIAMS', color: '#9B59B6', emoji: '👩‍💼' },
  { id: 'yoshimitsu', name: 'YOSHIMITSU', color: '#00FF7F', emoji: '⚔️' }
];

const VILLAINS: Avatar[] = [
  { id: 'heihachi', name: 'HEIHACHI', color: '#DC143C', emoji: '👹' },
  { id: 'kazuya', name: 'KAZUYA', color: '#8B0000', emoji: '😈' },
  { id: 'ogre', name: 'TRUE OGRE', color: '#4B0082', emoji: '👾' },
  { id: 'devil', name: 'DEVIL JIN', color: '#FF1493', emoji: '😈' }
];

interface AvatarSelectorProps {
  selectedHero: Avatar | null;
  selectedVillain: Avatar | null;
  onHeroSelect: (hero: Avatar) => void;
  onVillainSelect: (villain: Avatar) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedHero,
  selectedVillain,
  onHeroSelect,
  onVillainSelect
}) => {
  return (
    <div className="avatar-selector">
      <div className="hero-selection">
        <h3 className="selection-title">Select Your Hero</h3>
        <div className="avatar-grid">
          {HEROES.map(hero => (
            <button
              key={hero.id}
              className={`avatar-card hero ${selectedHero?.id === hero.id ? 'selected' : ''}`}
              onClick={() => onHeroSelect(hero)}
              style={{ borderColor: hero.color }}
            >
              <div className="avatar-emoji" style={{ color: hero.color }}>
                {hero.emoji}
              </div>
              <div className="avatar-name">{hero.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="vs-divider">
        <span className="vs-text">VS</span>
      </div>

      <div className="villain-selection">
        <h3 className="selection-title villain-title">Choose Your Enemy</h3>
        <div className="avatar-grid">
          {VILLAINS.map(villain => (
            <button
              key={villain.id}
              className={`avatar-card villain ${selectedVillain?.id === villain.id ? 'selected' : ''}`}
              onClick={() => onVillainSelect(villain)}
              style={{ borderColor: villain.color }}
            >
              <div className="avatar-emoji" style={{ color: villain.color }}>
                {villain.emoji}
              </div>
              <div className="avatar-name">{villain.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;