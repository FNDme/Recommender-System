export function solve(matrix: Array<Array<number | null>>, neighbours: number):
    Array<Array<number | null>> {
  const result: Array<Array<number | null>> = matrix;
  if (neighbours > matrix.length) {
    throw new Error("Neighbours count is bigger than matrix rows");
  }
  if (neighbours < 1) {
    throw new Error("Neighbours count is less than 1");
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === null) {
        matrix[i][j] = result[i][j] = solveByPearson(matrix, i, j, neighbours);
      }
    }
  }
  return result;
}

export function solveByPearson(matrix: Array<Array<number | null>>,
    i: number, j: number, numberOfNeighbours: number): number {
  const correlationMatrix: Array<number | null> =
    calculatePearson(matrix, i, j);
  const neighbours: [number, number][] =
    neighValue(correlationMatrix, numberOfNeighbours);
  const avgI: number = avgRow(matrix[i]);
  let numerator: number = 0;
  let denominator: number = 0;
  for (const neighbour of neighbours) {
    const avgJ: number = avgRow(matrix[neighbour[1]]);
    numerator +=
      (matrix[neighbour[1]][j] as number - avgJ) * neighbour[0];
    denominator += Math.abs(neighbour[0]);
  }
  return avgI + (numerator / denominator);
}

export function calculatePearson(matrix: Array<Array<number | null>>,
    i: number, j: number): Array<number | null> {
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

export function avgRow(row: Array<number | null>, baseRow: Array<number | null> = row): number {
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

export function matrixToString(matrix: Array<Array<number | null>>): string {
  let result = "";
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const value = typeof matrix[i][j] === 'number' ? matrix[i][j] as number : '-.--';
      result += typeof value === 'number' ? value.toFixed(2) : value;
      if (j !== matrix[i].length - 1) {
        result += " ";
      }
    }
    if (i !== matrix.length - 1) {
      result += "\n";
    }
  }
  return result;
}
