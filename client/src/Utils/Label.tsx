import { useContext } from "react"
import { gameContext } from "../Game/Game"
import { GameContextType } from "../Types/Grid.types"
import { TextCoin } from "../assets/ConnectCoin"

function Label({myTurn, opponent}: any) {
  const { turn, theme } = useContext(gameContext) as GameContextType

  return (
    <div className="text-2xl md:text-4xl inline-block m-2 items-center text-white font-semibold">
    {
    theme==='original'
    ?
    <b>
      Turn: {turn==='X'?'🗙':turn==='O'?'O':''}{myTurn===turn?'/ Your Turn':myTurn===''?'' : "/ Opponent's turn"}
      </b>
    :
    <b className="pb-2 text-3xl md:text-4xl font-normal">
        Turn:{turn === 'X' || turn === 'O' ? <TextCoin turn={turn} size={window.innerWidth < 768 ? 15 : 15} transform="0.25rem" /> : ''}{myTurn===turn?'/ Your Turn':myTurn===''?'' : `/ ${opponent}'s turn`}
    </b>
    }
    </div>
  )
}

export default Label