import {Position} from "../Position/position.js";
import {NumberUtil} from "../utils/NumberUtil.js";
import {Player} from "../Unit/Player/player.js";
import {Google} from "../Unit/Google/google.js";

class Game {
    #settings = {
        gridSize: {
            columns: 4,
            rows: 4,
        },
    };
    #status = 'pending'
    #player1
    #player2
    #google

    constructor() {

    }

    async start() {
        if (this.#status === "pending") {
            this.#createUnits()
            this.#status = "in-progress";
        }
    }

    #createUnits() {
        const player1Position = this.#getRandomPosition([]);

        this.#player1 = new Player(1, player1Position);


        const player2Position = this.#getRandomPosition([player1Position]);
        this.#player2 = new Player(2, player2Position);


        const googlePosition = this.#getRandomPosition([
            player1Position,
            player2Position,
        ]);
        this.#google = new Google(googlePosition);
    }

    #getRandomPosition(coordinates) {
        let newX, newY;

        do {
            newX = NumberUtil.getRandomNumber(this.#settings.gridSize.columns);
            newY = NumberUtil.getRandomNumber(this.#settings.gridSize.rows);
        } while (coordinates.some((el) => el.columns === newX && el.rows === newY));

        return new Position(newX, newY);
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
        this.#settings = settings
    }


    test() {
        return 'game'
    }
}

module.exports = {
    Game,
}
