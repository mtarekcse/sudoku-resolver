var _ = require('lodash')

/* Rows */
this.getRow = function (matrix, row_index) {
    return matrix[row_index];
}
this.setRow = function (matrix, row_index, row) {
    matrix[row_index] = row;
}

/* Columns */
this.getColumn = function (matrix, column_index) {
    return this.getRow(_.unzip(matrix), column_index);
}
this.setColumn = function (matrix, column_index, column) {
    matrix.forEach((row, index) => row[column_index] = column[index]);
}
/* Subgrids */
this.getsubgrid = function (matrix, subgrid_index) {

    let row_start = 3 * Math.floor(subgrid_index / 3);
    let column_start = 3 * (subgrid_index % 3);
    // subgrid is located in the inclusive range [row_start:row_start+2],[column_start :column_start + 2]
    let row1 = _.slice(this.getRow(matrix, row_start), column_start, column_start + 3);
    let row2 = _.slice(this.getRow(matrix, row_start + 1), column_start, column_start + 3);
    let row3 = _.slice(this.getRow(matrix, row_start + 2), column_start, column_start + 3);
    return _.concat(row1, row2, row3);
}
this.setsubgrid = function (matrix,subgrid_index, subgrid) {
    
    let row_start = 3 * Math.floor(subgrid_index / 3);
    let column_start = 3 * (subgrid_index % 3);

    var row1 = this.getRow(matrix,board, row_start);
    var row2 = this.getRow(matrix,board, row_start + 1);
    var row3 = this.getRow(matrix,board, row_start + 2);

    row1.splice(column_start, 3, _.slice(subgrid, 0, 3));
    row2.splice(column_start, 3, _.slice(subgrid, 3, 6));
    row3.splice(column_start, 3, _.slice(subgrid, 6, 9));

    this.setRow(matrix,row_start, row1);
    this.setRow(matrix,row_start + 1, row2);
    this.setRow(matrix,row_start + 2, row3);
}
this.getsubgridIndex = function (row_index, column_index) {
    // get subgrid index for a certain cell
    return (3 * Math.floor(row_index / 3) + Math.floor(column_index / 3));
}
this.getSum = function (array) {
    // get sum of an array
    return _.sum(array);
}

module.exports = this;