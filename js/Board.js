import Cell from "./Cell.js";
import { shuffle, listOfNotUndefined, dom} from "./util.js";


export default class Board {
    constructor(width, height, mineCount) {
        this.width = width;
        this.height = height;
        this.mineCount = mineCount;

        this.cells = createCells(width, height, mineCount);
    }

    /** Renders the board to a table */
    render() {
        const rows = [];
        for(let y = 0; y < this.height; y++) {
            const columns = [];
            for(let x = 0; x < this.width; x++)
                columns.push(renderCell(this.cells[y][x]));

            rows.push(dom("tr", {}, columns));
        }

        return dom("table", {
            id: "board",
            classes: ["interactive"]
        }, rows);
    }
}

/** Creates a two dimensional array of cells. */
function createCells(width, height, mineCount) {
    const mineCoordinates = getMineCoordinates(width, height, mineCount);

    const cells = [];
    for(let y = 0; y < height; y++) {
        cells[y] = [];
        for(let x = 0; x < width; x++) {
            cells[y][x] = new Cell(
                mineCoordinates[y][x],
                neighborMineCount(mineCoordinates, width, height, x, y)
            );
        }
    }

    return cells;
}

/** Creates a two dimensional array of booleans describing where mines are. */
function getMineCoordinates(width, height, mineCount) {
    const allCoordinates = [];
    for(let y = 0; y < height; y++)
        for(let x = 0; x < width; x++)
            allCoordinates.push({x: x, y: y});

    // get at random subset of coordinates
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

/** Count how many mines are next to a point. */
function neighborMineCount(mineCoordinates, width, height, x, y) {
    let count = 0;
    for(let yo = -1; yo <= 1; yo++) {
        for(let xo = -1; xo <= 1; xo++) {
            if(xo === 0 && yo === 0)
                continue;

            if(x + xo < 0 || x + xo >= width)
                continue;
                
            if(y + yo < 0 || y + yo >= height)
                continue;

            if(mineCoordinates[y + yo][x + xo])
                count += 1;
        }
    }

    return count;
}

function renderCell(cell) {
    const type =
        cell.flagged ? "flagged" :
        !cell.revealed ? "blank" :
        cell.hasMine ? "mine" :
        "clicked";

    let content = undefined;
    if(type === "clicked" && cell.neighborMineCount !== 0)
        content = cell.neighborMineCount;

    return dom("td", {
        classes: [
            "cell",
            type,
            type === "clicked" && cell.neighborMineCount !== 0 ? `count-${cell.neighborMineCount}` : undefined
        ]
    }, [content]);
}
