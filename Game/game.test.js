const {Game} = require('./game')

describe('game tests', () => {
    it('first test', () => {
        const game = new Game()
        expect(game.test()).toBe('game')
    })

    it('init test', () => {
        const game = new Game()

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

        const game = new Game()
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
})



