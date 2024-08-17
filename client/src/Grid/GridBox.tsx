import { useState, useEffect, useContext } from 'react';
import { gameContext } from '../Game/Game';
import { GameContextType } from '../Types/Grid.types';

function GridBox(props: { handleClick: (arg0: any) => void; index: number; text: 'X'|'O'|'' }) {
  const {theme} = useContext(gameContext) as GameContextType
  const [animate, setAnimate] = useState(false);
  const [text, setText] = useState('')

  useEffect(() => {
    setText(props.text)
    if (props.text) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [props.text]);

  return (
    <div
        onClick={() => props.handleClick(props.index)}
        className={theme==='new'
          ?
          `relative w-[10vw] h-[10vw] bg-yellow-400 border border-gray-400 rounded-md hover:cursor-pointer flex items-center justify-center`
          :
          `relative w-[10vw] h-[10vw] bg-blue-500 text-3xl font-bold text-white hover:cursor-pointer`
        }
    >
      { theme==='new' ?
        <div className={`text-4xl flex items-center justify-center translate-y-[-1.9px] font-bold select-none ${animate ? 'animate-fall' : ''}`}>
            {text === 'X' ? '🔴' : text === 'O' ? '🔵' : ''}
        </div>
        :
        <div className={`absolute inset-0 flex items-center select-none translate-y-[-1.9px] justify-center ${animate ? 'animate-fall' : ''}`}>
            {text === 'X' ? '🗙' : text === 'O' ? 'O' : ''}
        </div>
      }
    </div>
  );
}

export default GridBox;
