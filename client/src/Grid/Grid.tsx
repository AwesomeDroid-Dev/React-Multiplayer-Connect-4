import { useContext, useEffect, useState } from 'react';
import { gameContext } from '../Game/Game'
import GridBox from './GridBox';
import { GameContextType, XO } from '../Types/Grid.types';

function Grid({myTurn}: any) {
  const {grid, setGrid, turn, setTurn, setLatestChange, setEvent, setMoves } = useContext(gameContext) as GameContextType;
  const [gridSize, setGridSize] = useState(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9))

  useEffect(() => {
    function handleResize() {
      setGridSize(Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9))
    }
    window.addEventListener('resize', handleResize)
  }, [])

  function handleClick(index:number) {
    if (myTurn !== '' && turn !== myTurn) return;
    setEvent('play')

    let column: number = (index%7)
    let workingRow: (number|undefined) = [...Array(6).keys()].map((i)=>i*7).reverse().find((s)=>{return grid[s+column]===''});
    
    if (typeof workingRow === 'number') {
      index = workingRow+column
      setLatestChange(index)
      setMoves((m: any) => [...m, [index, grid[index] ]])
      setGrid((g: XO[]) => g.map((c: XO,i: number)=>i===index?turn:c))
      setTurn(t=>t==='X'?'O':'X')
    }
  }

  return (
      <div className="grid grid-cols-7 max-h-[90vh] gap-[1.5%] md:gap-2 max-w-screen-sm p-2"
      style={{width: `${gridSize}px`}}
      >
        {grid.map((_: XO, index: number) => (
          <GridBox key={index} index={index} handleClick={handleClick} text={grid[index]} />
        ))}
      </div>
  );
}

export default Grid
