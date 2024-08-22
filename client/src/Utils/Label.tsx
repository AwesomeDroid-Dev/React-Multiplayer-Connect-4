import { useContext } from "react"
import { gameContext } from "../Game/Game"
import { GameContextType } from "../Types/Grid.types"

function Label({myTurn}: any) {
  const { turn, theme } = useContext(gameContext) as GameContextType

  return (
    <div className="text-2xl inline-block m-2 items-center">Turn: 
    {
    theme==='original'
    ?
    <b>
      {turn==='X'?'🗙':turn==='O'?'O':''}{myTurn===turn?'/ Your Turn':myTurn===''?'' : "/ Opponent's turn"}
      </b>
    :
    <b className="leading-8 pb-[3px] text-2xl font-normal">
      {turn === 'X' ? '🔴' : turn === 'O' ? '🔵' : ''}{myTurn===turn?'/ Your Turn':myTurn===''?'' : "/ Opponent's turn"}
    </b>
    }
    </div>
  )
}

export default Label