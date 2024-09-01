import { useState } from "react";
import { Button, Input, Select } from "antd";
import { CopyToClipboard } from 'react-copy-to-clipboard';

function CreateGame({ socket }: any) {
    const [createGameCode, setCreateGameCode] = useState('Loading...');
    const [beginTurn, setBeginTurn] = useState('X');
    const [betweenGame, setBetweenGame] = useState('keep');
    const [textInputCode, setTextInputCode] = useState('');
    const [inviteInput, setInviteInput] = useState('');
    const [showInviteInput, setShowInviteInput] = useState(false);
    const [currentMenu, setCurrentMenu] = useState('default');
    const [invites, setInvites] = useState([]) as any;
    const [copied, setCopied] = useState(false);

    function handleCreateGame() {
        setCurrentMenu('createGame');
        setCreateGameCode('Loading...');
        socket.emit('create-game', { begin: beginTurn, turnSwitching: betweenGame });
    }

    function handleJoinGame(gameCode: any) {
        if (gameCode) {
            socket.emit('join-game', { gameCode });
            return;
        }
        socket.emit('join-game', { gameCode: textInputCode });
    }

    function handleInvite() {
        socket.emit('invite', { gameCode: createGameCode, username: inviteInput });
    }

    socket.on('invite', (data: any) => {
        setInvites((inv: any[]) => inv.filter((i: any) => i.sender !== data.sender));
        setInvites((i: any) => [...i, { sender: data.sender, gameCode: data.gameCode }]);
    });

    socket.on('create-game', (data: any) => {
        setCreateGameCode(data);
    });

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}></div>

            {/* Create Game Menu */}
            {
                currentMenu === 'createGame' &&
                <div className="relative z-10 flex flex-col items-center bg-gray-700 bg-opacity-60 backdrop-blur p-8 pb-4 rounded-lg shadow-lg transition-all">
                    <p className="text-6xl sm:text-8xl font-semibold text-white mb-6 transition-transform">{createGameCode.toLocaleUpperCase()}</p>
                    <div className="flex space-x-4 mb-4">
                        <CopyToClipboard text={createGameCode} onCopy={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                            <Button type="primary" className="px-6 py-3 text-lg sm:px-12 sm:py-6 sm:text-2xl text-white">
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </CopyToClipboard>
                        <Button onClick={() => setShowInviteInput(!showInviteInput)} type="primary" className="px-6 py-3 text-lg sm:px-12 sm:py-6 sm:text-2xl text-white bg-green-500 hover:!bg-green-400">
                            Invite
                        </Button>
                        <Button onClick={() => setCurrentMenu('default')} danger type="primary" className="px-6 py-3 text-lg sm:px-12 sm:py-6 sm:text-2xl text-white">
                            Close
                        </Button>
                    </div>
                    {showInviteInput && (
                        <div className="w-full flex space-x-4 h-12 sm:h-14">
                            <Input 
                                value={inviteInput} 
                                onChange={(e) => setInviteInput(e.target.value)}
                                className="flex-1 w-4/5 h-full p-3 text-lg sm:text-2xl rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                placeholder="Enter username to invite" 
                            />
                            <Button onClick={handleInvite} type="primary" className="w-1/5 h-full text-lg sm:text-2xl text-white bg-blue-600 hover:bg-blue-500 rounded-lg">
                                Invite
                            </Button>
                        </div>
                    )}
                </div>
            }

            {/* Settings Menu */}
            {
                currentMenu === 'settingMenu' &&
                <div className="relative z-10 bg-gray-700 bg-opacity-60 backdrop-blur p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <p className="text-4xl sm:text-6xl font-bold text-white mb-6">Game Options</p>
                    <div className="mb-4 w-full">
                        <label className="block text-lg sm:text-3xl text-white mb-2">Your Turn:</label>
                        <Select className="w-full sm:h-12" 
                            defaultValue={beginTurn}
                            onChange={(value: string) => setBeginTurn(value)} 
                            options={[
                                {value: 'X', label: <p className="sm:text-2xl">X</p>},
                                {value: 'O', label: <p className="sm:text-2xl">O</p>},
                            ]}
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <label className="block text-lg sm:text-3xl text-white mb-2">Turn Between Games:</label>
                        <Select className="w-full sm:h-12" 
                            defaultValue={betweenGame} 
                            onChange={(value: string) => setBetweenGame(value)} 
                            options={[
                                {value: 'keep', label: <p className="sm:text-2xl">Keep Turns</p>},
                                {value: 'switch', label: <p className="sm:text-2xl">Switch Turns</p>},
                                {value: 'winner', label: <p className="sm:text-2xl">Winner Begins</p>},
                                {value: 'loser', label: <p className="sm:text-2xl">Loser Begins</p>},
                            ]}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <Button onClick={handleCreateGame} type="primary" className="px-6 py-3 text-lg sm:px-12 sm:py-6 sm:text-2xl">
                            Create
                        </Button>
                        <Button onClick={() => setCurrentMenu('default')} danger type="primary" className="px-6 py-3 text-lg sm:px-12 sm:py-6 sm:text-2xl">
                            Close
                        </Button>
                    </div>
                </div>
            }

            {/* Default Menu */}
            {
                currentMenu === 'default' &&
                <div className="relative z-10p-8 h-full rounded-lg flex flex-col items-center justify-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-1">Create or Join a Game</h1>
                    <h3 className="text-lg text-white mb-8">Play a game with your friends!</h3>
                    <Button onClick={() => setCurrentMenu('settingMenu')} type="primary" className="w-3/4 h-10 md:h-14 mb-4 text-lg md:text-xl text-white">
                        Create Game
                    </Button>
                    <div className="flex space-x-4 w-3/4 mb-4 h-10 md:h-14">
                        <Input value={textInputCode} onChange={(e) => setTextInputCode(e.target.value)} 
                            type="text" 
                            className="flex-1 p-3 text-lg sm:text-xl rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:!ring-blue-500" 
                            placeholder="Enter Game ID"
                        />
                        <Button onClick={() => handleJoinGame(undefined)} type="primary" className="h-full w-1/4 text-lg md:text-xl text-white bg-green-600 hover:!bg-green-500">
                            Join
                        </Button>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mt-6 mb-4">Invitations for {localStorage.getItem('username')}</h1>
                    <div className="w-full max-h-[20vh] overflow-auto space-y-2 flex flex-col items-center">
                        {invites.length === 0 
                            ? <p className="text-white">No invitations</p> 
                            : invites.map(({ sender, gameCode }: any, i: number) => (
                                <div key={i} className="flex space-x-4 p-2 bg-gray-600 rounded-lg items-center">
                                    <p className="flex-1 text-white truncate">{sender} sent an invitation!</p>
                                    <Button onClick={() => handleJoinGame(gameCode)} type="primary" className="px-4 py-2 text-white">
                                        Join
                                    </Button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            }

            {/* Error Menu */}
            {
                currentMenu !== 'createGame' && currentMenu !== 'settingMenu' && currentMenu !== 'default' &&
                <div className="relative z-10 bg-gray-700 bg-opacity-60 backdrop-blur p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <p className="text-white text-lg">Something went wrong</p>
                </div>
            }
        </div>
    );
}

export default CreateGame;
