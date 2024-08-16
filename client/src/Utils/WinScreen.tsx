import { useContext, useEffect, useState } from "react"
import { gameContext } from "../Game/Game"
import { GameContextType, XO } from "../Types/Grid.types"
import Confetti from 'react-confetti'

function WinScreen() {
    const { setTurn, setMoves, setGrid, grid, latestChange } = useContext(gameContext) as GameContextType
    const [windowSize, setWindowSize] = useState(window) as any;
    const [show, setShow] = useState(false)
    const [winner, setWinner] = useState('X')

    useEffect(()=>{
        let playType: XO = grid[latestChange]

        const lat = latestChange

        const isWinner = (
            playType!==''?checkWin(grid,lat,playType):false
        );

        if (isWinner) {
            setShow(true)
            setWinner(playType)
            setWindowSize(window)
        }
        console.log(grid)
        if (!grid.includes('')) {
            setShow(true)
            setWinner('')
            setWindowSize({
                innerHeight: 0,
                innerWidth: 0,
            })
        }
    }, [latestChange])

    function checkWin(board: XO[], index: number, player: XO) {
        const directions = [
            { x: 1, y: 0 },  // Horizontal
            { x: 0, y: 1 },  // Vertical
            { x: 1, y: 1 },  // Diagonal Positive Slope
            { x: 1, y: -1 }  // Diagonal Negative Slope
        ];
    
        const cols = 7;
        const rows = 6;
        
        // Convert index to row and column
        const col = index % cols;
        const row = Math.floor(index / cols);
    
        const inBounds = (r: number, c:number ) => r >= 0 && r < rows && c >= 0 && c < cols;
        const getBoardValue = (r: number, c: number) => board[r * cols + c];
    
        for (let { x, y } of directions) {
            let count = 1;
    
            // Check in the positive direction
            let r = row + y;
            let c = col + x;
            while (inBounds(r, c) && getBoardValue(r, c) === player) {
                count++;
                if (count === 4) return true;
                r += y;
                c += x;
            }
    
            // Check in the negative direction
            r = row - y;
            c = col - x;
            while (inBounds(r, c) && getBoardValue(r, c) === player) {
                count++;
                if (count === 4) return true;
                r -= y;
                c -= x;
            }
        }
        return false;
    }

    function handleClick() {
        setShow(false)
        setGrid(Array.from({ length: 42 }).map(()=>''))
        setMoves([])
        setTurn('X')
    }

  return (
    <>
    {show&&<div className="select-none flex flex-col absolute h-screen w-screen z-50 bg-opacity-70 items-center justify-center font-bold text-7xl text-slate-800 bg-slate-200">
        <Confetti
        recycle={false}
        width={windowSize.innerWidth}
        height={windowSize.innerHeight}
        className="absolute -m-1"
        />
        <p className="-m-10">{winner===''?'Tie!':`${winner} Wins!`}</p><br/>
        <button onClick={handleClick} className="bg-slate-500 p-2 text-xl font-normal text-gray-200 hover:bg-slate-400 rounded-md">Play Again!</button>
        </div>}
    </>
  )
}

export default WinScreen