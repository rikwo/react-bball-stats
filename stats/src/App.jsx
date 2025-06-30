import {useEffect, useState} from 'react'
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import EventModal from './EventModal.jsx';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState('');
  const [pointAmount, setPointAmount] = useState(1);
  const [clickPos, setClickPos] = useState(null);

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

      return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const formatTime = (seconds) => {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}:${String(sec).padStart(2, '0')}`;
  }

    const handleConfirmEvent = () => {
        if (!clickPos || time === 0) return;

        if (!selectedStat) {
            alert('Please select a stat type.');
            return;
        }

        const amount = selectedStat === 'points' ? pointAmount : 1;

        const newPin = {
            id: uuidv4(),
            x: clickPos.x,
            y: clickPos.y,
            statType: selectedStat,
            amount,
            time,
            half,
        };

        setPins(prev => [...prev, newPin]);

        switch (selectedStat) {
            case 'points': setPoints(p => p + amount); break;
            case 'rebounds': setRebounds(r => r + amount); break;
            case 'assists': setAssists(a => a + amount); break;
            case 'steals': setSteals(s => s + amount); break;
            case 'blocks': setBlocks(b => b + amount); break;
            case 'turnovers': setTurnovers(t => t + amount); break;
            default: break;
        }

        // Reset state
        setSelectedStat('');
        setPointAmount(1);
        setClickPos(null);
        setIsModalOpen(false);
    };

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

    const getPinColor = (statType) => {
        switch (statType) {
            case 'points': return 'red';
            case 'rebounds': return 'blue';
            case 'assists': return 'green';
            case 'steals': return 'orange';
            case 'blocks': return 'purple';
            case 'turnovers': return 'black';
            default: return 'gray';
        }
    };

    const legendDot = (color) => ({
        display: 'inline-block',
        width: '12px',
        height: '12px',
        backgroundColor: color,
        borderRadius: '50%',
        marginRight: '8px',
    });

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
              <div style={{ width: '200px', padding: '20px' }}>
                  <h4>Legend:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                      <li><span style={legendDot('red')}></span> Points</li>
                      <li><span style={legendDot('blue')}></span> Rebounds</li>
                      <li><span style={legendDot('green')}></span> Assists</li>
                      <li><span style={legendDot('orange')}></span> Steals</li>
                      <li><span style={legendDot('purple')}></span> Blocks</li>
                      <li><span style={legendDot('black')}></span> Turnovers</li>
                  </ul>
              </div>
              <div
                  style={{ flex: 1, position: 'relative' }}
                  onClick={(e) => {
                      const court = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - court.left) / court.width) * 100;
                      const y = ((e.clientY - court.top) / court.height) * 100;
                      setClickPos({ x, y });
                      setIsModalOpen(true);
                  }}
              >
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
                              background: getPinColor(pin.statType), // 🔸 assign dynamic color
                              borderRadius: '50%',
                              width: '10px',
                              height: '10px'
                          }}
                          title={`${pin.statType}: ${pin.amount}`}
                      />
                  ))}
                  <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                      <div style={{ color: 'black' }}>
                          <h2>Record Event</h2>

                          <div>
                              <div style={{ marginTop: '10px' }}>
                                  <label htmlFor="statSelect">Select Stat Type:</label>
                                  <select
                                      id="statSelect"
                                      value={selectedStat}
                                      onChange={(e) => setSelectedStat(e.target.value)}
                                      style={{ display: 'block', marginTop: '5px', padding: '5px' }}
                                  >
                                      <option value="">-- Choose stat --</option>
                                      <option value="points">Points</option>
                                      <option value="rebounds">Rebound</option>
                                      <option value="assists">Assist</option>
                                      <option value="steals">Steal</option>
                                      <option value="blocks">Block</option>
                                      <option value="turnovers">Turnover</option>
                                  </select>
                                  {selectedStat === 'points' && (
                                      <div style={{ marginTop: '10px' }}>
                                          <p>Points Scored:</p>
                                          <button onClick={() => setPointAmount(p => Math.max(1, p - 1))}>-</button>
                                          <span style={{ margin: '0 10px' }}>{pointAmount}</span>
                                          <button onClick={() => setPointAmount(p => Math.min(3, p + 1))}>+</button>
                                      </div>
                                  )}
                              </div>
                              <div style={{ marginTop: '20px' }}>
                                  <button onClick={handleConfirmEvent}>Confirm</button>
                              </div>
                          </div>
                      </div>
                  </EventModal>
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
                            {pin.statType} (+{pin.amount}) - {formatTime(pin.time)} - {isHalf ? `Half ${pin.half}` : `Q${pin.half}`}
                        </li>
                      ))}
                  </ul>
              </div>
          </div>
      </div>
  )
}

export default App
