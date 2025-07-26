import React, { useState } from 'react';
import { Task } from '../types';
import '../styles/TaskManager.css';

interface TaskManagerProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onTasksChange }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(25);

  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        duration: newTaskDuration
      };
      onTasksChange([...tasks, newTask]);
      setNewTaskName('');
      setNewTaskDuration(25);
    }
  };

  const removeTask = (taskId: string) => {
    onTasksChange(tasks.filter(task => task.id !== taskId));
  };

  const moveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...tasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newTasks.length) {
      [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]];
      onTasksChange(newTasks);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="task-manager">
      <div className="add-task-form">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your mission..."
          className="task-input"
          maxLength={50}
        />
        <div className="duration-selector">
          <label htmlFor="duration">Minutes:</label>
          <select
            id="duration"
            value={newTaskDuration}
            onChange={(e) => setNewTaskDuration(Number(e.target.value))}
            className="duration-select"
          >
            {Array.from({ length: 21 }, (_, i) => i + 5).map(minutes => (
              <option key={minutes} value={minutes}>{minutes}</option>
            ))}
          </select>
        </div>
        <button onClick={addTask} className="add-task-btn" disabled={!newTaskName.trim()}>
          ADD MISSION
        </button>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No missions yet! Add some tasks to begin your epic battle.</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div key={task.id} className="task-item">
              <div className="task-info">
                <span className="task-number">#{index + 1}</span>
                <span className="task-name">{task.name}</span>
                <span className="task-duration">{task.duration}m</span>
              </div>
              <div className="task-controls">
                <button
                  onClick={() => moveTask(index, 'up')}
                  disabled={index === 0}
                  className="move-btn"
                  aria-label="Move task up"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveTask(index, 'down')}
                  disabled={index === tasks.length - 1}
                  className="move-btn"
                  aria-label="Move task down"
                >
                  ▼
                </button>
                <button
                  onClick={() => removeTask(task.id)}
                  className="remove-btn"
                  aria-label="Remove task"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;