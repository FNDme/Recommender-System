import * as fs from 'fs';

function solve(matriz: Array<Array<number | null>>, neighbours: number):
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

function solveByPearson(matriz: Array<Array<number | null>>,
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

function calculatePearson(matriz: Array<Array<number | null>>,
    i: number, j: number): Array<number | null> {
  const correlationMatrix: Array<number | null> = [];
  const avgI: number = avgRow(matriz[i]);
  for (let k = 0; k < matriz.length; k++) {
    if (k !== i) {
      const avgK: number = avgRow(matriz[k]);
      let correlation: number = 0;
      let numerator: number = 0;
      let denominator: number = 0;
      for (let l = 0; l < matriz[k].length; l++) {
        if (typeof matriz[k][l] === 'number' &&
            typeof matriz[i][l] === 'number') {
          numerator +=
            (matriz[k][l] as number - avgK) *
            (matriz[i][l] as number - avgI);
          denominator +=
            Math.sqrt(Math.pow((matriz[k][l] as number - avgK), 2)) *
            Math.sqrt(Math.pow((matriz[i][l] as number - avgI), 2));
        }
      }
      correlation = numerator / denominator;
      correlationMatrix.push(correlation);
    } else {
      correlationMatrix.push(null);
    }
  }
  return correlationMatrix;
}

function avgRow(row: Array<number | null>): number {
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

function neighValue(values: Array<number | null>,
    neigh: number): [number, number][] {
  const result: [number, number][] = []; // [value, index]
  for (let i = 0; i < values.length; i++) {
    if (typeof values[i] === 'number' && result.length < neigh) {
      result.push([values[i] as number, i]);
    } else if (typeof values[i] === 'number' && result.length === neigh) {
      for (let j = 0; j < result.length; j++) {
        if (values[i] as number > result[j][0]) {
          result[j] = [values[i] as number, i];
          break;
        }
      }
    }
  }
  return result;
}

function readMatrix(file: string): Array<Array<number | null>> {
  const lines: string[] = fs.readFileSync(file).toString().split('\r');
  const result: Array<Array<number | null>> = [];
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].trim();
    if (lines[i] !== '') {
      result.push(lines[i].split(' ').map((value: string) => {
        if (value === '-') {
          return null;
        } else {
          return Number(value);
        }
      }));
    }
  }
  return result;
}

const input: string = process.argv[2];
const matriz = readMatrix(input);

console.log('Original matrix');
for (let i = 0; i < matriz.length; i++) {
  for (let j = 0; j < matriz[i].length; j++) {
    if (typeof matriz[i][j] === 'number') {
      process.stdout.write(matriz[i][j]?.toFixed(2) + ' ');
    } else {
      process.stdout.write('---- ');
    }
  }
  process.stdout.write('\n');
}

const solution = solve(matriz, 3);

console.log('\nSolution matrix');
for (let i = 0; i < solution.length; i++) {
  for (let j = 0; j < solution[i].length; j++) {
    if (solution[i][j] as number % 1 === 0) {
      process.stdout.write(solution[i][j]?.toFixed() + '.-- ');
    } else {
      process.stdout.write('\x1b[34m' + solution[i][j]?.toFixed(2) +
          '\x1b[0m ');
    }
  }
  process.stdout.write('\n');
}
