import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'
import Modal from "./Modal";

function Home() {

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    //variables needed for game data
    const [team, setTeam] = useState("")
    const [opponent, setOpponent] = useState("");
    const [location, setLocation] = useState("");
    const [isHalf, setIsHalf] = useState(true);
    const [length, setLength] = useState(0);

    const startNewGame = () => {
        setShowModal(true);
    };

    const confirmNewGame = () => {
        const id = crypto.randomUUID();
        setShowModal(false);
        navigate(`/Game/${id}`);
    };

    return (
        /*<div>
            <button onClick={startNewGame}>New Game</button>
        </div>*/
        <div>
            <h1>History</h1>
            <button onClick={startNewGame} className="bg-blue-600 text-white px-4 py-2 rounded">New Game</button>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2>Game Details</h2>
                <div>
                    <label>Team:  </label>
                    <input type="text" value={team} onChange={(e) => setTeam(e.target.value)} />
                </div>
                <div>
                    <label>Opponent:  </label>
                    <input type="text" value={opponent} onChange={(e) => setOpponent(e.target.value)} />
                </div>
                <div>
                    <label>Location:  </label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div>
                    <label>Half or Quarters:  </label>

                </div>
                <div>
                    <label>Length:  </label>
                    <input type="number" min="0" max="20" value={length} onChange={(e) => setLength(e.target.value)} />
                </div>
                <button onClick={confirmNewGame}>Add Game</button>
            </Modal>

        </div>

    )
}

export default Home