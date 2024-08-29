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

        if (games[gameCode]) {
            if (games[gameCode].players.X === socket.id) {
                games[gameCode].players.X = null
            } else if (games[gameCode].players.O === socket.id) {
                games[gameCode].players.O = null
            }
        }
        
    })

    socket.on('login', (data) => {
        if (typeof users[data.username] !== 'undefined') {
            socket.emit('login', {status: 'error', message: 'Username already taken'});
        };
        if (users[data.username] === undefined) users[data.username] = socket.id
        socket.emit('login', {status: 'success'});
        username = data.username
        console.log(users)
    })

    socket.on('invite', (data) => {
        console.log(data)
        if (typeof games[data.gameCode] === 'undefined') return;
        const receiverId = users[data.username]
        if (receiverId) {
            io.to(receiverId).emit('invite', {sender: username, gameCode: data.gameCode});
        }
    });

    socket.on('create-game', (data) => {
        gameCode = genCode();
        games[gameCode] = {winner: 'none', turn: 'X', game: Array(42).fill(''), players: {X: (data.begin === 'X' ? socket.id : null), O: (data.begin === 'O' ? socket.id : null)}, turnSwitching: data.turnSwitching, begin: 'X'};
        games[gameCode].begin = games[gameCode].turn
        myTurn = data.begin
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
        io.to(gameCode).emit('start-game', {gameCode, players: games[gameCode].players})
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
            games[gameCode].players.X = socket.id
            myTurn = 'X'
        } else if (games[gameCode].players.O === null) {
            games[gameCode].players.O = socket.id
            myTurn = 'O'
        }
        socket.join(gameCode)
        io.to(gameCode).emit('start-game', {gameCode, players: games[gameCode].players})
        io.to(gameCode).emit('grid', games[gameCode].game)
        io.to(gameCode).emit('turn', games[gameCode].turn)
    })
})

server.listen(5000, () => {
    console.log('Server is running')
})


class Game {
    constructor(turnSwitching, begin) {
        this.winner = 'none'
        this.turn = 'X'
        this.game = Array(42).fill('')
        this.players = {X: null, O: null}
        this.turnSwitching = turnSwitching
        this.begin = begin
    }

    nextTurn() {
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


}

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