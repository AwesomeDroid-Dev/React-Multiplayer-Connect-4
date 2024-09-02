import { useContext, useEffect, useState } from "react"
import { gameContext } from "../Game/Game"
import { GameContextType, XO } from "../Types/Grid.types"
import Confetti from 'react-confetti'
import { TextCoin } from "../assets/ConnectCoin"
import { Button } from "antd"

function WinScreen({multiplayer}: any) {
    const { setTurn, setMoves, setGrid, grid, latestChange, theme, winner, setWinner } = useContext(gameContext) as GameContextType
    const [windowSize, setWindowSize] = useState(window) as any;
    const [show, setShow] = useState(false)

    useEffect(()=>{
        if (multiplayer) {
            if (winner!=='none') {
                setShow(true)
                setWindowSize(window)
            }
            return;
        }
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
        if (!grid.includes('')) {
            setShow(true)
            setWinner('')
            setWindowSize({
                innerHeight: 0,
                innerWidth: 0,
            })
        }
    }, [latestChange, winner])

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
        setGrid(Array(42).fill(''))
        setMoves([])
        setTurn('X')
    }

  return (
    <>
    {show&&<div className="select-none flex flex-col absolute h-screen w-screen z-50 bg-opacity-70 items-center justify-center font-bold text-7xl text-gray-800 bg-gray-800">
        <Confetti
        recycle={false}
        width={windowSize.innerWidth}
        height={windowSize.innerHeight}
        className="absolute -m-1"
        />
        {theme==='original'?
        <p className="-m-10">{winner===''?'Tie!':`${winner} Wins!`}</p>
        :
        <b className="leading-8 pb-[3px] text-white text-7xl font-bold">
            {winner === '' ? 'Tie!' : <TextCoin size={30} turn={winner} transform="0.5rem" strokeSize={2} />}{winner !== 'none' ? ' Wins!' : ''}
        </b>
        }<br/>
        <Button onClick={handleClick} type="primary" className="p-5 text-xl font-normal bg-green-600 hover:!bg-green-500">Play Again!</Button>
        </div>}
    </>
  )
}

export default WinScreen