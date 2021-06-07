import Cell from "./Cell.js";
import { shuffle, dom} from "./util.js";


export default class Board {
    constructor(width, height, mineCount) {
        this.width = width;
        this.height = height;
        this.mineCount = mineCount;

        this.cells = null;

        this.lost = false;
        this.won = false;
    }

    /** Checks if the game is over.
     * 
     * A game is over if it is either lost or won.
     */
    isOver() {
        return this.lost || this.won;
    }

    /** Reveal a cell.
     * 
     * If the board has not been generated, it will be generated, and the
     * clicked point will excluded from being a mine.
    */
    reveal(x, y) {
        if(this.cells === null)
            this.cells = createCells(this.width, this.height, this.mineCount, { x: x, y: y });

        const cell = this.cells[y][x];
        const neighborMineCount = this.minesAround(x, y);

        if(cell.revealed || cell.flagged)
            return;

        if(cell.hasMine) {
            cell.revealed = true;
            this.lost = true;
        } else {
            cell.revealed = true;

            if(neighborMineCount === 0) {
                for(let yo = -1; yo <= 1; yo++) {
                    for(let xo = -1; xo <= 1; xo++) {
                        if(xo === 0 && yo === 0)
                            continue;
            
                        if(x + xo < 0 || x + xo >= this.width)
                            continue;
                            
                        if(y + yo < 0 || y + yo >= this.height)
                            continue;
            
                        this.reveal(x + xo, y + yo);
                    }
                }
            }
        }
    }

    /** Flag a cell.
     * 
     * If the board has not been generated, it will be generated, but the
     * clicked point will not be excluded from being a mine.
     */
    flag(x, y) {
        if(this.cells === null)
            this.cells = createCells(this.width, this.height, this.mineCount);

        const cell = this.cells[y][x];
        cell.flagged = !cell.flagged;

        if(this.cells.every(row => row.every(cell => cell.flagged === cell.hasMine)))
            this.won = true;
    }

    /** Gets the neighbors of a point. */
    neighbors(x, y) {
        const neighbors = [];
        for(let yo = -1; yo <= 1; yo++) {
            for(let xo = -1; xo <= 1; xo++) {
                if(xo === 0 && yo === 0)
                    continue;

                if(x + xo < 0 || x + xo >= this.width)
                    continue;
                    
                if(y + yo < 0 || y + yo >= this.height)
                    continue;

                neighbors.push(this.cells[y + yo][x + xo]);
            }
        }

        return neighbors;
    }

    /** Gets the number of mines around a point. */
    minesAround(x, y) {
        let count = 0;
        for(const neighbor of this.neighbors(x, y))
            if(neighbor.hasMine)
                count += 1;

        return count;
    }

    /** Renders the board to a table */
    render() {
        const rows = [];
        for(let y = 0; y < this.height; y++) {
            const columns = [];
            for(let x = 0; x < this.width; x++)
                columns.push(this.renderCell(x, y));

            rows.push(dom("tr", {}, columns));
        }

        return dom("table", {
            id: "board",
            classes: [
                "interactive",
                this.lost ? "lost" : undefined,
                this.won ? "won" : undefined
            ]
        }, rows);
    }

    /** Renders a cell to a dom element. */
    renderCell(x, y) {
        const cell = this.cells !== null ? this.cells[y][x] : new Cell(0, 0, false);
        const neighborMineCount = this.cells !== null ? this.minesAround(x, y) : 0;

        const type =
            cell.flagged ? "flagged" :
            !cell.revealed ? "blank" :
            cell.hasMine ? "mine" :
            "clicked";

        let content = undefined;
        if(type === "clicked" && neighborMineCount !== 0)
            content = neighborMineCount;

        return dom("td", {
            classes: [
                "cell",
                type,
                type === "clicked" && neighborMineCount !== 0 ? `count-${neighborMineCount}` : undefined
            ]
        }, [content]);
    }
}

/** Creates a two dimensional array of cells. */
function createCells(width, height, mineCount, excludedPoint = undefined) {
    const mineCoordinates = getMineCoordinates(width, height, mineCount, excludedPoint);

    const cells = [];
    for(let y = 0; y < height; y++) {
        cells[y] = [];
        for(let x = 0; x < width; x++) {
            cells[y][x] = new Cell(x, y, mineCoordinates[y][x]);
        }
    }

    return cells;
}

/** Creates a two dimensional array of booleans describing where mines are. */
function getMineCoordinates(width, height, mineCount, excludedPoint = undefined) {
    const allCoordinates = [];
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            if(x === excludedPoint.x && y === excludedPoint.y)
                continue;

            allCoordinates.push({x: x, y: y});
        }
    }

    // get at random subset of unique coordinates
    const mineCoordinates = shuffle(allCoordinates).slice(0, mineCount);

    const mines = [];
    for(let y = 0; y < height; y++) {
        mines[y] = [];
        for(let x = 0; x < width; x++)
            mines[y][x] = false;
    }

    for(const { x, y } of mineCoordinates)
        mines[y][x] = true;

    return mines;
}
