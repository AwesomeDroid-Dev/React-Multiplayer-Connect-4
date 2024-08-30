import { useState } from "react";

function CreateGame({socket}: any) {
    const [createGameCode, setCreateGameCode] = useState('Loading...')
    const [beginTurn, setBeginTurn] = useState('X')
    const [betweenGame, setBetweenGame] = useState('keep')
    const [textInputCode, setTextInputCode] = useState('')
    const [inviteInput, setInviteInput] = useState('')
    const [showInviteInput, setShowInviteInput] = useState(false)
    const [currentMenu, setCurrentMenu] = useState('default')
    const [invites, setInvites] = useState([]) as any

    function handleCreateGame() {
        setCurrentMenu('createGame')
        setCreateGameCode('Loading...')
        socket.emit('create-game', {begin: beginTurn, turnSwitching: betweenGame})
    }

    function handleJoinGame(gameCode: any) {
        if (gameCode) {
            socket.emit('join-game', {gameCode: gameCode})
            return;
        }
        socket.emit('join-game', {gameCode: textInputCode})
    }

    function handleInvite() {
        socket.emit('invite', {gameCode: createGameCode, username: inviteInput})
    }

    socket.on('invite', (data: any) => {
        setInvites((inv: any[]) => inv.filter((i: any) => i.sender !== data.sender))
        setInvites((i: any) => [...i, {sender: data.sender, gameCode: data.gameCode}])
    })

    socket.on('create-game', (data: any) => {
        setCreateGameCode(data)
    })

    return (
        <div>
            {
            currentMenu === 'createGame'
            ?
            <>
            <div className="absolute top-0 left-0 w-screen h-screen bg-black opacity-70"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[40vw] text-5xl text-white bg-slate-500 rounded-md p-4 flex flex-col gap-4">
                <p className="text-center">{createGameCode.toLocaleUpperCase()}</p>
                <div className="flex flex-row gap-2 w-full">
                    <button onClick={() => navigator.clipboard.writeText(createGameCode)} className="bg-slate-700 hover:bg-slate-900 w-2/3 text-lg text-white font-bold py-2 px-4 rounded">Copy</button>
                    <button onClick={() => setShowInviteInput(!showInviteInput)} className="bg-slate-700 hover:bg-slate-900 text-lg text-white font-bold w-2/3 py-2 px-4 rounded">Invite</button>
                    <button onClick={() => setCurrentMenu('default')} className="bg-slate-700 hover:bg-slate-900 text-lg text-white font-bold py-2 px-4 rounded">Close</button>
                </div>
                {
                showInviteInput
                &&
                <div className="w-full flex flex-row gap-2">
                    <input 
                        type="text" 
                        value={inviteInput} 
                        onChange={(e) => setInviteInput(e.target.value)}
                        className="w-full p-2 text-white text-lg rounded-md bg-slate-700 hover:bg-slate-900" 
                        placeholder="Enter username to invite" 
                    />
                    <button onClick={handleInvite} className="w- bg-slate-700 hover:bg-slate-900 text-lg text-white font-bold py-2 px-4 rounded">Invite</button>
                </div>
                }
            </div>
            </>
            :
            currentMenu === 'settingMenu'
            ?
            <>
            <div className="absolute top-0 left-0 w-screen h-screen bg-black opacity-70"></div>
            <div className="flex flex-col absolute h-screen w-screen z-50 items-center justify-center">
                <div className="text-white bg-slate-500 rounded-md px-[20vh] pt-[4vh] pb-[4vh] flex flex-col gap-4">
                    <p className="text-center text-3xl font-bold">Game Options</p>
                    <span className="text-center text-2xl">Your turn:</span>
                    <select value={beginTurn} onChange={(e) => setBeginTurn(e.target.value)} className="bg-slate-700 hover:bg-slate-900 text-lg text-white font-bold py-2 px-4 rounded">
                        <option value="X">X</option>
                        <option value="O">O</option>
                    </select>
                    <p className="text-center text-2xl">Turn Between Games:</p>
                    <select value={betweenGame} onChange={(e) => setBetweenGame(e.target.value)} className="bg-slate-700 hover:bg-slate-900 text-lg text-white font-bold py-2 px-4 rounded">
                        <option value="keep">Keep Turns</option>
                        <option value="switch">Switch Turns</option>
                        <option value="winner">Winner Begins</option>
                        <option value="loser">Loser Begins</option>
                    </select>
                    <div className="flex flex-row gap-2">
                        <button onClick={handleCreateGame} className="bg-slate-700 hover:bg-slate-900 text-lg text-white font-bold py-2 px-4 rounded">Create</button>
                        <button onClick={() => setCurrentMenu('default')} className="bg-slate-700 hover:bg-slate-900 text-lg text-white font-bold py-2 px-4 rounded">Close</button>
                    </div>
            </div>
            </div>
            </>
            :
            currentMenu === 'default'
            ?
            <div className="flex justify-center items-center h-screen w-screen">
                <div className="bg-slate-500 text-white rounded-md p-4">
                    <h1 className="text-3xl font-bold mb-4">Create Game</h1>
                    <div className="flex flex-col space-y-2">
                        <button onClick={() => setCurrentMenu('settingMenu')} className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded">
                            Create Game
                        </button>
                        <div className="flex flex-row space-x-2">
                        <input value={textInputCode} onChange={(e) => setTextInputCode(e.target.value)} type="text" className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded w-3/4" placeholder="Enter Game ID"/>
                        <button onClick={() => handleJoinGame(undefined)} className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded w-1/4">
                            Join
                        </button>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mt-4">Invitations for {localStorage.getItem('username')}</h1>
                    <hr/>
                    <div className="flex flex-col space-y-2 max-h-[20vh] overflow-auto">
                        {
                            invites.length === 0
                            ?
                            <p>No invitations</p>
                            :
                            null
                        }
                        {
                            invites.map(({sender, gameCode}: any, i: number) => 
                            <div key={i} className="flex flex-row space-x-1 p-1 pb-0">
                                <p className="w-2/3 bg-slate-700 p-2 rounded">Invitation from {sender}</p>
                                <button onClick={() => handleJoinGame(gameCode)} className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded w-1/3">Join</button>
                            </div>
                            )}
                    </div>
                </div>
            </div>
            :
            <div>Something went wrong</div>
            }
        </div>
    );
}

export default CreateGame