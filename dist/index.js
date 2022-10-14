"use strict";
function solve(matriz, neighbours) {
    const result = matriz;
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] === null) {
                matriz[i][j] = result[i][j] = solveByPearson(matriz, i, j, neighbours);
            }
        }
    }
    return result;
}
function solveByPearson(matriz, i, j, numberOfNeighbours) {
    const correlationMatrix = calculatePearson(matriz, i, j);
    const neighbours = neighValue(correlationMatrix, numberOfNeighbours);
    const avgI = avgRow(matriz[i]);
    let numerator = 0;
    let denominator = 0;
    for (let k = 0; k < neighbours.length; k++) {
        const avgJ = avgRow(matriz[neighbours[k][1]]);
        if (typeof matriz[neighbours[k][1]][j] === 'number') {
            numerator +=
                (matriz[neighbours[k][1]][j] - avgJ) * neighbours[k][0];
            denominator += Math.abs(neighbours[k][0]);
        }
    }
    return avgI + (numerator / denominator);
}
function calculatePearson(matriz, i, j) {
    const correlationMatrix = [];
    const avgI = avgRow(matriz[i]);
    for (let k = 0; k < matriz.length; k++) {
        if (k !== i) {
            const avgK = avgRow(matriz[k]);
            let correlation = 0;
            let numerator = 0;
            let denominator = 0;
            for (let l = 0; l < matriz[k].length; l++) {
                if (typeof matriz[k][l] === 'number' &&
                    typeof matriz[i][l] === 'number') {
                    numerator +=
                        (matriz[k][l] - avgK) *
                            (matriz[i][l] - avgI);
                    denominator +=
                        Math.sqrt(Math.pow((matriz[k][l] - avgK), 2)) *
                            Math.sqrt(Math.pow((matriz[i][l] - avgI), 2));
                }
            }
            correlation = numerator / denominator;
            correlationMatrix.push(correlation);
        }
        else {
            correlationMatrix.push(null);
        }
    }
    return correlationMatrix;
}
function avgRow(row) {
    let sum = 0;
    let nullCount = 0;
    for (let i = 0; i < row.length; i++) {
        if (typeof row[i] === 'number') {
            sum += row[i];
        }
        else {
            nullCount++;
        }
    }
    return sum / (row.length - nullCount);
}
function neighValue(values, neigh) {
    const result = []; // [value, index]
    for (let i = 0; i < values.length; i++) {
        if (typeof values[i] === 'number' && result.length < neigh) {
            result.push([values[i], i]);
        }
        else if (typeof values[i] === 'number' && result.length === neigh) {
            for (let j = 0; j < result.length; j++) {
                if (values[i] > result[j][0]) {
                    result[j] = [values[i], i];
                    break;
                }
            }
        }
    }
    return result;
}
const matriz = [[4, null, null, 0, 2, null, 3, null, 0, null],
    [null, 4, 4, 1, 1, 3, 0, null, null, 2],
    [2, 5, 1, 2, 1, 5, 5, 5, 2, 0],
    [1, 4, 1, 3, 1, null, 1, 0, 0, 0],
    [0, 3, 4, 0, 0, 5, 5, 4, 5, null]];
const solution = solve(matriz, 3);
for (let i = 0; i < solution.length; i++) {
    for (let j = 0; j < solution[i].length; j++) {
        process.stdout.write(solution[i][j]?.toFixed(2) + ' ');
    }
    process.stdout.write('\n');
}
