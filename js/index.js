import Board from "./Board.js";


const board = new Board(20, 20, 25);
document.querySelector("#game").appendChild(board.render());
