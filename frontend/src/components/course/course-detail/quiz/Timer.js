import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

const Timer = ({ initialMinutes, initialSeconds, onTimeUp }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          onTimeUp(); // Trigger when time is up
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds, onTimeUp]);

  return (
    <div className="timer">
      <FaClock className="clock-icon" />
      <span className="time-display">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </div>
  );
};

export default Timer;
