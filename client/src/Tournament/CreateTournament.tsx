import { useState } from "react";
import { Button, Input, InputNumber, Select } from "antd";
import { CopyToClipboard } from 'react-copy-to-clipboard';

function CreateTournament({ socket }: any) {
    const [createGameCode, setCreateGameCode] = useState('Loading...');
    const [betweenGame, setBetweenGame] = useState('keep');
    const [textInputCode, setTextInputCode] = useState('');
    const [inviteInput, setInviteInput] = useState('');
    const [currentMenu, setCurrentMenu] = useState('default');
    const [invites, setInvites] = useState([]) as any;
    const [copied, setCopied] = useState(false);
    const [playerCount, setPlayerCount] = useState(4);
    const [players, setPlayers] = useState(['You']) as any;

    function handleCreateTournament() {
        setCurrentMenu('createGame');
        setCreateGameCode('Loading...');
        socket.emit('create-tournament', { playerCount: playerCount });
    }

    function handleJoinTournament(gameCode: any) {
        if (gameCode) {
            socket.emit('join-tournament', { tournament: gameCode });
            return;
        }
        socket.emit('join-tournament', { tournament: textInputCode });
    }

    function handleJoinGame(gameCode: any) {
        if (gameCode) {
            socket.emit('join-game', { gameCode });
            return;
        }
        socket.emit('join-game', { gameCode: textInputCode });
    }

    function handleInvite() {
        socket.emit('invite', { tournament: createGameCode, username: inviteInput });
    }

    socket.on('invite', (data: any) => {
        setInvites((inv: any[]) => inv.filter((i: any) => i.sender !== data.sender));
        setInvites((i: any) => [...i, { sender: data.sender, gameCode: data.gameCode }]);
    });

    socket.on('create-tournament', (data: any) => {
        setCreateGameCode(data.tournamentCode);
    });

    socket.on('join-tournament', (data: any) => {
        if (data.status === 'success') {
            setPlayers((p: any) => p.filter((u: any) => u !== data.username));
            setPlayers((p: any) => [...p, data.username]);
        }
    });

    socket.on('organize-tournament', (data: any) => {
        console.log('organize-tournament', data)
    });

    socket.on('join-game', (data: any) => {
        if (data.status === 'error') {
            return;
        }
    });

    socket.on('assign-game', (data: any) => {
        console.log('assign-game', data)
        handleJoinGame(data.gameCode);
    })


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
                            <Button type="primary" className="px-10 py-3 text-lg sm:px-12 sm:py-6 sm:text-2xl text-white">
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </CopyToClipboard>
                        <Button onClick={() => setCurrentMenu('default')} danger type="primary" className="px-10 py-3 text-lg sm:px-12 sm:py-6 sm:text-2xl text-white">
                            Close
                        </Button>
                    </div>
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
                    {/* People Who Joined */}
                    <div className="w-72 sm:w-96 h-14 sm:h-24 mt-4">
                        <p className="text-lg sm:text-2xl text-white">People Who Joined</p>
                        <p className="text-sm sm:text-xl h-1/2 w-full overflow-auto text-gray-400">{players.length === 0 ? 'No Players' : players.join(', ')}</p>
                    </div>
                </div>
            }

            {/* Settings Menu */}
            {
                currentMenu === 'settingMenu' &&
                <div className="relative z-10 bg-gray-700 bg-opacity-60 backdrop-blur p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <p className="text-4xl sm:text-6xl font-bold text-white mb-6">Game Options</p>
                    <div className="mb-4 w-full">
                        <label className="block text-lg sm:text-3xl text-white mb-2">Turn Between Games:</label>
                        <Select className="w-full sm:h-12" 
                            defaultValue={betweenGame} 
                            onChange={(value: string) => setBetweenGame(value)} 
                            disabled
                            options={[
                                {value: 'keep', label: <p className="sm:text-2xl">Random Beginner</p>},
                            ]}
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <label className="block text-lg sm:text-3xl text-white mb-2">Player Count:</label>
                        <InputNumber className="w-full sm:h-12 sm:text-2xl" min={2} max={10} defaultValue={playerCount} onChange={(value: number|null) => setPlayerCount(value ?? 0)} />
                    </div>
                    <div className="flex space-x-4">
                        <Button onClick={handleCreateTournament} type="primary" className="px-6 py-3 text-lg sm:px-12 sm:py-6 sm:text-2xl">
                            Next
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
                    <h3 className="text-lg text-white mb-8">Play a tournament!</h3>
                    <Button onClick={() => setCurrentMenu('settingMenu')} type="primary" className="w-3/4 h-10 md:h-14 mb-4 text-lg md:text-xl text-white">
                        Create Tournament
                    </Button>
                    <div className="flex space-x-4 w-3/4 mb-4 h-10 md:h-14">
                        <Input value={textInputCode} onChange={(e) => setTextInputCode(e.target.value)} 
                            type="text" 
                            className="flex-1 p-3 text-lg sm:text-xl rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:!ring-blue-500" 
                            placeholder="Enter Tournament ID"
                        />
                        <Button onClick={() => handleJoinTournament(undefined)} type="primary" className="h-full w-1/4 text-lg md:text-xl text-white bg-green-600 hover:!bg-green-500">
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
                                    <Button onClick={() => handleJoinTournament(gameCode)} type="primary" className="px-4 py-2 text-white">
                                        Join
                                    </Button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            }

            {/* Waiting Menu */}
            {
                currentMenu === 'waiting' &&
                <div className="relative z-10 bg-gray-700 bg-opacity-60 backdrop-blur p-8 rounded-lg shadow-lg flex flex-col items-center">
                    <p className="text-white text-lg">Waiting for other players</p>
                </div>
            }

            {/* Organizing */}

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

export default CreateTournament;
