import { useContext } from "react"
import { gameContext } from "../Game/Game"
import { GameContextType } from "../Types/Grid.types"

function Label() {
  const { turn } = useContext(gameContext) as GameContextType

  return (
    <div className="text-2xl inline-block m-2 items-center">Turn: <b>{turn==='X'?'🗙':turn==='O'?'O':''}</b></div>
  )
}

export default Label