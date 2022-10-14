let matriz: Array<Array<number | null>> = [[4,null,null,0,2,null,3,null,0,null],
                                           [null,4,4,1,1,3,0,null,null,2],
                                           [2,5,1,2,1,5,5,5,2,0],
                                           [1,4,1,3,1,null,1,0,0,0],
                                           [0,3,4,0,0,5,5,4,5,null]];

function solve(matriz: Array<Array<number | null>>, neighbours: number): Array<Array<number | null>> {
  let result: Array<Array<number | null>> = matriz;
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      if (matriz[i][j] === null) {
        matriz[i][j] = result[i][j] = solveByPearson(matriz, i, j, neighbours);
      }
    }
  }
  return result;
}

function solveByPearson(matriz: Array<Array<number | null>>, i: number, j: number, numberOfNeighbours: number): number {
  let correlationMatrix: Array<number | null> = calculatePearson(matriz, i, j);
  let neighbours: [number, number][] = neighValue(correlationMatrix, numberOfNeighbours);
  let avgI: number = avgRow(matriz[i]);
  let numerator: number = 0;
  let denominator: number = 0;
  
}

function calculatePearson(matriz: Array<Array<number | null>>, i: number, j: number): Array<number | null> {
  let correlationMatrix: Array<number | null> = [];
  let avgI: number = avgRow(matriz[i]);
  for (let k = 0; k < matriz.length; k++) {
    if (k !== i) {
    let correlation: number = 0;
    let avgK: number = avgRow(matriz[k]);
    let numerator: number = 0;
    let denominator: number = 0;
    for (let l = 0; l < matriz[k].length; l++) {
      if (typeof matriz[k][l] === 'number' && typeof matriz[i][l] === 'number') {
        numerator += (matriz[k][l] as number - avgK) * (matriz[i][l] as number - avgI);
        denominator += Math.sqrt(Math.pow((matriz[k][l] as number - avgK), 2)) * Math.sqrt(Math.pow((matriz[i][l] as number - avgI), 2));
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

function avgRow(row : Array<number | null>): number {
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

function neighValue(values : Array<number | null>, neigh : number): [number, number][] {
  let result: [number, number][] = []; // [value, index]
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

