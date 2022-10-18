var _a;
import * as fs from 'fs';
import { argv } from 'process';
export function solve(matrix, neighbours) {
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
export function solveByPearson(matrix, i, j, numberOfNeighbours) {
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
export function calculatePearson(matrix, i, j) {
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
export function avgRow(row, baseRow = row) {
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
export function neighValue(values, neigh) {
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
export function readMatrix(file) {
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
export function checkMatrixTypes(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (typeof matrix[i][j] !== 'number' && matrix[i][j] !== null) {
                return false;
            }
        }
    }
    return true;
}
export function checkMatrixSize(matrix) {
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
if (argv[2]) {
    const matrix = readMatrix(argv[2]);
    const result = solve(matrix, argv[3] ? parseInt(argv[3], 10) : 1);
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            process.stdout.write(((_a = result[i][j]) === null || _a === void 0 ? void 0 : _a.toFixed(2)) + ' ');
        }
        process.stdout.write('\n');
    }
}
//# sourceMappingURL=functions.js.map