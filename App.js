var Board = require('./Grid');

let problem = [
    [2, 0, 0, 0, 0, 0, 1, 9, 0],
    [0, 1, 0, 9, 0, 0, 0, 3, 6],
    [0, 0, 3, 8, 0, 0, 7, 0, 0],

    [0, 0, 0, 0, 0, 0, 0, 0, 7],
    [0, 8, 0, 1, 4, 9, 0, 5, 0],
    [3, 0, 0, 0, 0, 0, 0, 0, 0],

    [0, 0, 5, 0, 0, 1, 2, 0, 0],
    [1, 4, 0, 0, 0, 5, 0, 6, 0],
    [0, 7, 6, 0, 0, 0, 0, 0, 1],
];
let game = new Board(problem);
game.resolve();
if(game.is_resolved()){
    console.log("Game is resolved!\nThe solution is:");
}
else{
    console.log("Failed to resolve :(\nBut we may simplify the game to:");
}
console.log(game.getBoard());