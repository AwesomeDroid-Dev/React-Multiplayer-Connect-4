import { useContext } from "react"
import { gameContext } from "../Game/Game"

function UndoBtn() {
    const {moves, setMoves, setGrid, setTurn, setLatestChange} = useContext(gameContext)


    //example of moves: [[3, 'X'],[17, '']]

    function handleClick() {
        if (moves.length>0) {
            const latest = moves[moves.length-1]
            setGrid((g: any[]) => g.map((a: any,i: any) => i===latest[0] ? (latest[1]) : a))
            setMoves((m: any[]) => m.filter((_: any,i: number) => i!==moves.length-1))
            setTurn((t: string)=>t==='X'?'O':'X')
            setLatestChange(latest[0])
        }
    }

  return (
    <button onClick={handleClick} className="bg-slate-500 m-2 font-semibold float-right text-lg px-2 py-1 rounded-md text-gray-100 hover:bg-slate-400 ml-3">Undo</button>
  )
}

export default UndoBtn