import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ toggled, onClick }) => {
  return (
    <button
      className={`toggle-btn ${toggled ? 'toggled' : ''}`}
      onClick={onClick}
      role="switch"
      aria-checked={toggled}
    >
      <div className="thumb"></div>
    </button>
  );
};

export default ToggleSwitch;
