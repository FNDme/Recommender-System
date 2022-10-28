/**
 * @title function.ts
 * @description Functions needed to solve the problem
 */

/**
 * @type algorithm Which algorithm is going to be used.
 */
export type algorithm = 'Pearson' | 'Cosine' | 'Euclidean';

/**
 * Return the solved matrix
 * @param matrix Matrix made of numbers and nulls
 * @param neighbors Numbers of neighbors to choose
 * @param algorithm Which algorithm are we going to use
 */
export function solve(matrix: Array<Array<number | null>>,
    neighbors: number, algorithm: algorithm = 'Pearson'):
    [Array<Array<number | null>>, Array<Array<number | null>>] {
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
export function calculateCorrelations(matrix: Array<Array<number | null>>,
    algorithm: algorithm): Array<Array<number | null>> {
  const correlationMatrix: Array<Array<number | null>> = [];
  for (let i = 0; i < matrix.length; i++) {
    correlationMatrix[i] = [];
    for (let j = 0; j < matrix.length; j++) {
      correlationMatrix[i][j] = null;
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    let row: Array<number | null> = [];
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
export function solveAlgorithm(matrix: Array<Array<number | null>>,
    i: number, j: number, algorithm: algorithm, numberOfNeighbors: number):
    number {
  let correlationArray: Array<number | null>;
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
  const neighbors: [number, number][] =
    neighValue(correlationArray, numberOfNeighbors);
  const avgI: number = avgRow(matrix[i]);
  let numerator: number = 0;
  let denominator: number = 0;
  for (const neighbor of neighbors) {
    const avgJ: number = avgRow(matrix[neighbor[1]]);
    numerator +=
      (matrix[neighbor[1]][j] as number - avgJ) * neighbor[0];
    denominator += Math.abs(neighbor[0]);
  }
  return avgI + (numerator / denominator);
}

/**
 * Function to calculate the correlation by Pearson
 * @param matrix Matrix
 * @param i Row
 */
export function calculatePearson(matrix: Array<Array<number | null>>,
    i: number): Array<number | null> {
  const correlationArray: Array<number | null> = [];
  const avgI: number = avgRow(matrix[i]);
  for (let k = 0; k < matrix.length; k++) {
    if (k !== i) {
      const avgK: number = avgRow(matrix[k], matrix[i]);
      let numerator: number = 0;
      let denominatorFirst: number = 0;
      let denominatorSecond: number = 0;
      for (let l = 0; l < matrix[k].length; l++) {
        if (typeof matrix[k][l] === 'number' &&
            typeof matrix[i][l] === 'number') {
          numerator +=
            (matrix[k][l] as number - avgK) * (matrix[i][l] as number - avgI);
          denominatorFirst += Math.pow((matrix[k][l] as number - avgK), 2);
          denominatorSecond += Math.pow((matrix[i][l] as number - avgI), 2);
        }
      }
      correlationArray.push(numerator /
      (Math.sqrt(denominatorFirst) * Math.sqrt(denominatorSecond)));
    } else {
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
export function calculateCosine(matrix: Array<Array<number | null>>,
    i: number): Array<number | null> {
  const correlationArray: Array<number | null> = [];
  for (let k = 0; k < matrix.length; k++) {
    if (k !== i) {
      let numerator: number = 0;
      let denominatorFirst: number = 0;
      let denominatorSecond: number = 0;
      for (let l = 0; l < matrix[k].length; l++) {
        if (typeof matrix[k][l] === 'number' &&
            typeof matrix[i][l] === 'number') {
          numerator += (matrix[k][l] as number) * (matrix[i][l] as number);
          denominatorFirst += Math.pow((matrix[k][l] as number), 2);
          denominatorSecond += Math.pow((matrix[i][l] as number), 2);
        }
      }
      correlationArray.push(numerator /
      (Math.sqrt(denominatorFirst) * Math.sqrt(denominatorSecond)));
    } else {
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
export function calculateEuclidean(matrix: Array<Array<number | null>>,
    i: number): Array<number | null> {
  const correlationArray: Array<number | null> = [];
  for (let k = 0; k < matrix.length; k++) {
    if (k !== i) {
      let value: number = 0;
      for (let l = 0; l < matrix[k].length; l++) {
        if (typeof matrix[k][l] === 'number' &&
            typeof matrix[i][l] === 'number') {
          value += Math.pow((matrix[k][l] as number) -
          (matrix[i][l] as number), 2);
        }
      }
      correlationArray.push(Math.sqrt(value));
    } else {
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
export function avgRow(row: Array<number | null>,
    baseRow: Array<number | null> = row): number {
  let sum: number = 0;
  let nullCount: number = 0;

  for (let i = 0; i < row.length; i++) {
    if (typeof row[i] === 'number' && typeof baseRow[i] === 'number') {
      sum += row[i] as number;
    } else {
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
export function neighValue(values: Array<number | null>,
    neigh: number): [number, number][] {
  const result: [number, number][] = [];
  for (let i = 0; i < values.length; i++) {
    if (values[i] !== null) {
      result.push([values[i] as number, i]);
    }
  }
  result.sort((a, b) => b[0] - a[0]);
  return result.slice(0, neigh);
}

/**
 * Function to transform a matrix into a string
 * @param matrix Matrix
 */
export function matrixToString(matrix: Array<Array<number | null>>): string {
  let result = '';
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const value = typeof matrix[i][j] === 'number' ?
      matrix[i][j] as number : '-.--';
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
