import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'

function Home() {

    const navigate = useNavigate();

    const startNewGame = () => {
        const id = crypto.randomUUID();
        navigate(`/Game/${id}`);
    }

    return <button onClick={startNewGame}>New Game</button>;
}

export default Home