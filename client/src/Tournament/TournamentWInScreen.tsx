import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { GameContextType } from "../Types/Grid.types";
import { gameContext } from "../Game/Game";
import { TextCoin } from "../assets/ConnectCoin";
import { Button } from "antd";

function TournamentWinScreen({socket}: any) {
    const [windowSize, setWindowSize] = useState(window) as any;
    const [code, setCode] = useState('')

    const { theme, winner } = useContext(gameContext) as GameContextType

    useEffect(()=>{setWindowSize(window)},[winner])

    socket.on('rematch', (data: string)=>{
        setCode(data)
    })
    
    function handleClick() {
        socket.emit('next-round', {gameCode:code})
    }
    
    socket.on('next-round', (data: { status: string; message: string; })=>{
        if (data.status==='error')
            window.alert(data.message)
    })

    return (
        <>
        <div className="select-none flex flex-col absolute h-screen w-screen z-50 bg-opacity-70 items-center justify-center font-bold text-7xl text-gray-800 bg-gray-800">
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
        <b className="leading-8 pb-[3px] text-7xl font-bold text-white">
        {winner === '' ? 'Tie!' : <TextCoin size={30} turn={winner} transform="0.5rem" />}{winner !== 'none' ? ' Wins!' : ''}
        </b>
        </>
        }<br/>
        <div className="flex flex-row gap-3">
        <Button onClick={handleClick} type="primary" className="py-5 px-2 text-xl font-normal rounded-md">Next Round</Button>
        <Button onClick={() => window.location.reload()} type="primary" danger className="py-5 px-2 text-xl font-normal rounded-md">Back To Home</Button>
        </div>
        </div>
        </>
    )
}

export default TournamentWinScreen