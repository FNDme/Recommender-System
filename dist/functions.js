import * as fs from 'fs';
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
    for (const neighbour of neighbours) {
        const avgJ = avgRow(matrix[neighbour[1]]);
        numerator +=
            (matrix[neighbour[1]][j] - avgJ) * neighbour[0];
        denominator += Math.abs(neighbour[0]);
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
    if (!fs.existsSync(file)) {
        throw new Error('File does not exist');
    }
    const data = fs.readFileSync(file, 'utf8');
    if (data === '') {
        throw new Error('File is empty');
    }
    const rows = data.trim().split('\n');
    if (rows.length < 2) {
        throw new Error('File does not contain enough rows');
    }
    const result = [];
    const rowSize = rows[0].trim().split(' ').length;
    for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].trim().split(' ');
        if (cols.length !== rowSize) {
            throw new Error('File does not contain a valid matrix');
        }
        result.push([]);
        for (const col of cols) {
            if (col === '-') {
                result[i].push(null);
            }
            else if (!isNaN(Number(col))) {
                result[i].push(parseInt(col, 10));
            }
            else {
                throw new Error('Invalid matrix');
            }
        }
    }
    return result;
}
//# sourceMappingURL=functions.js.map