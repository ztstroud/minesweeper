import Board from "./Board.js";


const game = document.querySelector("#game");
const board = new Board(20, 20, 40);

let shiftKey = false;


function render() {
    game.innerHTML = "";
    game.appendChild(board.render());
}

game.addEventListener("click", event => {
    if(board.isOver())
        return;

    var bounds = game.getBoundingClientRect();
    var x = event.clientX - bounds.left;
    var y = event.clientY - bounds.top;

    var cellX = Math.floor(x / (bounds.width / board.width));
    var cellY = Math.floor(y / (bounds.height / board.height));
    
    if(shiftKey)
        board.flag(cellX, cellY);
    else
        board.reveal(cellX, cellY);

    render();
});

document.addEventListener("keydown", event => {
    if(event.keyCode === 16)
        shiftKey = true;
});

document.addEventListener("keyup", event => {
    if(event.keyCode === 16)
        shiftKey = false;
});

render();
