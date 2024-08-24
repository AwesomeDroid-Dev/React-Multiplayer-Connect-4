import CreateGame from "../Mulitplayer/CreateGame";
import Game from "../Game/Game"
import io from "socket.io-client"
import LeaveBtn from "../Utils/LeaveBtn";
import { useState } from "react";

const socket = io('http://localhost:5000')
socket.connect();


function MultiplayerGame() {
  const [createGameMenu, setCreateGameMenu] = useState(true)
  const [myTurn, setMyTurn] = useState('')
  const [event, setEvent] = useState('')

  socket.on('start-game', (data: any) => {
    //players = {X: socket.id 1, O: socket.id 2}
    console.log('start game 1')
    setMyTurn(data.players.X === socket.id ? 'X' : 'O')
    setCreateGameMenu(false)
    setEvent('start-game')
  })

  return (
      <>
      <LeaveBtn />
      {createGameMenu && <CreateGame socket={socket} />}
      {!createGameMenu && <Game multiplayer={true} data={socket} myTurn={myTurn} event={event} setEvent={setEvent} />}
      </>
  )
}

export default MultiplayerGame