import { createContext, useEffect, useState } from 'react';
import Grid from '../Grid/Grid';
import Label from '../Utils/Label'
import { GameContextType } from '../Types/Grid.types';
import WinScreen from '../Utils/WinScreen';
import UndoBtn from '../Utils/UndoBtn';
import MultiplayerWinScreen from '../Mulitplayer/MultiplayerWinScreen';
import TournamentWinScreen from '../Tournament/TournamentWInScreen';

export const gameContext: React.Context<any> = createContext(null)

function Game({multiplayer, data, myTurn, event, setEvent, defTurn, defGrid, tournament, opponent}: any) {
  const [grid, setGrid] = useState(defGrid)
  const [turn, setTurn] = useState(defTurn)
  const [latestChange, setLatestChange] = useState(-1);
  const [moves, setMoves] = useState([])
  const [theme, setTheme] = useState('new')
  const [winner, setWinner] = useState('none')

  useEffect(() => {
    if (multiplayer) {
      data.on('play', (data: any) => {
        console.log('play')
        setTurn(data.turn)
        setGrid(data.grid)
        setLatestChange(data.latestChange)
      })
      data.on('win', (data: any) => {
        console.log(data)
        setWinner(data)
      })
      data.on('grid', (data: any) => {
        console.log('grid')
        setGrid(data)
      })
      data.on('turn', (data: any) => {
        console.log('turn: ' + data)
        setTurn(data)
      })
    }
  }, [multiplayer, data])

  useEffect(() => {
    if (multiplayer) {
      setGrid(defGrid)
      setTurn(defTurn)
    }
  }, [defGrid, defTurn])

  useEffect(() => {
    if (multiplayer) {
      if (event === 'play') {
        data.emit('play', {latestChange})
      } else if (event === 'undo') {
        //add stuff
      } else if (event === 'start-game') {
        setWinner('none')
        setGrid(defGrid)
        setTurn(defTurn)
      }
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
        winner,
        setWinner,
        event,
        setEvent,
      } as GameContextType
    }>
      <div className='flex items-center justify-center w-screen h-screen flex-col p-[5vw] bg-gray-800'>
        {winner!=='none' && multiplayer
        ? 
        tournament
        
        ?
        <TournamentWinScreen socket={data} />
        :
        <MultiplayerWinScreen socket={data} />

        :
        <WinScreen multiplayer={multiplayer} />
        }
        <div className='w-full h-12 items-center z-10'>
          <Label myTurn={myTurn} opponent={opponent} />
          {!multiplayer && <UndoBtn/>}
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
  myTurn: '',
  event: '',
  setEvent: () => {},
  defTurn: 'X',
  defGrid: Array(42).fill(''),
  tournament: false,
  opponent: 'opponent',
}

export default Game
