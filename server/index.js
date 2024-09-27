import express from 'express';
const app = express();
import 'dotenv/config'
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Game } from './Game Data/Game.js';
import { Tournament } from './Game Data/Tournament.js';

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
    }
})

let games = {}
let tournaments = {}
let users = {}

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    let gameCode = ''
    let tournamentCode = ''
    let myTurn = 'X'
    let username = ''

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)

        username = Object.keys(users).find(key => users[key] === socket.id)
        if (username) delete users[username]

        handleDisconnect(socket.id, gameCode)
    })

    socket.on('login', (data) => {
        if (!data.username || data.username.includes(' ') || /[!@#$%^&*(),.?":{}|<>\-_=+]/.test(data.username)) {
            socket.emit('login', {status: 'error', message: 'Invalid username (Spaces or special characters)'});
            return
        }

        if (typeof users[data.username] !== 'undefined' && users[data.username] !== socket.id || data.username === 'Winner') {
            socket.emit('login', {status: 'error', message: 'Username already taken'});
            return
        };
        if (users[data.username] === undefined) users[data.username] = socket.id
        username = data.username
        socket.emit('login', {status: 'success'});
    });

    socket.on('invite', (data) => {
        if (typeof games[data.gameCode] === 'undefined' && typeof tournaments[data.tournament] === 'undefined') return;
        const receiverId = users[data.username]
        if (receiverId) {
            io.to(receiverId).emit('invite', {sender: username, gameCode: data.tournament?data.tournament:data.gameCode});
        }
    });

    socket.on('create-game', (data) => {
        handleDisconnect(socket.id, gameCode)
        socket.leave(gameCode)
        gameCode = genCode();
        games[gameCode] = new Game(
            data.turnSwitching,
            data.begin,
            false,
            username
        )
        myTurn = data.begin
        socket.emit('create-game', gameCode);
        socket.join(gameCode)
    });

    socket.on('join-game', (data) => {
        if (typeof games[data.gameCode] === 'undefined') return;
        socket.leave(gameCode)
        gameCode = data.gameCode
        const feedback = games[gameCode].joinPlayer(username)
        if (feedback.status === 'error') {
            return feedback
        }
        myTurn = games[gameCode].players.X === username ? 'X' : 'O'
        socket.join(gameCode)
        
        io.to(gameCode).emit('start-game', {gameCode, players: {...games[gameCode].players}})
        io.to(gameCode).emit('grid', games[gameCode].game)
        io.to(gameCode).emit('turn', games[gameCode].turn)
    });

    socket.on('create-tournament', ({ playerCount, betweenGame }) => {
        handleDisconnect(socket.id, gameCode)
        socket.leave(tournamentCode)
        tournamentCode = genCode();
        tournaments[tournamentCode] = new Tournament([], playerCount, tournamentCode, betweenGame)
        tournaments[tournamentCode].addPlayer(username)
        tournaments[tournamentCode].setOrganizer(username)
        socket.join(tournamentCode)
        socket.emit('create-tournament', { tournamentCode });
    });

    socket.on('next-round', () => {
        if (typeof tournaments[tournamentCode] === 'undefined') return;
        const tournament = tournaments[tournamentCode]

        socket.emit('next-round', { tournamentOrder: tournament.getTournamentOrder() });
        io.to(tournamentCode).emit('update-order', { tournamentOrder: tournament.getTournamentOrder() });
    })

    socket.on('join-tournament', ({ tournament }) => {
        console.log(tournament)
        if (typeof tournaments[tournament] === 'undefined') return;
        if (tournaments[tournament].players.length > tournaments[tournament].playerCount) {
            socket.emit('join-tournament', { status: 'error', message: 'Tournament is full' });
            return
        }
        socket.leave(tournamentCode)
        tournamentCode = tournament
        socket.join(tournamentCode)
        if (tournaments[tournament].players.includes(username)) {
            io.to(tournamentCode).emit('join-tournament', { status: 'success', player: tournaments[tournamentCode].players });
            return
        }
        tournaments[tournamentCode].addPlayer(username)
        io.to(tournamentCode).emit('join-tournament', { status: 'success', player: tournaments[tournamentCode].players });

        if (tournaments[tournamentCode].players.length === tournaments[tournamentCode].playerCount) {
            io.to( users[tournaments[tournamentCode].organizer] ).emit('organize-tournament', { organization: tournaments[tournamentCode].tournamentOrder.map(u => u.map(i => String(i) === i ? i : `Winner ${i}`)) });
        }
    });

    socket.on('organize-tournament', (data) => {
        if (typeof tournaments[tournamentCode] === 'undefined') return;
        tournaments[tournamentCode].players = data.organization[0]
        tournaments[tournamentCode].tournamentOrder = data.organization.map(u => u.map(i => i.includes('Winner ') ? Number((i).split(' ')[1]) : i))
        startTournament(tournamentCode)
    });

    socket.on('ready', () => {
        const tournament = tournaments[tournamentCode];
        if (!tournament) return;
        if (!tournament.players.includes(username)) return;
        if (tournament.playerStatus[username] === 'spectating') return;
        if (typeof tournament.tournamentOrder.findIndex((u) => u.includes(username)) === 'undefined') return;
    
        // Mark the player as ready
        tournament.putInReady(username);
    
        // Get the player's position in the tournament
        const playerPosition = tournament.getPlayerPosition(username);
        const diff = playerPosition.row % 2 === 0 ? 1 : -1;
    
        // Get the opponent based on player's position
        const opponent = tournament.getPlayerByPosition(playerPosition.column, playerPosition.row + diff);
    
        // Check if the opponent is ready
        if (tournament.getPlayerStatus(opponent) === 'ready') {
            // Remove the previous game if it exists
            tournament.removeGame(gameCode);
    
            // Generate a new game code
            gameCode = genCode();
    
            // Determine player1 and player2 based on the player's position
            let [player1, player2] = diff === 1 ? [username, opponent] : [opponent, username];

            [player1, player2] = tournament.betweenGame === 'random' ?
                [player1, player2].sort(() => Math.random() - 0.5) :
                tournament.betweenGame === 'left-to-right' ?
                [player, player2] :
                [player2, player];
    
            // Create a new game
            games[gameCode] = new Game('keep', 'X', tournamentCode, player1);
            games[gameCode].begin = games[gameCode].turn;
    
            // Add the new game to the tournament
            tournament.addGame(gameCode);
    
            // Assign the game to both players
            io.to(users[player1]).emit('assign-game', { gameCode });
            io.to(users[player2]).emit('assign-game', { gameCode });
    
            // Mark both players as currently playing
            tournament.putInCurrentlyPlaying(player1);
            tournament.putInCurrentlyPlaying(player2);
        }

        // Broadcast updated tournament order to all players
        io.to(tournamentCode).emit('update-order', { tournamentOrder: tournament.getTournamentOrder() });

        //update to the real tournaments
        tournaments[tournamentCode] = tournament
    });

    socket.on('play', (data) => {
        if (typeof games[gameCode] === 'undefined') return;
        if (games[gameCode].players[myTurn] !== username) return

        games[gameCode].play(data.latestChange, myTurn)

        const win = games[gameCode].win(data.latestChange)

        games[gameCode].switchTurn()

        io.to(gameCode).emit('play', {grid: games[gameCode].game, turn: games[gameCode].turn, latestChange: data.latestChange})
        
        if (win)
            gameWin(gameCode, win)
    });

    socket.on('request-rematch', () => {
        io.to(gameCode).emit('rematch', gameCode)
        games[gameCode].reset()
        games[gameCode].joinPlayer(username)
    });

    socket.on('accept-rematch', (data) => {
        if (typeof games[data.gameCode] === 'undefined') return;
        const status = games[gameCode].joinPlayer(username)
        if (status.status === 'error') {
            return status
        }
        socket.leave(gameCode)
        gameCode = data.gameCode
        socket.join(gameCode)

        io.to(gameCode).emit('start-game', {gameCode, players: {...games[gameCode].players}})
        io.to(gameCode).emit('grid', games[gameCode].game)
        io.to(gameCode).emit('turn', games[gameCode].turn)

        return status
    })
})

