export class Tournament {
    constructor(players, playerCount, tournamentCode, betweenGame) {
        this.players = players;
        this.organizer = players[0];
        this.playerStatus = {}; // Track player statuses
        this.playerCount = playerCount;
        this.games = [];
        this.round = 0;
        this.betweenGame = betweenGame;
        this.tournamentCode = tournamentCode;
        this.tournamentOrder = this.generateTournamentOrder();

        // Initialize playerStatus for each player
        this.players.forEach(player => {
            this.playerStatus[player] = "player"; // Default status
        });
    }

    addGame(game) {
        this.games.push(game);
    }

    removeGame(game) {
        const index = this.games.indexOf(game);
        if (index > -1) {
            this.games.splice(index, 1);
        }
    }

    setWinner(winner, loser) {
        this.putInFinishedPlayers(winner)
        this.putInSpectating(loser)

        let winnerPos = this.getPlayerPosition(winner)
        let loserPos = this.getPlayerPosition(loser)

        this.tournamentOrder[winnerPos.column][winnerPos.row] = winner+' Winner'
        if (loserPos) {
            this.tournamentOrder[loserPos.column][loserPos.row] = loser+' Loser'
        }

        const row = this.tournamentOrder[winnerPos.column+1].indexOf(winnerPos.row/2+1)

        this.tournamentOrder[winnerPos.column+1][row] = winner

        if (this.tournamentOrder[winnerPos.column+1][0] === 'Winner') {
            this.tournamentOrder[winnerPos.column+1][0] = winner+' Winner'
            return;
        }
        
        if (typeof this.tournamentOrder[winnerPos.column+1][row+1] === 'undefined' && row % 2 === 0) {
            this.setWinner(winner)
            return;
        }
    }

    generateTournamentOrder() {
        let arr = [this.players];
        arr[0] = arr[0].concat(['temp .'])
        let result = [arr[0]]; // Start with the original array
        let subArray = [...arr[0].slice(0, -1*Math.floor(arr[0].length/4)).keys()].map(n => n + 1); // Remove 'Main' and convert remaining to numbers

        while (subArray.length - 1 > 1) {
            subArray = subArray.slice(0, -1*Math.floor(subArray.length / 2)); // Remove the last element in each iteration
            result.push([...subArray]); // Push a copy of the current subArray
        }
        result.push(['Winner'])

        result[0].pop()

        return result
    }

    addPlayer(player) {
        this.players.push(player);
        this.playerStatus[player] = "player"; // Default status for new players
        this.tournamentOrder = this.generateTournamentOrder();
    }

    setOrganizer(player) {
        this.organizer = player;
    }

    getPlayerPosition(player) {
        if (!this.players.includes(player)) return null;
        return {
            column: this.tournamentOrder.findIndex((u) => u.includes(player)),
            row: this.tournamentOrder[this.tournamentOrder.findIndex((u) => u.includes(player))].indexOf(player)
        };
    }

    getPlayerByPosition(column, row) {
        return this.tournamentOrder[column][row];
    }

    getTournamentOrder() {
        //generate dictionary
        return this.tournamentOrder.map((u, layerIndex) => u.map(i => (i === Number(i) ?
            {
                player: i,
                status: 'finished'
            } :
            i.includes(' Winner') ?
            {
                player: i,
                status: 'winner'
            } :
            i.includes(' Loser') ?
            {
                player: i,
                status: 'loser'
            } :
            {
                player: i,
                status: this.playerStatus[i]
            })
        ));
    }

    removePlayer(player) {
        this.players = this.players.filter((p) => p !== player);
        delete this.playerStatus[player]; // Remove player's status
        this.tournamentOrder = this.generateTournamentOrder();
    }

    updatePlayerStatus(player, status) {
        if (this.players.includes(player)) {
            this.playerStatus[player] = status; // Update player's status
        }
    }

    getPlayerStatus(player) {
        return this.playerStatus[player];
    }

    putInCurrentlyPlaying(player) {
        this.updatePlayerStatus(player, "currentlyPlaying");
    }

    putInSpectating(player) {
        this.updatePlayerStatus(player, "spectating");
    }

    putInFinishedPlayers(player) {
        this.updatePlayerStatus(player, "finished");
    }

    putInReady(player) {
        this.updatePlayerStatus(player, "ready");
    }
}