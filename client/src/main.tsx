import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Layout from './Layout.tsx';
import LocalGame from './Routes/LocalGame.tsx';
import App from './App.tsx';
import MultiplayerGame from './Routes/MultiplayerGame.tsx';
import TournamentGame from './Routes/TournamentGame.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path='/local-game' element={<LocalGame />} />
          <Route path='/multiplayer-game' element={<MultiplayerGame />} />
          <Route path='/tournament-game' element={<TournamentGame />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
