import CreateGame from "../Game/CreateGame";
import Game from "../Game/Game"
import io from "socket.io-client"
import LeaveBtn from "../Utils/LeaveBtn";
import { useState } from "react";

const socket = io('http://localhost:5000')
socket.connect();


function MultiplayerGame() {
  const [createGameMenu, setCreateGameMenu] = useState(true)
  const [myTurn, setMyTurn]: any = useState('')

  socket.on('start-game', (data: any) => {
    //players = {X: socket.id 1, O: socket.id 2}
    setMyTurn(data.players.X === socket.id ? 'X' : 'O')
    setCreateGameMenu(false)
  })

  return (
      <>
      <LeaveBtn />
      {createGameMenu && <CreateGame socket={socket} />}
      {!createGameMenu && <Game multiplayer={true} data={socket} myTurn={myTurn} />}
      </>
  )
}

export default MultiplayerGame