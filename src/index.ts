const enableBTN = [false, false]; // file - neighbours

document.getElementById("file-input")?.addEventListener("change", function (event) {
  if (event.target instanceof HTMLInputElement) {
    enableBTN[0] = true;
    if (enableBTN[0] && enableBTN[1]) {
      document.getElementById("submit-btn")?.removeAttribute("disabled");
    } else {
      if (!document.getElementById("submit")?.hasAttribute("disabled")) {
        document.getElementById("submit")?.setAttribute("disabled", "");
      }
    }
  }
});

document.getElementById("neighbours-input")?.addEventListener("change", function (event) {
  if (event.target instanceof HTMLInputElement) {
    enableBTN[1] = true;
    if (enableBTN[0] && enableBTN[1]) {
      document.getElementById("submit-btn")?.removeAttribute("disabled");
    } else {
      if (!document.getElementById("submit")?.hasAttribute("disabled")) {
        document.getElementById("submit")?.setAttribute("disabled", "");
      }
    }
  }
});

document.getElementById("submit-btn")?.addEventListener("click", function (event) {
  if (event.target instanceof HTMLButtonElement) {
    const file = document.getElementById("file-input") as HTMLInputElement;
    const neighbours = document.getElementById("neighbours-input") as HTMLInputElement;
    const resultDiv = document.getElementById("solution") as HTMLDivElement;
    const response = document.getElementById("response-block") as HTMLDivElement;
    if (file instanceof HTMLInputElement && neighbours instanceof HTMLInputElement) {
      readMatrix(file).then((matrix) => {
        response.innerHTML = "";
        response.classList.remove("error");
        const result: Array<Array<number | null>> = solve(matrix, parseInt(neighbours.value));
        resultDiv.classList.add("shown");
        if (result.length <= 15 && result[0].length <= 15) {
          if (resultDiv instanceof HTMLDivElement) {
            resultDiv.innerHTML = "";
            for (let i = 0; i < result.length; i++) {
              const row = document.createElement("div");
              if (row instanceof HTMLDivElement) {
                row.classList.add("row");
                for (let j = 0; j < result[i].length; j++) {
                  row.innerHTML += `<div class="cell">${result[i][j] === null ? '-.--' : result[i][j]?.toFixed(2)}</div>`;
                }
                resultDiv.appendChild(row);
              }
            }
          }
        } else {
          resultDiv.innerHTML = "Result is too big to display";
        }
        const link = resultDiv.appendChild(document.createElement("a"));
        const btn = link.appendChild(document.createElement("button"));
        btn.setAttribute("class", "button is-dark");
        btn.setAttribute("id", "download-btn");
        btn.innerHTML = "Download";
        link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(matrixToString(result)));
        link.setAttribute("download", "result.txt");
      }).catch((error) => {
        if (response instanceof HTMLDivElement) {
          response.innerHTML = error;
          response.classList.add("error");
          resultDiv.classList.remove("shown");
        }
      });
    }
  }
});

// --------------------------------------------

function matrixToString(matrix: Array<Array<number | null>>): string {
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

async function readMatrix(input: HTMLInputElement): Promise<Array<Array<number | null>>> {
  return new Promise(async (resolve, reject) => {
    const file = input.files?.item(0);
    const data = await file?.text();
    if (data) {
      const rows: string[] = data.trim().split('\n');
      const result: Array<Array<number | null>> = [];
      for (let i = 0; i < rows.length; i++) {
        const cols: string[] = rows[i].trim().split(' ');
        result.push([]);
        for (let j = 0; j < cols.length; j++) {
          if (cols[j] === '-') {
            result[i].push(null);
          } else {
            result[i].push(parseInt(cols[j], 10));
          }
        }
      }
      if (!checkMatrixTypes(result)) {
        console.error('Matrix is not valid');
        reject('Matrix is not valid');
      }
      if (!checkMatrixSize(result)) {
        console.error('Matrix size is not valid');
        reject('Matrix size is not valid');
      }
      resolve(result);
    } else {
      console.error('File is empty');
      reject('File is empty');
    }
  });
}

function checkMatrixTypes(matrix: any): boolean {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (typeof matrix[i][j] !== 'number' && matrix[i][j] !== null) {
        return false;
      }
    }
  }
  return true;
}

function checkMatrixSize(matrix: Array<Array<number | null>>): boolean {
  if (matrix.length < 2) {
    return false;
  }
  const size: number = matrix[0].length;
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].length < 2 || matrix[i].length !== size) {
      return false;
    }
  }
  return true;
}

function solve(matrix: Array<Array<number | null>>, neighbours: number):
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

function solveByPearson(matrix: Array<Array<number | null>>,
    i: number, j: number, numberOfNeighbours: number): number {
  const correlationMatrix: Array<number | null> =
    calculatePearson(matrix, i, j);
  const neighbours: [number, number][] =
    neighValue(correlationMatrix, numberOfNeighbours);
  const avgI: number = avgRow(matrix[i]);
  let numerator: number = 0;
  let denominator: number = 0;
  for (let k = 0; k < neighbours.length; k++) {
    const avgJ: number = avgRow(matrix[neighbours[k][1]]);
    if (typeof matrix[neighbours[k][1]][j] === 'number') {
      numerator +=
        (matrix[neighbours[k][1]][j] as number - avgJ) * neighbours[k][0];
      denominator += Math.abs(neighbours[k][0]);
    }
  }
  return avgI + (numerator / denominator);
}

function calculatePearson(matrix: Array<Array<number | null>>,
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

function avgRow(row: Array<number | null>, baseRow: Array<number | null> = row): number {
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

function neighValue(values: Array<number | null>,
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