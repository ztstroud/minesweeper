export default class Cell {
    constructor(hasMine) {
        this.hasMine = hasMine;

        this.revealed = false;
        this.flagged = false;
    }
}