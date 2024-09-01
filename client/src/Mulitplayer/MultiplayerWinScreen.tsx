import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { GameContextType } from "../Types/Grid.types";
import { gameContext } from "../Game/Game";
import { TextCoin } from "../assets/ConnectCoin";

function MultiplayerWinScreen({socket}: any) {
    const [windowSize, setWindowSize] = useState(window) as any;
    const [requested, setRequested] = useState(false);
    const [recieved, setRecieved] = useState(false);
    const [code, setCode] = useState('')

    const { theme, winner } = useContext(gameContext) as GameContextType

    useEffect(()=>{setWindowSize(window)},[winner])

    socket.on('rematch', (data: string)=>{
        setRecieved(true)
        setCode(data)
    })
    
    function handleClick() {
        if (recieved) {
            socket.emit('accept-rematch', {gameCode:code})
            return;
        }
        socket.emit('request-rematch')
        setRequested(true)
    }

    return (
        <>
        <div className="select-none flex flex-col absolute h-screen w-screen z-50 bg-opacity-70 items-center justify-center font-bold text-7xl text-slate-800 bg-slate-200">
        <Confetti
        recycle={false}
        width={windowSize.innerWidth}
        height={windowSize.innerHeight}
        className="absolute -m-1"
        />
        {theme==='original'?
        <p className="-m-10">{winner===''?'Tie!':`${winner} Wins!`}</p>
        :
        <>
        <b className="leading-8 pb-[3px] text-7xl font-bold">
        {winner === '' ? 'Tie!' : <TextCoin size={30} turn={winner} transform="0.5rem" />}{winner !== 'none' ? ' Wins!' : ''}
        </b>
        </>
        }<br/>
        <div className="flex flex-row gap-3">
        {!requested?
        <button onClick={handleClick} className="bg-slate-500 p-2 text-xl font-normal text-gray-200 hover:bg-slate-400 rounded-md">{recieved?'Accept Rematch':'Request Rematch'}</button>
        :
        <p className="bg-green-700 p-2 text-xl font-normal text-gray-200 rounded-md">Request Sent!</p>
        }
        <button onClick={() => window.location.reload()} className="bg-slate-500 p-2 text-xl font-normal text-gray-200 hover:bg-slate-400 rounded-md">Back To Home</button>
        </div>
        </div>
        </>
    )
}

export default MultiplayerWinScreen