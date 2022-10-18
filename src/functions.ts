export function solve(matrix: Array<Array<number | null>>, neighbours: number):
    Array<Array<number | null>> {
  const result: Array<Array<number | null>> = matrix;
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
  const result: [number, number][] = []; // [value, index]
  for (let i = 0; i < neigh; i++) {
    let max: number = -Infinity;
    let maxIndex: number = -1;
    for (let j = 0; j < values.length; j++) {
      if (typeof values[j] === 'number' && values[j] as number > max) {
        max = values[j] as number;
        maxIndex = j;
      }
    }
    result.push([max, maxIndex]);
    values[maxIndex] = -Infinity;
  }
  return result;
}

export function readMatrix(input: HTMLInputElement): Promise<Array<Array<number | null>>> {
  return new Promise(async (resolve, reject) => {
    const file = input.files?.item(0);
    const data = await file?.text();
    if (data) {
      const rows: string[] = data.trim().split('\n');
      if (rows.length < 2) {
        reject("File must contain enough rows");
      }
      const result: Array<Array<number | null>> = [];
      const rowSize = rows[0].trim().split(' ').length;
      for (let i = 0; i < rows.length; i++) {
        const cols: string[] = rows[i].trim().split(' ');
        if (cols.length !== rowSize) {
          reject("File does not contain a valid matrix");
        }
        result.push([]);
        for (const col of cols) {
          if (col === '-') {
            result[i].push(null);
          } else if (isNaN(Number(col))) {
            reject("Invalid value in file");
          }
          result[i].push(parseInt(col, 10));
        }
      }
      resolve(result);
    }
    reject("File is empty");
  });
}

export function matrixToString(matrix: Array<Array<number | null>>): string {
  let result = "";
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      result += matrix[i][j] === null ? '-.--' : matrix[i][j]?.toFixed(2);
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
