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
games['eo3m0j'] = {turn: 'X', game: Array.from({ length: 42 }).map(()=>''), players: {X: null, O: null}}

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    if (games['eo3m0j'].players.X === null) {
        games['eo3m0j'].players.X = socket.id
    } else {    
        games['eo3m0j'].players.O = socket.id
    }
    socket.emit('grid', games['eo3m0j'].game)
    socket.emit('turn', games['eo3m0j'].turn)

    let processingTurn = false;
    let gameCode = 'eo3m0j'
    let myTurn = 'X'

    socket.on('create-game', (data) => {
        gameCode = Array(6).fill('').map(v => (Math.floor(Math.random() * 36)).toString(36)).join('');
        games[gameCode] = {turn: 'X', game: Array.from({ length: 42 }).map(()=>''), players: {X: socket.id, O: null}};
        socket.emit('create-game', gameCode);
        socket.join(gameCode)
        console.log(gameCode)
    });

    socket.on('join-game', (data) => {
        if (typeof games[data.gameCode] === 'undefined') return;
        gameCode = data.gameCode
        if (games[gameCode].players.X === null) {
            games[gameCode].players.X = socket.id
            myTurn = 'X'
        } else {
            games[gameCode].players.O = socket.id
            myTurn = 'O'
        }
        socket.join(gameCode)
        io.to(gameCode).emit('grid', games[gameCode].game)
        io.to(gameCode).emit('turn', games[gameCode].turn)
        io.to(gameCode).emit('start-game', {gameCode, players: games[gameCode].players})
        console.log(gameCode)
    });

    socket.on('play', (data) => {
        console.log(`Play: ${data.latestChange}`)
        games[gameCode].game[data.latestChange] = myTurn
        games[gameCode].turn = myTurn==='X'?'O':'X';
        io.to(gameCode).emit('play', {grid: games[gameCode].game, turn: games[gameCode].turn, latestChange: data.latestChange})
    })
})

server.listen(5000, () => {
    console.log('Server is running')
})