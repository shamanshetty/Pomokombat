import React, { useState, useEffect } from 'react';
import TaskManager from './components/TaskManager';
import AvatarSelector from './components/AvatarSelector';
import GameScreen from './components/GameScreen';
import BreakSelector from './components/BreakSelector';
import { Task, Avatar, GameState } from './types';
import { loadFromStorage, saveToStorage } from './utils/storage';
import './styles/App.css';

function App() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [breakDuration, setBreakDuration] = useState(15);
  const [selectedHero, setSelectedHero] = useState<Avatar | null>(null);
  const [selectedVillain, setSelectedVillain] = useState<Avatar | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  
  useEffect(() => {
    const savedTasks = loadFromStorage('tasks');
    const savedBreakDuration = loadFromStorage('breakDuration');
    const savedSoundEnabled = loadFromStorage('soundEnabled');
    
    if (savedTasks?.length) setTasks(savedTasks);
    if (savedBreakDuration) setBreakDuration(savedBreakDuration);
    if (typeof savedSoundEnabled === 'boolean') setSoundEnabled(savedSoundEnabled);
  }, []);

  useEffect(() => {
    saveToStorage('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('breakDuration', breakDuration);
  }, [breakDuration]);

  useEffect(() => {
    saveToStorage('soundEnabled', soundEnabled);
  }, [soundEnabled]);

  const handleStartGame = () => {
    if (tasks.length > 0 && selectedHero && selectedVillain) {
      setGameState('playing');
      setCurrentTaskIndex(0);
    }
  };

  const handleTaskComplete = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      setGameState('break');
    } else {
      setGameState('victory');
    }
  };

  const handleBreakComplete = () => {
    setGameState('playing');
  };

  const handleBackToSetup = () => {
    setGameState('setup');
    setCurrentTaskIndex(0);
  };

  const canStartGame = tasks.length > 0 && selectedHero && selectedVillain;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="game-title">
          <span className="title-glow">POMOKOMBAT</span>
        </h1>
        <p className="tagline">FIGHT FOR FOCUS!</p>
        <button 
          className="sound-toggle"
          onClick={() => setSoundEnabled(!soundEnabled)}
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </header>

      <main className="app-main">
        {gameState === 'setup' && (
          <div className="setup-screen">
            <div className="setup-section">
              <h2 className="section-title">Mission Briefing</h2>
              <TaskManager tasks={tasks} onTasksChange={setTasks} />
            </div>

            <div className="setup-section">
              <h2 className="section-title">Choose Your Fighter!</h2>
              <AvatarSelector
                selectedHero={selectedHero}
                selectedVillain={selectedVillain}
                onHeroSelect={setSelectedHero}
                onVillainSelect={setSelectedVillain}
              />
            </div>

            <div className="setup-section">
              <h2 className="section-title">Break Time Settings</h2>
              <BreakSelector
                breakDuration={breakDuration}
                onBreakDurationChange={setBreakDuration}
              />
            </div>

            <button
              className={`insert-coin-btn ${canStartGame ? 'ready' : 'disabled'}`}
              onClick={handleStartGame}
              disabled={!canStartGame}
            >
              <span className="coin-text">FIGHT!</span>
              <span className="start-text">READY?</span>
            </button>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'break' || gameState === 'victory') && (
          <GameScreen
            gameState={gameState}
            currentTask={tasks[currentTaskIndex]}
            currentTaskIndex={currentTaskIndex}
            totalTasks={tasks.length}
            breakDuration={breakDuration}
            hero={selectedHero!}
            villain={selectedVillain!}
            soundEnabled={soundEnabled}
            onTaskComplete={handleTaskComplete}
            onBreakComplete={handleBreakComplete}
            onBackToSetup={handleBackToSetup}
          />
        )}
      </main>

      <div className="arcade-border top"></div>
      <div className="arcade-border bottom"></div>
      <div className="arcade-border left"></div>
      <div className="arcade-border right"></div>
    </div>
  );
}

export default App;
