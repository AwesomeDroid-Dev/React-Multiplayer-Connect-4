export class Game {
    constructor(turnSwitching, begin, tournament, username) {
        this.game = new Array(42).fill('');
        this.turn = 'X';
        this.latestChange = -1;
        this.winner = 'none';
        this.turnSwitching = turnSwitching;
        this.players = {X: begin === 'X' ? username : null, O: begin === 'O' ? username : null};
        this.begin = begin;
        this.moves = 0;
        this.tournament = tournament;
    }
    play(x, turn) {
        this.game[x] = turn;
        this.latestChange = x;
    }

    win(index) {
        if (!this.game.includes('')) return 'tie'

        const directions = [
            { colDir: 1, rowDir: 0 },  // Horizontal
            { colDir: 0, rowDir: 1 },  // Vertical
            { colDir: 1, rowDir: 1 },  // Diagonal Positive Slope
            { colDir: 1, rowDir: -1 }  // Diagonal Negative Slope
        ];
        
        const player = this.turn;
        const board = this.game;
        const cols = 7;
        const rows = 6;

        // Convert index to row and column
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        // Function to check if the row and column are within bounds
        const inBounds = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols;
        
        // Function to get the value of the board at a specific row and column
        const getBoardValue = (r, c) => board[r * cols + c];
        
        for (let { colDir, rowDir } of directions) {
            let count = 0;
        
            // Check in the positive direction
            let r = row + rowDir;
            let c = col + colDir;
            while (inBounds(r, c) && getBoardValue(r, c) === player) {
                count++;
                if (count === 4) return this.turn;
                r += rowDir;
                c += colDir;
            }
        
            // Check in the negative direction
            count = 0;
            r -= rowDir;
            c -= colDir;
            while (inBounds(r, c) && getBoardValue(r, c) === player) {
                count++;
                if (count === 4) return this.turn;
                r -= rowDir;
                c -= colDir;
            }
        }
        
        return false;
    }

    switchTurn() {
        this.turn = (this.turn === 'X' ? 'O' : 'X');
    }

    turnSystem() {
        switch (this.turnSwitching) {
            case 'switch':
                return (this.begin === 'X' ? 'O' : 'X')
            case 'keep':
                return this.begin
            case 'winner':
                return this.winner
            case 'loser':
                return (this.winner === 'X' ? 'O' : 'X')
            default:
                return this.turn
        }
    }

    reset() {
        this.game = new Array(42).fill('');
        this.turn = this.turnSystem();
        this.latestChange = -1;
        this.winner = 'none';
        this.moves = 0;
        this.players = {X: null, O: null};
        this.begin = this.turn;
    }

    joinPlayer(player) {
        if (this.players.X === player || this.players.O === player) return {status: 'success', ...this.players}

        if (this.players.X === null) {
            this.players.X = player
            return {status: 'success', ...this.players}
        } else if (this.players.O === null) {
            this.players.O = player
            return {status: 'success', ...this.players}
        } else {
            return {status: 'error', message: 'Game is full'}
        }

    }

    returnData() {
        return {
            game: this.game,
            turn: this.turn,
            latestChange: this.latestChange,
            winner: this.winner,
            moves: this.moves,
            players: this.players,
            turnSwitching: this.turnSwitching,
            begin: this.begin,
            tournament: this.tournament,
        }
    }
}