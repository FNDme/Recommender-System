/**
 * @title function.ts
 * @description Functions needed to solve the problem
 */
/**
 * Return the solved matrix
 * @param matrix Matrix made of numbers and nulls
 * @param neighbors Numbers of neighbors to choose
 * @param algorithm Which algorithm are we going to use
 */
export function solve(matrix, neighbors, algorithm = 'Pearson') {
    const result = structuredClone(matrix);
    if (neighbors > matrix.length) {
        throw new Error('Neighbors count is bigger than matrix rows');
    }
    if (neighbors < 1) {
        throw new Error('Neighbors count is less than 1');
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === null) {
                result[i][j] =
                    solveAlgorithm(matrix, i, j, algorithm, neighbors);
            }
        }
    }
    return [result, calculateCorrelations(matrix, algorithm)];
}
/**
 * @description It calculates the correlation for an item of the matrix
 * @type {Array} Matrix made of numbers and nulls
 * @param matrix Matrix where we are going to calculate the correlation
 * @param algorithm Which algorithm are we going to use
 * @returns Array of correlations
 */
export function calculateCorrelations(matrix, algorithm) {
    const correlationMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
        correlationMatrix[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            correlationMatrix[i][j] = null;
        }
    }
    for (let i = 0; i < matrix.length; i++) {
        let row = [];
        switch (algorithm) {
            case 'Euclidean':
                row = calculateEuclidean(matrix, i);
                break;
            case 'Cosine':
                row = calculateCosine(matrix, i);
                break;
            case 'Pearson':
                row = calculatePearson(matrix, i);
                break;
        }
        for (let j = 0; j < row.length; j++) {
            correlationMatrix[i][j] = row[j];
        }
    }
    return correlationMatrix;
}
/**
 * This function calculates the final number in the matrix
 * @param matrix Matrix to solve
 * @param i Row
 * @param j Col
 * @param algorithm Which algorithm are we going to use
 * @param numberOfNeighbors numbers of neighbors to calculate the number
 */
export function solveAlgorithm(matrix, i, j, algorithm, numberOfNeighbors) {
    let correlationArray;
    switch (algorithm) {
        case 'Pearson':
            correlationArray = calculatePearson(matrix, i);
            break;
        case 'Cosine':
            correlationArray = calculateCosine(matrix, i);
            break;
        case 'Euclidean':
            correlationArray = calculateEuclidean(matrix, i);
            break;
    }
    const neighbors = neighValue(correlationArray, numberOfNeighbors);
    const avgI = avgRow(matrix[i]);
    let numerator = 0;
    let denominator = 0;
    for (const neighbor of neighbors) {
        const avgJ = avgRow(matrix[neighbor[1]]);
        numerator +=
            (matrix[neighbor[1]][j] - avgJ) * neighbor[0];
        denominator += Math.abs(neighbor[0]);
    }
    return avgI + (numerator / denominator);
}
/**
 * Function to calculate the correlation by Pearson
 * @param matrix Matrix
 * @param i Row
 */
export function calculatePearson(matrix, i) {
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
/**
 * Function to calculate the correlation by Cosine Distance
 * @param matrix Matrix
 * @param i Row
 */
export function calculateCosine(matrix, i) {
    const correlationArray = [];
    for (let k = 0; k < matrix.length; k++) {
        if (k !== i) {
            let numerator = 0;
            let denominatorFirst = 0;
            let denominatorSecond = 0;
            for (let l = 0; l < matrix[k].length; l++) {
                if (typeof matrix[k][l] === 'number' &&
                    typeof matrix[i][l] === 'number') {
                    numerator += matrix[k][l] * matrix[i][l];
                    denominatorFirst += Math.pow(matrix[k][l], 2);
                    denominatorSecond += Math.pow(matrix[i][l], 2);
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
/**
 * Function to calculate the correlation by Euclidean Distance
 * @param matrix Matrix
 * @param i Row
 */
export function calculateEuclidean(matrix, i) {
    const correlationArray = [];
    for (let k = 0; k < matrix.length; k++) {
        if (k !== i) {
            let value = 0;
            for (let l = 0; l < matrix[k].length; l++) {
                if (typeof matrix[k][l] === 'number' &&
                    typeof matrix[i][l] === 'number') {
                    value += Math.pow(matrix[k][l] -
                        matrix[i][l], 2);
                }
            }
            correlationArray.push(Math.sqrt(value));
        }
        else {
            correlationArray.push(null);
        }
    }
    return correlationArray;
}
/**
 * Function to calculate the average of a row
 * @param row
 * @param baseRow row to compare
 */
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
/**
 * Function to return the N higher neighbors
 * @param values Array of neighbors
 * @param neigh Number of neighbors
 */
export function neighValue(values, neigh) {
    const result = [];
    for (let i = 0; i < values.length; i++) {
        if (values[i] !== null) {
            result.push([values[i], i]);
        }
    }
    result.sort((a, b) => b[0] - a[0]);
    return result.slice(0, neigh);
}
/**
 * Function to transform a matrix into a string
 * @param matrix Matrix
 */
export function matrixToString(matrix) {
    let result = '';
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const value = typeof matrix[i][j] === 'number' ?
                matrix[i][j] : '-.--';
            result += typeof value === 'number' ? value.toFixed(2) : value;
            if (j !== matrix[i].length - 1) {
                result += ' ';
            }
        }
        if (i !== matrix.length - 1) {
            result += '\n';
        }
    }
    return result;
}
//# sourceMappingURL=functions.js.map