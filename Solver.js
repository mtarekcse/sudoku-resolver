let _ = require('lodash');
let utils = require('./MatrixUtils.js')

module.exports.rules = [
    {
        "index": 0,
        "apply": function (board, propability_matrix, changedCells) {
            // if a cell's probabilities contains a single record , it must be there!
            let status = false;
            propability_matrix.forEach((row, row_index) => {
                row.forEach((cell, cell_index) => {
                    if (cell && cell.length == 1) {
                        board[row_index][cell_index] = cell[0];
                        status = true;
                        changedCells.push({ 'row': row_index, 'column': cell_index, 'value': cell[0] });
                    }
                })
            })
            return status;
        }
    }, {
        "index": 1,
        "apply": function (board, propability_matrix, changedCells) {
            // if a record's possibilities in a single cell of a row , it must be there!
            let status = false;
            for (var row_index = 0; row_index < 9; row_index++) {
                let row = utils.getRow(propability_matrix, row_index);
                let row_items = {};
                row.forEach((cell, cell_index) => {
                    if (cell) {
                        cell.forEach(item => {
                            row_items[item] = row_items[item] || [];
                            row_items[item].push(cell_index);
                        })
                    }
                })
                let values = _.keys(row_items);
                values.forEach(value => {
                    if (row_items[value].length == 1) {
                        let cell_index = row_items[value][0];
                        board[row_index][cell_index] = +value;
                        status = true;
                        changedCells.push({ 'row': row_index, 'column': cell_index, 'value': +value });
                    }
                })
            }
            return status;
        },
    }, {
        "index": 2,
        "apply": function (board, propability_matrix, changedCells) {
            // if a record's possibilities in a single cell of a column , it must be there!
            let status = false;
            for (var column_index = 0; column_index < 9; column_index++) {
                let column = utils.getColumn(propability_matrix, column_index);
                let column_items = {};
                column.forEach((cell, cell_index) => {
                    if (cell) {
                        cell.forEach(item => {
                            column_items[item] = column_items[item] || [];
                            column_items[item].push(cell_index);
                        })
                    }
                })
                
                let values =_.keys(column_items);
                values.forEach(value => {
                    if (column_items[value].length == 1) {
                        let cell_index = column_items[value][0];
                        board[cell_index][column_index] = +value;
                        status = true;
                        changedCells.push({ 'row': cell_index, 'column': column_index, 'value': +value });
                    }
                })
            }
            return status;
        }
    }, {
        "index": 3,
        "apply": function (board, propability_matrix, changedCells) {
            // if a record's possibilities in a single cell of a subgrid , it must be there!
            let status = false;
            for (var subgrid_index = 0; subgrid_index < 9; subgrid_index++) {
                let subgrid = utils.getsubgrid(propability_matrix, subgrid_index);
                let subgrid_items = {};
                subgrid.forEach((cell, cell_index) => {
                    if (cell) {
                        cell.forEach(item => {
                            subgrid_items[item] = subgrid_items[item] || [];
                            let row_index = 3 * Math.floor(subgrid_index / 3) + Math.floor(cell_index / 3);
                            let column_index = 3 * (subgrid_index % 3) + (cell_index % 3);
                            subgrid_items[item].push({ "row_index": row_index, "column_index": column_index });
                        })
                    }
                })
                let values = _.keys(subgrid_items);
                values.forEach(value => {
                    if (subgrid_items[value].length == 1) {
                        let cell_object = subgrid_items[value][0];
                        let row_index = cell_object["row_index"];
                        let column_index = cell_object["column_index"];
                        board[row_index][column_index] = +value;
                        changedCells.push({ 'row': row_index, 'column': column_index, 'value': +value });
                        status = true;
                    }
                })
            }
            return status;
        }
    }
];
module.exports.draw_propability_matrix = function (board) {
    let propability_matrix = [];
    _.each(board, (row, row_index) => {
        let row_entries = [];
        _.each(row, (cell, cell_index) => {
            if (cell > 0) {
                row_entries.push(undefined);
            } else {
                let probableValues = getProbableValues(board, row_index, cell_index);
                row_entries.push(probableValues);
            }
        })
        propability_matrix[row_index] = row_entries;
    })
    /* check if a subgrid contains a full entries but with missing numbers in a single row or a single column*/
    for (var subgrid_index = 0; subgrid_index < 9; subgrid_index++) {
        let subgrid = utils.getsubgrid(propability_matrix, subgrid_index);
        let rows_data = {}, columns_data = {};
        _.each(subgrid, (cell, cell_index) => {
            if (cell) {
                // get row_index & row_index from subgrid_index and cell_index

                let row_index = 3 * Math.floor(subgrid_index / 3) + Math.floor(cell_index / 3);
                let column_index = 3 * (subgrid_index % 3) + (cell_index % 3);

                rows_data[row_index] = rows_data[row_index] || {};
                rows_data[row_index][column_index] = cell;

                columns_data[column_index] = columns_data[column_index] || {};
                columns_data[column_index][row_index] = cell;
            }
        })
        if (_.size(rows_data) == 1) {
            // if all elements in the subgrid are in the same row
            let rows_data_index = _.keys(rows_data);
            let row_index = +rows_data_index[0];
            let row_data_probabilities = rows_data[rows_data_index];
            let rowIndices = [];
            let possibleValues = [];

            _.each(row_data_probabilities, (probabilities, index) => {
                rowIndices.push(+index);
                possibleValues = _.uniq(_.union(possibleValues, probabilities));
            })

            let row_possible_records = utils.getRow(propability_matrix, row_index);
            _.each(row_possible_records, (cell, cell_index) => {
                if (cell && rowIndices.indexOf(cell_index) == -1) {
                    row_possible_records[cell_index] = _.difference(cell, possibleValues);
                }
            })
            utils.setRow(propability_matrix, row_index, row_possible_records);
        }
        if (_.size(columns_data) == 1) {
            // if all elements in the subgrid are in the same column
            let columns_data_index = _.keys(columns_data);
            let column_index = +columns_data_index[0];
            let column_data_probabilities = columns_data[columns_data_index];
            let columnIndices = [];
            let possibleValues = [];

            _.each(column_data_probabilities, (probabilities, index) => {
                columnIndices.push(+index);
                possibleValues = _.uniq(_.union(possibleValues, probabilities));
            })

            let column_possible_records = utils.getColumn(propability_matrix, column_index);
            _.each(column_possible_records, (cell, cell_index) => {
                if (cell && columnIndices.indexOf(cell_index) == -1) {
                    column_possible_records[cell_index] = _.difference(cell, possibleValues);
                }
            })
            utils.setColumn(propability_matrix, column_index, column_possible_records);
        }
    }
    return propability_matrix;
}
let getProbableValues = function (board, row_index, column_index) {
    // get all probable values for a cell given it's column, row & subgrid
    let row = utils.getRow(board, row_index);
    let column = utils.getColumn(board, column_index);
    let subgrid = utils.getsubgrid(board, utils.getsubgridIndex(row_index, column_index));
    return _.difference(_.range(1, 10), _.union(row, column, subgrid));
}