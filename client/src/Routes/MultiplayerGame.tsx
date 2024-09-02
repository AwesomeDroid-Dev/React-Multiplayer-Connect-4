import CreateGame from "../Mulitplayer/CreateGame";
import Game from "../Game/Game"
import io from "socket.io-client"
import { useEffect, useState } from "react";
import LogginScreen from "../Mulitplayer/LogginScreen";
import AccountBtn from "../Mulitplayer/AccountBtn";
import LeaveBtn from "../Utils/LeaveBtn";

const socket = io('http://localhost:5009')
socket.connect();


function MultiplayerGame() {
  const [createGameMenu, setCreateGameMenu] = useState(true)
  const [myTurn, setMyTurn] = useState('')
  const [event, setEvent] = useState('')
  const [beginData, setBeginData] = useState({turn: 'X', game: Array(42).fill('')})
  const [username, setUsername] = useState(localStorage.getItem('username'))
  const [showLogin, setShowLogin] = useState(true)
  const [loginError, setLoginError] = useState<string>('')
  
  socket.on('start-game', (data: any) => {
    //players = {X: socket.id 1, O: socket.id 2}
    console.log('start game 1')
    setMyTurn(data.players.X === socket.id ? 'X' : 'O')
    setCreateGameMenu(false)
    setEvent('start-game')
  })
  if (createGameMenu) {
    socket.on('grid', (data: any) => {
      console.log(data)
      setBeginData(c => {c.game = data; return c})
    })
    socket.on('turn', (data: any) => {
      console.log('turn')
      setBeginData(c => {c.turn = data; return c})
    })
  }
  
  useEffect(() => {
    if (username) {
      socket.emit('login', {username})
    } else {
      setShowLogin(false)
    }
  }, [])


  socket.on('login', (data: any) => {
    if (data.status === 'success') {
        localStorage.setItem('username', username?username:'')
        localStorage.setItem('loggedIn', `true`)
        setShowLogin(true)
    } else {
        setUsername(null)
        setShowLogin(false)
        setLoginError(data.message)
    }
})

  return (
    <>
    {
    showLogin ? 
    <>
    <AccountBtn />
    {createGameMenu && <CreateGame socket={socket} />}
    {!createGameMenu && <Game defTurn={beginData.turn} defGrid={beginData.game} multiplayer={true} data={socket} myTurn={myTurn} event={event} setEvent={setEvent} /> }
    </>
    :
    <>
    <LeaveBtn />
    <LogginScreen socket={socket} setUsername={setUsername} error={loginError} />
    </>
    }
    </>
  )
}

export default MultiplayerGame