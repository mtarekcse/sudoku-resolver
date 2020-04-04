let utils = require('./MatrixUtils.js')
let rules = require('./Solver.js').rules;
let draw_propability_matrix = require("./Solver").draw_propability_matrix;
let Super_Sum = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9;
class Grid {

    constructor(problem) {
        this.board = problem;
        this.rules = rules;
        this.changedCells = [];
    }

    getBoard() {
        return this.board;
    }

    is_resolved() {
        for (var index = 0; index < 9; index++) {
            if (utils.getSum(utils.getRow(this.board, index)) != Super_Sum || utils.getSum(utils.getColumn(this.board, index)) != Super_Sum) {
                return false;
            }
        }
        return true;
    }
    resolve() {
        let isBoardChanged = true;
        while (!this.is_resolved() && isBoardChanged) {
            isBoardChanged = false;
            this.rules.forEach(rule => {
                let probabilityMatrix = draw_propability_matrix(this.board);
                let isChanged = rule.apply(this.board, probabilityMatrix, this.changedCells);
                if (this.changedCells.length == 48)
                    console.log(this.changedCells.length);
                isBoardChanged = isBoardChanged || isChanged;
            });
        }
    }
    getChanges() {
        return this.changedCells;
    }
}
module.exports = Grid;