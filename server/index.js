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
games['eo3m0j'] = {turn: 'X', game: Array(42).fill(''), players: {X: null, O: null}}

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)
    })

    if (games['eo3m0j'].players.X === null) {
        games['eo3m0j'].players.X = socket.id
    } else {    
        games['eo3m0j'].players.O = socket.id
    }
    socket.emit('grid', games['eo3m0j'].game)
    socket.emit('turn', games['eo3m0j'].turn)

    let gameCode = 'eo3m0j'
    let myTurn = 'X'

    socket.on('create-game', (data) => {
        gameCode = genCode();
        games[gameCode] = {turn: 'X', game: Array(42).fill(''), players: {X: socket.id, O: null}};
        socket.emit('create-game', gameCode);
        socket.join(gameCode)
    });

    socket.on('join-game', (data) => {
        if (typeof games[data.gameCode] === 'undefined') return;
        gameCode = data.gameCode
        if (games[gameCode].players.X === null) {
            games[gameCode].players.X = socket.id
            myTurn = 'X'
        } else if (games[gameCode].players.O === null) {
            games[gameCode].players.O = socket.id
            myTurn = 'O'
        } else {
            games[gameCode].players.X = socket.id
            myTurn = 'X'
        }
        socket.join(gameCode)
        io.to(gameCode).emit('grid', games[gameCode].game)
        io.to(gameCode).emit('turn', games[gameCode].turn)
        io.to(gameCode).emit('start-game', {gameCode, players: games[gameCode].players})
    });

    socket.on('play', (data) => {
        games[gameCode].game[data.latestChange] = myTurn
        games[gameCode].turn = myTurn==='X'?'O':'X';
        const win = checkWin(games[gameCode].game, data.latestChange, myTurn)
        if (win) {
            io.to(gameCode).emit('win', myTurn)
        }
        io.to(gameCode).emit('play', {grid: games[gameCode].game, turn: games[gameCode].turn, latestChange: data.latestChange})
    })

    socket.on('request-rematch', () => {
        const newCode = genCode();
        const oldGame = games[gameCode]
        io.to(gameCode).emit('rematch', newCode)
        gameCode = newCode
        socket.join(gameCode)
        games[gameCode] = {turn: 'X', game: Array(42).fill(''), players: oldGame.players};
    })

    socket.on('accept-rematch', (data) => {
        if (typeof games[data.gameCode] === 'undefined') return;
        gameCode = data.gameCode
        if (games[gameCode].players.X === null) {
            games[gameCode].players.X = socket.id
            myTurn = 'X'
        } else if (games[gameCode].players.O === null) {
            games[gameCode].players.O = socket.id
            myTurn = 'O'
        }
        socket.join(gameCode)
        io.to(gameCode).emit('grid', games[gameCode].game)
        io.to(gameCode).emit('turn', games[gameCode].turn)
        io.to(gameCode).emit('start-game', {gameCode, players: games[gameCode].players})
    })
})

server.listen(5000, () => {
    console.log('Server is running')
})

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