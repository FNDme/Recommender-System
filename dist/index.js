var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
import { solve } from "./functions.js";
const enableBTN = [false, false]; // file - neighbours
(_a = document.getElementById("file-input")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", function (event) {
    var _a, _b, _c;
    if (event.target instanceof HTMLInputElement) {
        enableBTN[0] = true;
        if (enableBTN[0] && enableBTN[1]) {
            (_a = document.getElementById("submit-btn")) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
        }
        else {
            if (!((_b = document.getElementById("submit")) === null || _b === void 0 ? void 0 : _b.hasAttribute("disabled"))) {
                (_c = document.getElementById("submit")) === null || _c === void 0 ? void 0 : _c.setAttribute("disabled", "");
            }
        }
    }
});
(_b = document.getElementById("neighbours-input")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", function (event) {
    var _a, _b, _c;
    if (event.target instanceof HTMLInputElement) {
        enableBTN[1] = true;
        if (enableBTN[0] && enableBTN[1]) {
            (_a = document.getElementById("submit-btn")) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
        }
        else {
            if (!((_b = document.getElementById("submit")) === null || _b === void 0 ? void 0 : _b.hasAttribute("disabled"))) {
                (_c = document.getElementById("submit")) === null || _c === void 0 ? void 0 : _c.setAttribute("disabled", "");
            }
        }
    }
});
(_c = document.getElementById("submit-btn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function (event) {
    if (event.target instanceof HTMLButtonElement) {
        const file = document.getElementById("file-input");
        const neighbours = document.getElementById("neighbours-input");
        const resultDiv = document.getElementById("solution");
        const response = document.getElementById("response-block");
        if (file instanceof HTMLInputElement && neighbours instanceof HTMLInputElement) {
            readMatrix(file).then((matrix) => {
                response.innerHTML = "";
                response.classList.remove("error");
                const result = solve(matrix, parseInt(neighbours.value));
                resultDiv.classList.add("shown");
                if (result.length <= 15 && result[0].length <= 15) {
                    if (resultDiv instanceof HTMLDivElement) {
                        resultDiv.innerHTML = "";
                        for (const line of result) {
                            const row = document.createElement("div");
                            if (row instanceof HTMLDivElement) {
                                row.classList.add("row");
                                for (const item of line) {
                                    row.innerHTML += `<div class="cell">${item === null ? '-.--' : item === null || item === void 0 ? void 0 : item.toFixed(2)}</div>`;
                                }
                                resultDiv.appendChild(row);
                            }
                        }
                    }
                }
                else {
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
// --------------------------------------------
function matrixToString(matrix) {
    var _a;
    let result = "";
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            result += matrix[i][j] === null ? '-.--' : (_a = matrix[i][j]) === null || _a === void 0 ? void 0 : _a.toFixed(2);
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
function readMatrix(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a.item(0);
            const data = yield (file === null || file === void 0 ? void 0 : file.text());
            if (data === '') {
                reject("File is empty");
            }
            if (data) {
                const rows = data.trim().split('\n');
                if (rows.length < 2) {
                    reject("File must contain enough rows");
                }
                const result = [];
                const rowSize = rows[0].trim().split(' ').length;
                for (let i = 0; i < rows.length; i++) {
                    const cols = rows[i].trim().split(' ');
                    if (cols.length !== rowSize) {
                        reject("File does not contain a valid matrix");
                    }
                    result.push([]);
                    for (const col of cols) {
                        if (col === '-') {
                            result[i].push(null);
                        }
                        else if (!isNaN(Number(col))) {
                            result[i].push(parseInt(col, 10));
                        }
                        else {
                            reject("Invalid value in file");
                        }
                    }
                }
                resolve(result);
            }
            else {
                reject("File is empty");
            }
        }));
    });
}
// function solve(matrix: Array<Array<number | null>>, neighbours: number):
//     Array<Array<number | null>> {
//   const result: Array<Array<number | null>> = matrix;
//   for (let i = 0; i < matrix.length; i++) {
//     for (let j = 0; j < matrix[i].length; j++) {
//       if (matrix[i][j] === null) {
//         matrix[i][j] = result[i][j] = solveByPearson(matrix, i, j, neighbours);
//       }
//     }
//   }
//   return result;
// }
// function solveByPearson(matrix: Array<Array<number | null>>,
//     i: number, j: number, numberOfNeighbours: number): number {
//   const correlationMatrix: Array<number | null> =
//     calculatePearson(matrix, i, j);
//   const neighbours: [number, number][] =
//     neighValue(correlationMatrix, numberOfNeighbours);
//   const avgI: number = avgRow(matrix[i]);
//   let numerator: number = 0;
//   let denominator: number = 0;
//   for (const neighbour of neighbours) {
//     const avgJ: number = avgRow(matrix[neighbour[1]]);
//     if (typeof matrix[neighbour[1]][j] === 'number') {
//       numerator +=
//         (matrix[neighbour[1]][j] as number - avgJ) * neighbour[0];
//       denominator += Math.abs(neighbour[0]);
//     }
//   }
//   return avgI + (numerator / denominator);
// }
// function calculatePearson(matrix: Array<Array<number | null>>,
//     i: number, j: number): Array<number | null> {
//   const correlationArray: Array<number | null> = [];
//   const avgI: number = avgRow(matrix[i]);
//   for (let k = 0; k < matrix.length; k++) {
//     if (k !== i) {
//       const avgK: number = avgRow(matrix[k], matrix[i]);
//       let numerator: number = 0;
//       let denominatorFirst: number = 0;
//       let denominatorSecond: number = 0;
//       for (let l = 0; l < matrix[k].length; l++) {
//         if (typeof matrix[k][l] === 'number' &&
//             typeof matrix[i][l] === 'number') {
//           numerator +=
//             (matrix[k][l] as number - avgK) * (matrix[i][l] as number - avgI);
//           denominatorFirst += Math.pow((matrix[k][l] as number - avgK), 2);
//           denominatorSecond += Math.pow((matrix[i][l] as number - avgI), 2);
//         }
//       }
//       correlationArray.push(numerator /
//       (Math.sqrt(denominatorFirst) * Math.sqrt(denominatorSecond)));
//     } else {
//       correlationArray.push(null);
//     }
//   }
//   return correlationArray;
// }
// function avgRow(row: Array<number | null>, baseRow: Array<number | null> = row): number {
//   let sum: number = 0;
//   let nullCount: number = 0;
//   for (let i = 0; i < row.length; i++) {
//     if (typeof row[i] === 'number' && typeof baseRow[i] === 'number') {
//       sum += row[i] as number;
//     } else {
//       nullCount++;
//     }
//   }
//   return sum / (row.length - nullCount);
// }
// function neighValue(values: Array<number | null>,
//     neigh: number): [number, number][] {
//   const result: [number, number][] = []; // [value, index]
//   for (let i = 0; i < neigh; i++) {
//     let max: number = -Infinity;
//     let maxIndex: number = -1;
//     for (let j = 0; j < values.length; j++) {
//       if (typeof values[j] === 'number' && values[j] as number > max) {
//         max = values[j] as number;
//         maxIndex = j;
//       }
//     }
//     result.push([max, maxIndex]);
//     values[maxIndex] = -Infinity;
//   }
//   return result;
// }
//# sourceMappingURL=index.js.map