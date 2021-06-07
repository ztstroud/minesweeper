export default class Cell {
    constructor(hasMine, neighborMineCount) {
        this.hasMine = hasMine;
        this.neighborMineCount = neighborMineCount;

        this.revealed = false;
        this.flagged = false;
    }
}