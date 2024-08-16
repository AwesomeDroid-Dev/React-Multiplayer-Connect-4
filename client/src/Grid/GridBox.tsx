import { useState, useEffect } from 'react';

function GridBox(props: { handleClick: (arg0: any) => void; index: number; text: 'X'|'O'|'' }) {
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
        className={`relative w-full pt-[100%] bg-blue-500 text-3xl font-bold text-white hover:cursor-pointer`}
    >
        <div className={`absolute inset-0 flex items-center select-none justify-center ${animate ? 'animate-fall' : ''}`}>
            {text === 'X' ? '🗙' : text === 'O' ? 'O' : ''}
        </div>
    </div>
  );
}

export default GridBox;
