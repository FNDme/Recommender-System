export function solve(matrix, neighbours, algorithm = 'Pearson') {
    const result = matrix;
    if (neighbours > matrix.length) {
        throw new Error('Neighbours count is bigger than matrix rows');
    }
    if (neighbours < 1) {
        throw new Error('Neighbours count is less than 1');
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === null) {
                result[i][j] =
                    solveAlgorithm(matrix, i, j, algorithm, neighbours);
            }
        }
    }
    return [result, calculateCorrelations(matrix, algorithm)];
}
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
export function solveAlgorithm(matrix, i, j, algorithm, numberOfNeighbours) {
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
    const neighbours = neighValue(correlationArray, numberOfNeighbours);
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
    const result = [];
    for (let i = 0; i < values.length; i++) {
        if (values[i] !== null) {
            result.push([values[i], i]);
        }
    }
    result.sort((a, b) => b[0] - a[0]);
    return result.slice(0, neigh);
}
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