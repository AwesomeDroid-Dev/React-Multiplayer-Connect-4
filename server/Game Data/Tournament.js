export class Tournament {
    constructor(players, playerCount, tournamentCode) {
        this.players = players
        this.finishedPlayers = []
        this.currentlyPlaying = []
        this.spectators = []
        this.playerCount = playerCount
        this.games = []
        this.tournamentCode = tournamentCode
    }

    addGame(game) {
        this.games.push(game)
    }

    addPlayer(player) {
        this.players.push(player)
    }

    removePlayer(player) {
        this.players = this.players.filter((p) => p !== player)
        this.spectators = this.spectators.filter((p) => p !== player)
        this.currentlyPlaying = this.currentlyPlaying.filter((p) => p !== player)
    }

    putInCurrentlyPlaying(player) {
        this.spectators = this.spectators.filter((p) => p !== player)
        this.finishedPlayers = this.finishedPlayers.filter((p) => p !== player)
        this.currentlyPlaying.push(player)
    }

    putInSpectating(player) {
        this.currentlyPlaying = this.currentlyPlaying.filter((p) => p !== player)
        this.finishedPlayers = this.finishedPlayers.filter((p) => p !== player)
        this.spectators.push(player)
    }

    putInFinishedPlayers(player) {
        this.currentlyPlaying = this.currentlyPlaying.filter((p) => p !== player)
        this.spectators = this.spectators.filter((p) => p !== player)
        this.finishedPlayers.push(player)
    }
}