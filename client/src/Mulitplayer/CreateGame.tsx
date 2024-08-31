import { useState } from "react";
import { Button, Input, Select } from "antd";
import {CopyToClipboard} from 'react-copy-to-clipboard';

function CreateGame({socket}: any) {
    const [createGameCode, setCreateGameCode] = useState('Loading...')
    const [beginTurn, setBeginTurn] = useState('X')
    const [betweenGame, setBetweenGame] = useState('keep')
    const [textInputCode, setTextInputCode] = useState('')
    const [inviteInput, setInviteInput] = useState('')
    const [showInviteInput, setShowInviteInput] = useState(false)
    const [currentMenu, setCurrentMenu] = useState('default')
    const [invites, setInvites] = useState([]) as any
    const [copied, setCopied] = useState(false)

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
<div className="flex justify-center items-center w-screen h-screen bg-gray-800">
    <div className="absolute inset-0 bg-opacity-70 bg-gray-900 z-0"></div>
    {
    currentMenu === 'createGame' &&
    <div className="relative z-10 flex flex-col items-center bg-gray-700 p-8 pb-4 rounded-lg shadow-lg transition-all">
        <p className="text-4xl font-semibold text-white mb-6">{createGameCode.toLocaleUpperCase()}</p>
        <div className="flex space-x-4 mb-4">
            <CopyToClipboard text={createGameCode} onCopy={() => {
                setCopied(true); 
                setTimeout(() => setCopied(false), 2000);
            }}>
                <Button className="px-6 py-2 text-lg text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
                    {copied ? 'Copied!' : 'Copy'}
                </Button>
            </CopyToClipboard>
            <Button onClick={() => setShowInviteInput(!showInviteInput)} className="px-6 py-2 text-lg text-white bg-green-500 hover:bg-green-600 rounded-lg">
                Invite
            </Button>
            <Button onClick={() => setCurrentMenu('default')} className="px-6 py-2 text-lg text-white bg-red-500 hover:bg-red-600 rounded-lg">
                Close
            </Button>
        </div>
        {showInviteInput && (
            <div className="w-full flex space-x-4 h-[3rem]">
                <Input 
                    value={inviteInput} 
                    onChange={(e) => setInviteInput(e.target.value)}
                    className="flex-1 h-full p-3 text-lg rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter username to invite" 
                />
                <Button onClick={handleInvite} className="h-full text-lg text-white bg-blue-500">
                    Invite
                </Button>
            </div>
        )}
    </div>
    }
    {
    currentMenu === 'settingMenu' &&
    <div className="relative z-10 bg-gray-700 p-8 rounded-lg shadow-lg flex flex-col items-center">
        <p className="text-3xl font-bold text-white mb-6">Game Options</p>
        <div className="mb-4 w-full">
            <label className="block text-lg text-white mb-2">Your Turn:</label>
            <Select className="w-full" 
                defaultValue={beginTurn} 
                onChange={(e: any) => setBeginTurn(e.value)} 
                options={[
                    {value: 'X', label: 'X'},
                    {value: 'O', label: 'O'},
                ]}
            />
        </div>
        <div className="mb-4 w-full">
            <label className="block text-lg text-white mb-2">Turn Between Games:</label>
            <Select className="w-full" 
                defaultValue={betweenGame} 
                onChange={(e: any) => setBetweenGame(e.value)} 
                options={[
                    {value: 'keep', label: 'Keep Turns'},
                    {value: 'switch', label: 'Switch Turns'},
                    {value: 'winner', label: 'Winner Begins'},
                    {value: 'loser', label: 'Loser Begins'},
                ]}
            />
        </div>
        <div className="flex space-x-4">
            <Button onClick={handleCreateGame} className="px-6 py-3 text-lg bg-blue-500">
                Create
            </Button>
            <Button onClick={() => setCurrentMenu('default')} className="px-6 py-3 text-lg bg-red-500">
                Close
            </Button>
        </div>
    </div>
    }
    {
    currentMenu === 'default' &&
    <div className="relative z-10 bg-gray-700 p-8 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-6">Create or Join a Game</h1>
        <Button onClick={() => setCurrentMenu('settingMenu')} className="w-full h-full mb-4 text-lg text-white bg-blue-500">
            Create Game
        </Button>
        <div className="flex space-x-4 w-full mb-4 h-[2.5rem]">
            <Input value={textInputCode} onChange={(e) => setTextInputCode(e.target.value)} 
                type="text" 
                className="flex-1 p-3 text-lg rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter Game ID"
            />
            <Button onClick={() => handleJoinGame(undefined)} className="h-full w-1/4 text-lg bg-green-500">
                Join
            </Button>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Invitations for {localStorage.getItem('username')}</h1>
        <div className="w-full max-h-[20vh] overflow-auto space-y-2">
            {invites.length === 0 
                ? <p className="text-white">No invitations</p> 
                : invites.map(({sender, gameCode}: any, i: number) => (
                    <div key={i} className="flex space-x-4 p-2 bg-gray-600 rounded-lg items-center">
                        <p className="flex-1 text-white truncate">{sender} sent an invitation!</p>
                        <Button onClick={() => handleJoinGame(gameCode)} className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
                            Join
                        </Button>
                    </div>
                ))
            }
        </div>
    </div>
    }
    {
    currentMenu !== 'createGame' && currentMenu !== 'settingMenu' && currentMenu !== 'default' &&
    <div className="relative z-10 bg-gray-700 p-8 rounded-lg shadow-lg flex flex-col items-center">
        <p className="text-white text-lg">Something went wrong</p>
    </div>
    }
</div>
    );
}

export default CreateGame