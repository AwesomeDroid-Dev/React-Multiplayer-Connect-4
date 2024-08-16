import { useContext } from 'react';
import { gameContext } from '../Game/Game'
import GridBox from './GridBox';
import { GameContextType, XO } from '../Types/Grid.types';

function Grid() {
  const {grid, setGrid, turn, setTurn, setLatestChange, setMoves } = useContext(gameContext) as GameContextType;

  function handleClick(index:number) {
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
      <div className="grid grid-cols-7 w-full gap-[1.5%] md:gap-2 max-w-screen-sm p-2">
        {grid.map((_: XO, index: number) => (
          <GridBox key={index} index={index} handleClick={handleClick} text={grid[index]} />
        ))}
      </div>
  );
}

export default Grid
