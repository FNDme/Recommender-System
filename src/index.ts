import { solve } from "./functions.js";

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
            for (const line of result) {
              const row = document.createElement("div");
              if (row instanceof HTMLDivElement) {
                row.classList.add("row");
                for (const item of line) {
                  row.innerHTML += `<div class="cell">${item === null ? '-.--' : item?.toFixed(2)}</div>`;
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
        btn.innerHTML = "Download as .txt";
        link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(matrixToString(result)));
        link.setAttribute("download", "result.txt");
      }).catch((error) => {
        if (response instanceof HTMLDivElement) {
          const githubLink = document.createElement("a");
          githubLink.setAttribute("href", "http://github.com/FNDme/recommender-system");
          githubLink.innerHTML = "GitHub";
          response.innerHTML = error + ": check " + githubLink.outerHTML + " for more info";
          response.classList.add("error");
          resultDiv.classList.remove("shown");
        }
      });
    }
  }
});

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
    } else {
      reject("File is empty");
    }
  });
}