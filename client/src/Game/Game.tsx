import { createContext, useEffect, useState } from 'react';
import Grid from '../Grid/Grid';
import Label from '../Utils/Label'
import { GameContextType } from '../Types/Grid.types';
import WinScreen from '../Utils/WinScreen';
import UndoBtn from '../Utils/UndoBtn';
import LeaveBtn from '../Utils/LeaveBtn';

export const gameContext: React.Context<any> = createContext(null)

function Game({multiplayer, data, myTurn}: any) {
  const [grid, setGrid] = useState(Array.from({ length: 42 }).map(()=>''))
  const [turn, setTurn] = useState('X')
  const [latestChange, setLatestChange] = useState(-1);
  const [moves, setMoves] = useState([])
  const [theme, setTheme] = useState('new')
  const [event, setEvent] = useState('')

  useEffect(() => {
    if (multiplayer) {
      data.on('play', (data: any) => {
        console.log(data)
        setTurn(data.turn)
        setGrid(data.grid)
        setLatestChange(data.latestChange)
      })
    }
  }, [multiplayer, data])

  useEffect(() => {
    if (multiplayer && latestChange !== -1) {
      data.emit('play', {latestChange})
      setEvent('')
    }
  }, [event])

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
        setTheme,
        event,
        setEvent
      } as GameContextType
    }>
      <div className='flex items-center justify-center w-screen h-screen flex-col p-[5vw]'>
        <WinScreen/>
        <LeaveBtn />
        <div className='w-full h-12 items-center z-10'>
          <Label myTurn={myTurn} />
          <UndoBtn/>
        </div>
        <Grid myTurn={myTurn} />
      </div>

    </gameContext.Provider>
    </>
  );
}

Game.defaultProps = {
  multiplayer: false,
  data: null,
  myTurn: ''
}

export default Game
