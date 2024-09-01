import { useState, useEffect, useContext } from 'react';
import { gameContext } from '../Game/Game';
import { GameContextType } from '../Types/Grid.types';
import ConnectCoin from '../assets/ConnectCoin';

// MAKE IT FALL FROM THE POSITION OF THE CLICK OR FROM THE TOP OF THE 

function GridBox(props: { handleClick: (arg0: any) => void; index: number; text: 'X'|'O'|'', gridSize: number }) {
  const {theme} = useContext(gameContext) as GameContextType
  const [animate, setAnimate] = useState(false);
  const [text, setText] = useState('')

  useEffect(() => {
    setText(props.text)
    if (props.text) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 20); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [props.text]);

  return (
    <div
        onClick={() => props.handleClick(props.index)}
        className={theme==='new'
          ?
          `relative w-full aspect-square bg-yellow-400 border border-gray-400 rounded-md hover:cursor-pointer flex items-center justify-center`
          :
          `relative w-full aspect-square bg-blue-500 text-3xl font-bold text-white hover:cursor-pointer`
        }
    >
      { theme==='new' ?
        <div 
        className={`pb-[3px] text-4xl absolute flex items-center justify-center select-none transition-transform ease-in`}
        style={{
          transform: `translateY(${animate ? `${-11 * (Math.floor(props.index / 7) + 0.5)}vh` : '0%'})`,
          transitionDuration: `${animate ? '0s' : `${300+(Math.floor(props.index/7)*50)}ms`}`,
        }}
      >
            {text === 'X' ? <ConnectCoin color='red' size={props.gridSize/20} transform='0.1rem' responsive={false} /> : text === 'O' ? <ConnectCoin color='blue' size={props.gridSize/20} transform='0.1rem' responsive={false} /> : ''}
        </div>
        :
        <div 
        className={'absolute inset-0 flex items-center select-none justify-center transition-transform ease-in'}
        style={{
          transform: `translateY(${animate ? `${-100 * (Math.floor(props.index / 7) + 0.5)}%` : '0%'})`,
          transitionDuration: `${animate ? '0s' : `${300+(Math.floor(props.index/7)*50)}ms`}`,
        }}
        >
            {text === 'X' ? '🗙' : text === 'O' ? 'O' : ''}
        </div>
      }
    </div>
  );
}

export default GridBox;

