import {Position} from "../Position/position.js";
import {NumberUtil} from "../utils/NumberUtil.js";
import {Player} from "../Unit/Player/player.js";
import {Google} from "../Unit/Google/google.js";

class Game {
    #settings = {
        pointsToWin: 10,
        gridSize: {
            columns: 4,
            rows: 4,
        },
        googleJumpInterval: 2000,
    };
    #status = 'pending'
    #player1
    #player2
    #google
    #googleSetIntervalId
    #score = {
        1: {points: 0},
        2: {points: 0},
    };

    constructor() {

    }

    async start() {
        if (this.#status === "pending") {
            this.#createUnits()
            this.#status = "in-progress";
            this.#runGoogleJumpInterval()
        }
    }

    async stop() {
        clearInterval(this.#googleSetIntervalId);
        this.#status = "stopped";
    }

    async #finishGame() {
        clearInterval(this.#googleSetIntervalId);
        this.#status = "finished";
    }

    #runGoogleJumpInterval() {
        this.#googleSetIntervalId = setInterval(() => {
            this.#moveGoogleToRandomPosition();
        }, this.#settings.googleJumpInterval);
    }

    #moveGoogleToRandomPosition(excludeGoogle) {
        let notCrossedPosition = [this.#player1.position, this.#player2.position];

        if (!excludeGoogle) {
            notCrossedPosition.push(this.#google.position);
        }

        this.#google = new Google(this.#getRandomPosition(notCrossedPosition));
    }


    #createUnits() {
        const player1Position = this.#getRandomPosition([]);

        this.#player1 = new Player(1, player1Position);


        const player2Position = this.#getRandomPosition([player1Position]);
        this.#player2 = new Player(2, player2Position);


        this.#moveGoogleToRandomPosition(true)
    }

    #getRandomPosition(coordinates) {
        let newX, newY;

        do {
            newX = NumberUtil.getRandomNumber(this.#settings.gridSize.columns);
            newY = NumberUtil.getRandomNumber(this.#settings.gridSize.rows);
        } while (coordinates.some((el) => el.columns === newX && el.rows === newY));

        return new Position(newX, newY);
    }

    #checkBorders(player, delta) {
        const newPosition = player.position.clone();
        if (delta.columns) newPosition.columns += delta.columns;
        if (delta.rows) newPosition.rows += delta.rows;

        if (newPosition.columns < 1 || newPosition.columns > this.#settings.gridSize.columns) {
            return true;
        }
        if (newPosition.rows < 1 || newPosition.rows > this.#settings.gridSize.rows) {
            return true;
        }

        return false;
    }

    #checkOtherPlayer(movingPlayer, anotherPlayer, delta) {
        const newPosition = movingPlayer.position.clone();
        if (delta.columns) newPosition.columns += delta.columns;
        if (delta.rows) newPosition.rows += delta.rows;

        return anotherPlayer.position.equal(newPosition);
    }

    #checkGoogleCatching(player) {
        if (player.position.equal(this.#google.position)) {

            this.#score[player.id].points++;

            this.#moveGoogleToRandomPosition()

        }
        if (this.#score[player.id].points === this.#settings.pointsToWin) {
            this.#finishGame()
        } else {
            clearInterval(this.#googleSetIntervalId)
            this.#moveGoogleToRandomPosition(true)
            this.#runGoogleJumpInterval()
        }
    }

    #movePlayer(movingPlayer, anotherPlayer, delta) {
        const isBorder = this.#checkBorders(movingPlayer, delta);
        const isAnotherPlayer = this.#checkOtherPlayer(
            movingPlayer,
            anotherPlayer,
            delta
        );
        if (isBorder || isAnotherPlayer) {
            return;
        }

        if (delta.columns) {
            movingPlayer.position = new Position(
                movingPlayer.position.columns + delta.columns,
                movingPlayer.position.rows,
            );
        } else {
            movingPlayer.position = new Position(
                movingPlayer.position.columns,
                movingPlayer.position.rows + delta.rows,
            );
        }
        this.#checkGoogleCatching(movingPlayer);
        // this.eventEmiter.emit("change");
    }

    movePlayer1Right() {
        const delta = {columns: 1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Left() {
        const delta = {columns: -1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Up() {
        const delta = {rows: -1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Down() {
        const delta = {rows: 1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer2Right() {
        const delta = {columns: 1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Left() {
        const delta = {columns: -1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Up() {
        const delta = {rows: -1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Down() {
        const delta = {rows: 1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    get score() {
        return this.#score;
    }

    set score(score) {
        this.#score = score
    }

    get google() {
        return this.#google;
    }

    get player1() {
        return this.#player1;
    }


    get player2() {
        return this.#player2;
    }

    get status() {
        return this.#status
    }

    get settings() {
        return this.#settings
    }

    set settings(settings) {
        this.#settings = settings;
        // this.#settings = {...this.#settings, ...settings};
        //
        // this.#settings.gridSize = settings.gridSize
        //     ? {...this.#settings.gridSize, ...settings.gridSize}
        //     : this.#settings.gridSize;
    }


    test() {
        return 'game'
    }
}


module.exports = {
    Game,
}
