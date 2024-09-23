import { useEffect, useState } from "react";

function ConnectCoin({ color, size, responsive, cx, cy, sx, sy, transform, strokeSize }: { color: string, size: number, responsive: boolean, cx: number, cy: number, sx: number, sy: number, transform: string, strokeSize: number }) {
  const [objectSize, setObjectSize] = useState((responsive ? document.documentElement.clientWidth : 1 )*size)
  let scale = 3

  useEffect(() => {
    setObjectSize( ( responsive ? document.documentElement.clientWidth*1 : 1 )*size)
  }, [size, document.documentElement.clientWidth])

  return (
    <div className={'inline-block'} style={{transform: `translateY(${transform})`}}>
      <svg width={objectSize*scale*sx} height={objectSize*scale*sy} xmlns="http://www.w3.org/2000/svg">
        <circle cx={objectSize*scale*cx} cy={objectSize*scale*cy} r={objectSize} fill={color} />
        <circle cx={objectSize*scale*cx} cy={objectSize*scale*cy} r={objectSize} fill={'none'} stroke="white" strokeWidth={strokeSize} />
      </svg>
    </div>
  );
}

ConnectCoin.defaultProps = {
  color: "black",
  size: 0.03,
  responsive: false,
  cx: 0.5,
  cy: 0.5,
  sx: 1,
  sy: 1,
  transform: '0rem',
  strokeSize: 1
};

export function TextCoin({ turn, size, transform, strokeSize }: { turn: string, size: number, transform: string, strokeSize: number }) {
  const color = turn === 'X' ? 'red' : 'blue'
  return <ConnectCoin color={color} size={size} responsive={false} cy={0.35} sy={0.7} sx={0.9} transform={transform} strokeSize={strokeSize} />
}

TextCoin.defaultProps = {
  color: "black",
  size: 12,
  transform: '0rem',
  strokeSize: 1
}

export default ConnectCoin