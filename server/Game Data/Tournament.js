export class Tournament {
    constructor(players, playerCount, tournamentCode) {
        this.players = players;
        this.organizer = players[0];
        this.playerStatus = {}; // Track player statuses
        this.playerCount = playerCount;
        this.games = [];
        this.round = 0;
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

    generateTournamentOrder() {
        let arr = [this.players];
        let result = [arr[0]]; // Start with the original array
        let subArray = [...arr[0].slice(0, -1*Math.floor(arr[0].length/4)).keys()].map(n => n + 1); // Remove 'Main' and convert remaining to numbers

        while (subArray.length - 1 > 1) {
            subArray = subArray.slice(0, -1*Math.floor(subArray.length / 2)); // Remove the last element in each iteration
            result.push([...subArray]); // Push a copy of the current subArray
        }

        return result;
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
                status: this.getPlayerStatus( this.tournamentOrder[layerIndex-1][ ( (i-1)*2 ) + 1 ] ) === 'ready' &&
                this.getPlayerStatus( this.tournamentOrder[layerIndex-1][ ( (i-1)*2 ) ] ) === 'ready' ? 'ready' : 'currentlyPlaying'
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