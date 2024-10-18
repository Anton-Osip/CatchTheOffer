export class Position {
    constructor(columns, rows) {
        this.columns = columns
        this.rows = rows
    }
    clone() {
        return new Position(this.columns, this.rows)
    }
    equal(otherPosition) {
        return otherPosition.columns === this.columns && otherPosition.rows === this.rows
    }
}
