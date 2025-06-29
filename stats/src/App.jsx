import {useEffect, useState} from 'react'
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import './App.css'

function App() {
  const [points, setPoints] = useState(0);
  const [rebounds, setRebounds] = useState(0);
  const [assists, setAssists] = useState(0);
  const [steals, setSteals] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [turnovers, setTurnovers] = useState(0);
  const [time, setTime] = useState(10);
  const [isHalf, setIsHalf] = useState(true);
  const [pins, setPins] = useState([]);
  const [date, setDate] = useState(Date.now());
  const [half, setHalf] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
      let interval = null;
      if (isRunning && time > 0) {
          interval = setInterval(() => {
              setTime(prevTime => prevTime - 1);
          }, 1000);
      } else {
          clearInterval(interval);
          if((isHalf && half < 2) || (!isHalf && half < 4)) {
              setHalf(half + 1);
              setIsRunning(false);
              setTime(10);
          }
      }
      return () => clearInterval(interval);
  }, [isRunning, time])

  const formatDate = (timestamp) => {
      const d = new Date(timestamp);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');

      const [pins, setPins] = useState([]);

      return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const formatTime = (seconds) => {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}:${String(sec).padStart(2, '0')}`;
  }

  const handleCourtClick = (e) => {
      if (time == 0) {
          return;
      }
      const court = e.target.getBoundingClientRect();
      const x = ((e.clientX - court.left) / court.width) * 100;
      const y = ((e.clientY - court.top) / court.height) * 100;


      const statType = prompt('Mark as: points, rebounds, assists, steals, blocks, turnovers?').toLowerCase();
      if (!['points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers'].includes(statType)) {
          alert('Invalid stat type');
          return;
      }

      const amount = parseInt(prompt(`How many ${statType}?`), 10);
      if (isNaN(amount) || amount <= 0) {
          alert('Invalid amount');
          return;
      }

      const newPin = { id: uuidv4(), x, y, statType, amount, time, half};
      setPins(prev => [...prev, newPin]);

      switch (statType) {
          case 'points': setPoints(p => p + amount); break;
          case 'rebounds': setRebounds(r => r + amount); break;
          case 'assists': setAssists(a => a + amount); break;
          case 'steals': setSteals(s => s + amount); break;
          case 'blocks': setBlocks(b => b + amount); break;
          case 'turnovers': setTurnovers(t => t + amount); break;
          default: break;
      }
  }

  const TimerPrompt= (e) => {
      const customTime = prompt("Set game clock");
      const parsedTime = parseInt(customTime, 10);

      if (!isNaN(parsedTime) && parsedTime >= 0) {
          setTime(parsedTime);
      } else {
          alert("Please enter a valid non-negative number.");
      }
  }

    function changeHalf() {
        if (isHalf) {
            setIsHalf(false);
        } else {
            setIsHalf(true);
        }
    }

    return (
      <div>
          <h2>Game - {formatDate(date)}</h2>
          <h3>{isHalf? `Half - ${half}` : `Quarter - ${half}`}</h3>
          <div style={{display: 'flex',justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
              <button onClick={TimerPrompt}>Set Game Clock</button>
            <h3>{formatTime(time)}</h3>
              {isRunning ? (
                  <button onClick={() => setIsRunning(false)}>Pause</button>
              ) : (
                  <button onClick={() => setIsRunning(true)}>Play</button>
              )}
          </div>
          <button onClick={changeHalf}>{isHalf ? "Change to quarters" : "Change to halves"}</button>
          <div style={{ display: 'flex', height: '500px' }}>
              <div style={{ flex: 1, position: 'relative' }} onClick={handleCourtClick}>
                  <img
                      src="court.png"
                      alt="court"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {pins.map((pin, index) => (
                      <div
                          key={pin.id}
                          style={{
                              position: 'absolute',
                              top: `${pin.y}%`,
                              left: `${pin.x}%`,
                              transform: 'translate(-50%, -50%)',
                              background: 'red',
                              borderRadius: '50%',
                              width: '10px',
                              height: '10px'
                          }}
                          title={`${pin.statType}: ${pin.amount}`}
                      />
                  ))}
              </div>
              <div style={{ width: '200px', padding: '20px' }}>
                  <p>Points: {points}</p>
                  <p>Rebounds: {rebounds}</p>
                  <p>Assists: {assists}</p>
                  <p>Steals: {steals}</p>
                  <p>Blocks: {blocks}</p>
                  <p>Turnovers: {turnovers}</p>
                  <h4>Event List:</h4>
                  <ul style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {pins.map((pin, index) => (
                        <li key={index}>
                            {pin.statType} (+{pin.amount})
                        </li>
                      ))}
                  </ul>
              </div>
          </div>
      </div>
  )
}

export default App
