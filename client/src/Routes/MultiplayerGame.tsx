import CreateGame from "../Mulitplayer/CreateGame";
import Game from "../Game/Game"
import io from "socket.io-client"
import LeaveBtn from "../Utils/LeaveBtn";
import { useEffect, useState } from "react";
import LogginScreen from "../Mulitplayer/LogginScreen";

const socket = io('http://localhost:5000')
socket.connect();


function MultiplayerGame() {
  const [createGameMenu, setCreateGameMenu] = useState(true)
  const [myTurn, setMyTurn] = useState('')
  const [event, setEvent] = useState('')
  const [beginData, setBeginData] = useState({turn: 'X', game: Array(42).fill('')})
  const [username, setUsername] = useState(localStorage.getItem('username'))
  
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
    }
  }, [])

  return (
    <>
    {
    username ? 
    <>
    <LeaveBtn />
    {createGameMenu && <CreateGame socket={socket} />}
    {!createGameMenu && <Game defTurn={beginData.turn} defGrid={beginData.game} multiplayer={true} data={socket} myTurn={myTurn} event={event} setEvent={setEvent} /> }
    </>
    :
    <LogginScreen socket={socket} setUsername={setUsername} />
    }
    </>
  )
}

export default MultiplayerGame