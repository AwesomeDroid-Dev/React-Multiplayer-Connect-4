import Game from "../Game/Game";
import { useState, useEffect } from "react";
import LogginScreen from "../Mulitplayer/LogginScreen";
import AccountBtn from "../Mulitplayer/AccountBtn";
import LeaveBtn from "../Utils/LeaveBtn";
import CreateTournament from "../Tournament/CreateTournament";
import socket from '../Mulitplayer/Socket';

function TournamentGame() {
  const [createGameMenu, setCreateGameMenu] = useState(true);
  const [myTurn, setMyTurn] = useState('');
  const [event, setEvent] = useState('');
  const [beginData, setBeginData] = useState({ turn: 'X', game: Array(42).fill('') });
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [showLogin, setShowLogin] = useState(true);
  const [currentMenu, setCurrentMenu] = useState('default');
  const [loginError, setLoginError] = useState<string>('');
  const [enemyUsername, setEnemyUsername] = useState<string>('');
  const [tournamentOrder, setTournamentOrder] = useState<any>([]);

  useEffect(() => {
    const handleStartGame = (data: any) => {
      setEnemyUsername(data.players.X !== username ? data.players.X : data.players.O);
      setMyTurn(data.players.X === username ? 'X' : 'O');
      setCreateGameMenu(false);
      setEvent('start-game');
    };

    const handleGridUpdate = (data: any) => {
      setBeginData((prev) => ({ ...prev, game: data }));
    };

    const handleTurnUpdate = (data: any) => {
      setBeginData((prev) => ({ ...prev, turn: data }));
    };

    const handleConnect = () => {
      if (username) {
        socket.emit('login', { username });
      } else {
        setShowLogin(false);
      }
    };

    const handleLoginResponse = (data: any) => {
      if (data.status === 'success') {
        localStorage.setItem('username', username);
        localStorage.setItem('loggedIn', 'true');
        setShowLogin(true);
      } else {
        setUsername('');
        setShowLogin(false);
        setLoginError(data.message);
      }
    };
    
    const handleNextRound = (data: any) => {
      setTournamentOrder(data.tournamentOrder);
      setCurrentMenu('tournamentDisplay');
      setCreateGameMenu(true)
    };

    socket.on('start-game', handleStartGame);
    socket.on('grid', handleGridUpdate);
    socket.on('turn', handleTurnUpdate);
    socket.on('connect', handleConnect);
    socket.on('login', handleLoginResponse);
    socket.on('next-round', handleNextRound);

    return () => {
      socket.off('start-game', handleStartGame);
      socket.off('grid', handleGridUpdate);
      socket.off('turn', handleTurnUpdate);
      socket.off('connect', handleConnect);
      socket.off('login', handleLoginResponse);
      socket.off('next-round', handleNextRound);
    };
  }, [username]);

  return (
    <>
      {showLogin ? (
        <>
          <AccountBtn />
          {createGameMenu ? (
            <CreateTournament 
              socket={socket} 
              currentMenu={currentMenu}
              setCurrentMenu={setCurrentMenu} 
              tournamentOrder={tournamentOrder} 
              setTournamentOrder={setTournamentOrder} 
            />
          ) : (
            <Game
              defTurn={beginData.turn}
              defGrid={beginData.game}
              multiplayer
              tournament
              data={socket}
              myTurn={myTurn}
              event={event}
              setEvent={setEvent}
              opponent={enemyUsername}
            />
          )}
        </>
      ) : (
        <>
          <LeaveBtn />
          <LogginScreen socket={socket} setUsername={setUsername} error={loginError} />
        </>
      )}
    </>
  );
}

export default TournamentGame;
