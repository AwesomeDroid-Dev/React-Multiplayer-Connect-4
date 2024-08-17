import { createContext, useState } from 'react';
import Grid from '../Grid/Grid';
import Label from '../Utils/Label'
import { GameContextType } from '../Types/Grid.types';
import WinScreen from '../Utils/WinScreen';
import UndoBtn from '../Utils/UndoBtn';
import LeaveBtn from '../Utils/LeaveBtn';

export const gameContext: React.Context<any> = createContext(null)


//Add settting 'Color Mode'


function App() {
  const [grid, setGrid] = useState(Array.from({ length: 42 }).map(()=>''))
  const [turn, setTurn] = useState('X')
  const [latestChange, setLatestChange] = useState(-1);
  const [moves, setMoves] = useState([])
  const [theme, setTheme] = useState('original')

  return (
    <>
    <gameContext.Provider value={
      {
        grid,
        setGrid,
        turn,
        setTurn,
        latestChange,
        setLatestChange,
        moves,
        setMoves,
        theme,
        setTheme
      } as GameContextType
    }>
      <div className='flex items-center justify-center h-screen flex-col p-[5vw]'>
        <WinScreen/>
        <LeaveBtn />
        <div className='w-full h-12 items-center z-10'>
          <Label/>
          <UndoBtn/>
        </div>
        <Grid/>
      </div>

    </gameContext.Provider>
    </>
  );
}

export default App
