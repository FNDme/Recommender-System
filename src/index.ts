import * as fs from 'fs';

export function solve(matriz: Array<Array<number | null>>, neighbours: number):
    Array<Array<number | null>> {
  const result: Array<Array<number | null>> = matriz;
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      if (matriz[i][j] === null) {
        matriz[i][j] = result[i][j] = solveByPearson(matriz, i, j, neighbours);
      }
    }
  }
  return result;
}

export function solveByPearson(matriz: Array<Array<number | null>>,
    i: number, j: number, numberOfNeighbours: number): number {
  const correlationMatrix: Array<number | null> =
    calculatePearson(matriz, i, j);
  const neighbours: [number, number][] =
    neighValue(correlationMatrix, numberOfNeighbours);
  const avgI: number = avgRow(matriz[i]);
  let numerator: number = 0;
  let denominator: number = 0;
  for (let k = 0; k < neighbours.length; k++) {
    const avgJ: number = avgRow(matriz[neighbours[k][1]]);
    if (typeof matriz[neighbours[k][1]][j] === 'number') {
      numerator +=
        (matriz[neighbours[k][1]][j] as number - avgJ) * neighbours[k][0];
      denominator += Math.abs(neighbours[k][0]);
    }
  }
  return avgI + (numerator / denominator);
}

export function calculatePearson(matriz: Array<Array<number | null>>,
    i: number, j: number): Array<number | null> {
  const correlationMatrix: Array<number | null> = [];
  const avgI: number = avgRow(matriz[i]);
  for (let k = 0; k < matriz.length; k++) {
    if (k !== i) {
      const avgK: number = avgRow(matriz[k]);
      let numerator: number = 0;
      let denominatorFirst: number = 0;
      let denominatorSecond: number = 0;
      for (let l = 0; l < matriz[k].length; l++) {
        if (typeof matriz[k][l] === 'number' &&
            typeof matriz[i][l] === 'number') {
          numerator +=
            (matriz[k][l] as number - avgK) * (matriz[i][l] as number - avgI);
          denominatorFirst += Math.pow((matriz[k][l] as number - avgK), 2);
          denominatorSecond += Math.pow((matriz[i][l] as number - avgI), 2);
        }
      }
      correlationMatrix.push(numerator /
      (Math.sqrt(denominatorFirst) * Math.sqrt(denominatorSecond)));
    } else {
      correlationMatrix.push(null);
    }
  }
  return correlationMatrix;
}

export function avgRow(row: Array<number | null>): number {
  let sum: number = 0;
  let nullCount: number = 0;

  for (let i = 0; i < row.length; i++) {
    if (typeof row[i] === 'number') {
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

export function readMatrix(file: string): Array<Array<number | null>> {
  const data: string = fs.readFileSync(file, 'utf8');
  const rows: string[] = data.split('\r');
  const result: Array<Array<number | null>> = [];
  for (let i = 0; i < rows.length; i++) {
    const cols: string[] = rows[i].split(' ');
    result.push([]);
    for (let j = 0; j < cols.length; j++) {
      if (cols[j] === '-') {
        result[i].push(null);
      } else {
        result[i].push(parseInt(cols[j], 10));
      }
    }
  }
  return result;
}
