import { useState } from 'react'
import './App.css'

function App() {
  const [points, setPoints] = useState(0);
  const [rebounds, setRebounds] = useState(0);
  const [assists, setAssists] = useState(0);
  const [steals, setSteals] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [turnovers, setTurnovers] = useState(0);
  const [time, setTime] = useState(600);
  const [isHalf, setIsHalf] = useState(true);
  const [pins, setPins] = useState([]);
  const [date, setDate] = useState(Date.now());

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

  const handleCourtClick = (e) => {
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

      const newPin = { x, y, statType, amount };
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

  return (
      <div>
          <h2>Game - {formatDate(date)}</h2>
          <h3>0:00</h3>
          <div style={{ display: 'flex', height: '500px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                  <img
                      src="court.png"
                      alt="court"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onClick={handleCourtClick}
                  />
                  {pins.map((pin, index) => (
                      <div
                          key={index}
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
              </div>
          </div>
      </div>
  )
}

export default App
