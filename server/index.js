const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

let games = {}
let users = {}

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    let gameCode = '' //Example
    let myTurn = 'X'        //Example
    let username = ''

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)

        username = Object.keys(users).find(key => users[key] === socket.id)
        if (username) delete users[username]

        handleDisconnect(socket.id, gameCode)
    })

    socket.on('login', (data) => {
        if (typeof users[data.username] !== 'undefined') {
            socket.emit('login', {status: 'error', message: 'Username already taken'});
        };
        if (users[data.username] === undefined) users[data.username] = socket.id
        username = data.username
        socket.emit('login', {status: 'success'});
    })

    socket.on('invite', (data) => {
        if (typeof games[data.gameCode] === 'undefined') return;
        const receiverId = users[data.username]
        if (receiverId) {
            io.to(receiverId).emit('invite', {sender: username, gameCode: data.gameCode});
        }
    });

    socket.on('create-game', (data) => {
        handleDisconnect(socket.id, gameCode)
        gameCode = genCode();
        games[gameCode] = {winner: 'none', turn: 'X', game: Array(42).fill(''), players: {X: (data.begin === 'X' ? username : null), O: (data.begin === 'O' ? username : null)}, turnSwitching: data.turnSwitching, begin: 'X'};
        games[gameCode].begin = games[gameCode].turn
        myTurn = data.begin
        socket.emit('create-game', gameCode);
        socket.join(gameCode)
    });

    socket.on('join-game', (data) => {
        if (typeof games[data.gameCode] === 'undefined') return;
        gameCode = data.gameCode
        if (games[gameCode].players.X === null && games[gameCode].players.O === null) {
            socket.emit('join-game', {status: 'error', message: "Game doesn't exist"});
            return
        }
        if (games[gameCode].players.X === null) {
            games[gameCode].players.X = username
            myTurn = 'X'
        } else if (games[gameCode].players.O === null) {
            games[gameCode].players.O = username
            myTurn = 'O'
        } else {
            socket.emit('join-game', {status: 'error', message: "Game is already full"})
        }
        socket.join(gameCode)
        socket.emit('join-game', {status: 'success', ...games[gameCode].players})
        io.to(gameCode).emit('start-game', {gameCode, players: {X: users[games[gameCode].players.X], O: users[games[gameCode].players.O]}})
        io.to(gameCode).emit('grid', games[gameCode].game)
        io.to(gameCode).emit('turn', games[gameCode].turn)
    });

    socket.on('play', (data) => {
        games[gameCode].game[data.latestChange] = myTurn
        games[gameCode].turn = myTurn==='X'?'O':'X';
        const win = checkWin(games[gameCode].game, data.latestChange, myTurn)
        if (win) {
            io.to(gameCode).emit('win', myTurn)
            games[gameCode].winner = myTurn
        } else if (!games[gameCode].game.includes('')) {
            io.to(gameCode).emit('win', '')
            games[gameCode].winner = games[gameCode].begin==='X'?'O':'X'
        }
        io.to(gameCode).emit('play', {grid: games[gameCode].game, turn: games[gameCode].turn, latestChange: data.latestChange})
    })

    socket.on('request-rematch', () => {
        io.to(gameCode).emit('rematch', gameCode)
        socket.join(gameCode)
        currentGame = games[gameCode]
        games[gameCode] = {winner: 'none', turn: turnSystem(), game: Array(42).fill(''), players: currentGame.players, turnSwitching: currentGame.turnSwitching, begin: 'X'
        }
        games[gameCode].begin = games[gameCode].turn
    });

    socket.on('accept-rematch', (data) => {
        if (typeof games[data.gameCode] === 'undefined') return;
        gameCode = data.gameCode
        if (games[gameCode].players.X === null) {
            games[gameCode].players.X = username
            myTurn = 'X'
        } else if (games[gameCode].players.O === null) {
            games[gameCode].players.O = username
            myTurn = 'O'
        }
        socket.join(gameCode)
        io.to(gameCode).emit('start-game', {gameCode, players: {X: users[games[gameCode].players.X], O: users[games[gameCode].players.O]}})
        io.to(gameCode).emit('grid', games[gameCode].game)
        io.to(gameCode).emit('turn', games[gameCode].turn)
    })
})

server.listen(5009, () => {
    console.log('Server is running')
})

function turnSystem() {
    switch (currentGame.turnSwitching) {
        case 'switch':
            return (currentGame.begin === 'X' ? 'O' : 'X')
        case 'keep':
            return currentGame.begin
        case 'winner':
            return currentGame.winner
        case 'loser':
            return (currentGame.winner === 'X' ? 'O' : 'X')
        default:
            return currentGame.turn
    }
}

function checkWin(board, index, player) {
    const directions = [
        { x: 1, y: 0 },  // Horizontal
        { x: 0, y: 1 },  // Vertical
        { x: 1, y: 1 },  // Diagonal Positive Slope
        { x: 1, y: -1 }  // Diagonal Negative Slope
    ];

    const cols = 7;
    const rows = 6;
    
    // Convert index to row and column
    const col = index % cols;
    const row = Math.floor(index / cols);

    const inBounds = (r, c ) => r >= 0 && r < rows && c >= 0 && c < cols;
    const getBoardValue = (r, c) => board[r * cols + c];

    for (let { x, y } of directions) {
        let count = 1;

        // Check in the positive direction
        let r = row + y;
        let c = col + x;
        while (inBounds(r, c) && getBoardValue(r, c) === player) {
            count++;
            if (count === 4) return true;
            r += y;
            c += x;
        }

        // Check in the negative direction
        r = row - y;
        c = col - x;
        while (inBounds(r, c) && getBoardValue(r, c) === player) {
            count++;
            if (count === 4) return true;
            r -= y;
            c -= x;
        }
    }
    return false;
}

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