server.listen(Number(process.env.PORT), () => {
    console.log('Server is running')
})

function genCode() {
    return Array(6).fill('').map(v => (Math.floor(Math.random() * 36)).toString(36)).join('');
}

function handleDisconnect(socketId, gameCode) {
    if (games[gameCode]) {
        if (users[games[gameCode].players.X] === socketId) {
            games[gameCode].players.X = null
        } else if (users[games[gameCode].players.O] === socketId) {
            games[gameCode].players.O = null
        }
    }
}

function gameWin(gameCode, win) {
    games[gameCode].winner = win
    io.to(gameCode).emit('win', win === 'tie' ? '' : win)

    let tournament = tournaments[games[gameCode].tournament]

    if (!games[gameCode].tournament) return;
    if (win !== 'tie') {
        let winner = games[gameCode].players[win]
        let loser = games[gameCode].players[win === 'X' ? 'O' : 'X']

        tournament.setWinner(winner, loser)
    } else {
        //Tie (Still not working)
        tournament.putInFinishedPlayers(games[gameCode].players[win])
        tournament.putInFinishedPlayers(games[gameCode].players[win])
    }

    tournaments[games[gameCode].tournament] = tournament;
}

function startTournament(tournamentCode) {
    const tournament = tournaments[tournamentCode]

    for (let i = 0; i < tournament.playerCount; i += 2) {
        if (i === tournament.playerCount - 1) {
            tournaments[tournamentCode].putInFinishedPlayers(tournament.players[i])

            tournaments[tournamentCode].setWinner(tournament.players[i])
            io.to(users[ tournament.players[i] ]).emit('next-round', { tournamentOrder: tournaments[tournamentCode].getTournamentOrder() });
            break
        }
        const gameCode = genCode();
        const [player1, player2] = tournament.betweenGame === 'random' ?
            [tournament.players[i], tournament.players[i+1]].sort(() => Math.random() - 0.5) :
            tournament.betweenGame === 'left-to-right' ?
            [tournament.players[i], tournament.players[i+1]] :
            [tournament.players[i+1], tournament.players[i]];
        
        console.log([player1, player2])
        
        games[gameCode] = new Game(
            'keep', 
            'X', 
            tournamentCode, 
            player1
        );
        games[gameCode].begin = games[gameCode].turn
        tournaments[tournamentCode].addGame(gameCode)
        io.to(users[ player1 ]).emit('assign-game', {gameCode})
        io.to(users[ player2 ]).emit('assign-game', {gameCode})
        tournaments[tournamentCode].putInCurrentlyPlaying(player1)
        tournaments[tournamentCode].putInCurrentlyPlaying(player2)
    }
}