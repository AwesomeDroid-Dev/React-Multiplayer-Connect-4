import { useState } from "react";


function CreateGame({socket}: any) {
    const [showCreateGame, setShowCreateGame] = useState(false)
    const [createGameCode, setCreateGameCode] = useState('Loading...')
    const [textInputCode, setTextInputCode] = useState('')

    function handleCreateGame() {
        setShowCreateGame(true)
        setCreateGameCode('Loading...')
        socket.emit('create-game')
    }

    function handleJoinGame() {
        socket.emit('join-game', {gameCode: textInputCode})
    }

    socket.on('create-game', (data: any) => {
        setCreateGameCode(data)
    })

    return (
        <div>
            {
            showCreateGame&&
            <>
            <div className="absolute top-0 left-0 w-screen h-screen bg-black opacity-70"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-white bg-slate-500 rounded-md p-4 flex flex-col gap-4">
            <p className="text-center">{createGameCode.toLocaleUpperCase()}</p>
            <div className="flex flex-row gap-2">
                <button onClick={() => navigator.clipboard.writeText(createGameCode)} className="bg-slate-700 hover:bg-slate-900 text-lg text-white font-bold py-2 px-4 rounded">Copy Code</button>
                <button onClick={() => setShowCreateGame(false)} className="bg-slate-700 hover:bg-slate-900 text-lg text-white font-bold py-2 px-4 rounded">Close</button>
            </div>
            </div>
            </>
            }


            <div className="flex justify-center items-center h-screen">
                <div className="bg-slate-500 text-white rounded-md p-4">
                    <h1 className="text-3xl font-bold mb-4">Create Game</h1>
                    <div className="flex flex-col  space-y-2">
                        <button onClick={handleCreateGame} className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded">
                            Create Game
                        </button>
                        <div className="flex flex-row space-x-2">
                        <input value={textInputCode} onChange={(e) => setTextInputCode(e.target.value)} type="text" className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded" placeholder="Enter Game ID"/>
                        <button onClick={handleJoinGame} className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded">
                            Join
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateGame