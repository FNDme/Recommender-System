"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMatrixSize = exports.checkMatrixTypes = exports.readMatrix = exports.neighValue = exports.avgRow = exports.calculatePearson = exports.solveByPearson = exports.solve = void 0;
const fs = __importStar(require("fs"));
const process_1 = require("process");
function solve(matrix, neighbours) {
    const result = matrix;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === null) {
                matrix[i][j] = result[i][j] = solveByPearson(matrix, i, j, neighbours);
            }
        }
    }
    return result;
}
exports.solve = solve;
function solveByPearson(matrix, i, j, numberOfNeighbours) {
    const correlationMatrix = calculatePearson(matrix, i, j);
    const neighbours = neighValue(correlationMatrix, numberOfNeighbours);
    const avgI = avgRow(matrix[i]);
    let numerator = 0;
    let denominator = 0;
    for (let k = 0; k < neighbours.length; k++) {
        const avgJ = avgRow(matrix[neighbours[k][1]]);
        if (typeof matrix[neighbours[k][1]][j] === 'number') {
            numerator +=
                (matrix[neighbours[k][1]][j] - avgJ) * neighbours[k][0];
            denominator += Math.abs(neighbours[k][0]);
        }
    }
    return avgI + (numerator / denominator);
}
exports.solveByPearson = solveByPearson;
function calculatePearson(matrix, i, j) {
    const correlationArray = [];
    const avgI = avgRow(matrix[i]);
    for (let k = 0; k < matrix.length; k++) {
        if (k !== i) {
            const avgK = avgRow(matrix[k], matrix[i]);
            let numerator = 0;
            let denominatorFirst = 0;
            let denominatorSecond = 0;
            for (let l = 0; l < matrix[k].length; l++) {
                if (typeof matrix[k][l] === 'number' &&
                    typeof matrix[i][l] === 'number') {
                    numerator +=
                        (matrix[k][l] - avgK) * (matrix[i][l] - avgI);
                    denominatorFirst += Math.pow((matrix[k][l] - avgK), 2);
                    denominatorSecond += Math.pow((matrix[i][l] - avgI), 2);
                }
            }
            correlationArray.push(numerator /
                (Math.sqrt(denominatorFirst) * Math.sqrt(denominatorSecond)));
        }
        else {
            correlationArray.push(null);
        }
    }
    return correlationArray;
}
exports.calculatePearson = calculatePearson;
function avgRow(row, baseRow = row) {
    let sum = 0;
    let nullCount = 0;
    for (let i = 0; i < row.length; i++) {
        if (typeof row[i] === 'number' && typeof baseRow[i] === 'number') {
            sum += row[i];
        }
        else {
            nullCount++;
        }
    }
    return sum / (row.length - nullCount);
}
exports.avgRow = avgRow;
function neighValue(values, neigh) {
    const result = []; // [value, index]
    for (let i = 0; i < neigh; i++) {
        let max = -Infinity;
        let maxIndex = -1;
        for (let j = 0; j < values.length; j++) {
            if (typeof values[j] === 'number' && values[j] > max) {
                max = values[j];
                maxIndex = j;
            }
        }
        result.push([max, maxIndex]);
        values[maxIndex] = -Infinity;
    }
    return result;
}
exports.neighValue = neighValue;
function readMatrix(file) {
    const data = fs.readFileSync(file, 'utf8');
    const rows = data.trim().split('\n');
    const result = [];
    for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].trim().split(' ');
        result.push([]);
        for (let j = 0; j < cols.length; j++) {
            if (cols[j] === '-') {
                result[i].push(null);
            }
            else {
                result[i].push(parseInt(cols[j], 10));
            }
        }
    }
    if (!checkMatrixTypes(result)) {
        console.error('Matrix is not valid');
        throw new Error('Invalid matrix');
    }
    if (!checkMatrixSize(result)) {
        console.error('Matrix size is not valid');
        throw new Error('Invalid matrix size');
    }
    return result;
}
exports.readMatrix = readMatrix;
function checkMatrixTypes(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (typeof matrix[i][j] !== 'number' && matrix[i][j] !== null) {
                return false;
            }
        }
    }
    return true;
}
exports.checkMatrixTypes = checkMatrixTypes;
function checkMatrixSize(matrix) {
    if (matrix.length < 2) {
        return false;
    }
    const size = matrix[0].length;
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].length < 2 || matrix[i].length !== size) {
            return false;
        }
    }
    return true;
}
exports.checkMatrixSize = checkMatrixSize;
if (process_1.argv[2]) {
    const matrix = readMatrix(process_1.argv[2]);
    const result = solve(matrix, process_1.argv[3] ? parseInt(process_1.argv[3], 10) : 1);
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            process.stdout.write(result[i][j]?.toFixed(2) + ' ');
        }
        process.stdout.write('\n');
    }
}
//# sourceMappingURL=index.js.map