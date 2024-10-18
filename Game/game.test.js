const {Game} = require('./game')

const sleep = ms => new Promise(res => setTimeout(res, ms))

describe('game tests', () => {
    let game;
    beforeEach(() => {
        game = new Game(1);
    });
    afterEach(async () => {
        await game.stop();
    })

    it('first test', () => {
        expect(game.test()).toBe('game')
    })

    it('init test', () => {

        game.settings = {
            gridSize: {
                x: 4,
                y: 5,
            },
        }

        expect(game.settings.gridSize.x).toBe(4)
        expect(game.settings.gridSize.y).toBe(5)
    })

    it('start game', async () => {

        game.settings = {
            gridSize: {
                x: 4,
                y: 5,
            },
        }

        expect(game.status).toBe('pending')
        await game.start()
        expect(game.status).toBe('in-progress')
    })

    it('player1, player2 should have unique coordinates', async () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game()
            game.settings = {
                gridSize: {
                    columns: 2,
                    rows: 3,
                },
            }

            await game.start()
            expect([1, 2]).toContain(game.player1.position.columns)
            expect([1, 2, 3]).toContain(game.player1.position.rows)

            expect([1, 2]).toContain(game.player2.position.columns)
            expect([1, 2, 3]).toContain(game.player2.position.rows)

            expect(
                game.player1.position.columns !== game.player2.position.columns ||
                game.player1.position.rows !== game.player2.position.rows
            )
            expect([1, 2]).toContain(game.google.position.columns)
            expect([1, 2, 3]).toContain(game.google.position.rows)

            expect(
                (game.player1.position.columns !== game.player2.position.columns ||
                    game.player1.position.rows !== game.player2.position.rows) &&
                (game.player1.position.columns !== game.google.position.columns ||
                    game.player1.position.rows !== game.google.position.rows) &&
                (game.player2.position.columns !== game.google.position.columns ||
                    game.player2.position.rows !== game.google.position.rows)
            ).toBe(true)
        }
    })

    it('check google positions after jump', async () => {
        // setter


        game.settings = {
            gridSize: {
                columnsCount: 1,
                rowsCount: 4,
            },
            googleJumpInterval: 100,
        }

        await game.start()

        const prevPositions = game.google.position.clone()

        await sleep(150)

        expect(game.google.position.equal(prevPositions)).toBe(false)
    })
    it('catch google by player1 or player2 for one row', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()
            // setter
            game.settings = {
                gridSize: {
                    columns: 3,
                    rows: 1,
                },
            }

            await game.start()

            // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1
            const deltaForPlayer1 = game.google.position.columns - game.player1.position.columns

            const prevGooglePosition = game.google.position.clone()

            if (Math.abs(deltaForPlayer1) === 2) {
                const deltaForPlayer2 = game.google.position.columns - game.player2.position.columns
                if (deltaForPlayer2 > 0) game.movePlayer2Right()
                else game.movePlayer2Left()

                expect(game.score[1].points).toBe(0)
                expect(game.score[2].points).toBe(1)
            } else {
                if (deltaForPlayer1 > 0) game.movePlayer1Right()
                else game.movePlayer1Left()

                expect(game.score[1].points).toBe(1)
                expect(game.score[2].points).toBe(0)
            }

            expect(game.google.position.equal(prevGooglePosition)).toBe(false)
        }
    })
    it("catch google by player1 or player2 for one column", async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game();
            // setter
            game.settings = {
                gridSize: {
                    columns: 1,
                    rows: 3,
                },
            };

            await game.start();
            // p1   p1   p2   p2    g    g
            // p2    g   p1    g   p1   p2
            //  g   p2    g   p1   p2   p1
            const deltaForPlayer1 = game.google.position.rows - game.player1.position.rows;


            const prevGooglePosition = game.google.position.clone();


            if (Math.abs(deltaForPlayer1) === 2) {
                const deltaForPlayer2 =
                          game.google.position.rows - game.player2.position.rows;
                if (deltaForPlayer2 > 0) game.movePlayer2Down();
                else game.movePlayer2Up();


                expect(game.score[1].points).toBe(0);
                expect(game.score[2].points).toBe(1);
            } else {
                if (deltaForPlayer1 > 0) game.movePlayer1Down();
                else game.movePlayer1Up();


                expect(game.score[1].points).toBe(1);
                expect(game.score[2].points).toBe(0);
            }


            expect(game.google.position.equal(prevGooglePosition)).toBe(false);

        }
    });
    it('first or second player wins', async () => {
        // game = new Game();
        // setter
        game.settings = {
            pointsToWin: 3,
            gridSize: {
                columns: 3,
                rows: 1,
            },
        }
        game.score = {
            1: { points: 0 },
            2: { points: 0 },
        }

        await game.start()
        // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1
        const deltaForPlayer1 = game.google.position.columns - game.player1.position.columns

        if (Math.abs(deltaForPlayer1) === 2) {
            const deltaForPlayer2 = game.google.position.columns - game.player2.position.columns
            if (deltaForPlayer2 > 0) {
                game.movePlayer2Right()
                game.movePlayer2Left()
                game.movePlayer2Right()
            } else {
                game.movePlayer2Left()
                game.movePlayer2Right()
                game.movePlayer2Left()
            }

            expect(game.status).toBe('finished')
            expect(game.score[1].points).toBe(0)
            expect(game.score[2].points).toBe(3)
        } else {
            if (deltaForPlayer1 > 0) {
                game.movePlayer1Right()
                game.movePlayer1Left()
                game.movePlayer1Right()
            } else {
                game.movePlayer1Left()
                game.movePlayer1Right()
                game.movePlayer1Left()
            }

            expect(game.status).toBe('finished')
            expect(game.score[1].points).toBe(3)
            expect(game.score[2].points).toBe(0)
        }
    })
})



