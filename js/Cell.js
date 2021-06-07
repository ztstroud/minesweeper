export default class Cell {
    constructor(x, y, hasMine) {
        this.x = x;
        this.y = y;
        this.hasMine = hasMine;

        this.revealed = false;
        this.flagged = false;
    }
}