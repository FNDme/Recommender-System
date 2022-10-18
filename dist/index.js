"use strict";
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
        if (file instanceof HTMLInputElement && neighbours instanceof HTMLInputElement) {
            readMatrix(file).then((matrix) => {
                var _a;
                const result = solve(matrix, parseInt(neighbours.value));
                const resultDiv = document.getElementById("solution");
                if (result.length <= 15 && result[0].length <= 15) {
                    if (resultDiv instanceof HTMLDivElement) {
                        resultDiv.innerHTML = "";
                        for (let i = 0; i < result.length; i++) {
                            const row = document.createElement("div");
                            if (row instanceof HTMLDivElement) {
                                row.classList.add("row");
                                for (let j = 0; j < result[i].length; j++) {
                                    row.innerHTML += `<div class="cell">${result[i][j] === null ? '-.--' : (_a = result[i][j]) === null || _a === void 0 ? void 0 : _a.toFixed(2)}</div>`;
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
                btn.innerHTML = "Download";
                link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(matrixToString(result)));
                link.setAttribute("download", "result.txt");
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
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a.item(0);
        const data = yield (file === null || file === void 0 ? void 0 : file.text());
        if (data) {
            const rows = data.trim().split('\n');
            const result = [];
            for (let i = 0; i < rows.length; i++) {
                const cols = rows[i].trim().split(' ');
                result.push([]);
                for (let j = 0; j < cols.length; j++) {
                    if (cols[j] === '-') {
                        result[i].push(null);
                    }
                    else {
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
        }
        else {
            console.error('File is empty');
            reject('File is empty');
        }
    }));
}
function checkMatrixTypes(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (typeof matrix[i][j] !== 'number' && matrix[i][j] !== null) {
                return false;
            }
        }
    }
    return true;
}
function checkMatrixSize(matrix) {
    if (matrix.length < 2) {
        return false;
    }
    const size = matrix[0].length;
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].length < 2 || matrix[i].length !== size) {
            return false;
        }
    }
    return true;
}
function solve(matrix, neighbours) {
    const result = matrix;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === null) {
                matrix[i][j] = result[i][j] = solveByPearson(matrix, i, j, neighbours);
            }
        }
    }
    return result;
}
function solveByPearson(matrix, i, j, numberOfNeighbours) {
    const correlationMatrix = calculatePearson(matrix, i, j);
    const neighbours = neighValue(correlationMatrix, numberOfNeighbours);
    const avgI = avgRow(matrix[i]);
    let numerator = 0;
    let denominator = 0;
    for (let k = 0; k < neighbours.length; k++) {
        const avgJ = avgRow(matrix[neighbours[k][1]]);
        if (typeof matrix[neighbours[k][1]][j] === 'number') {
            numerator +=
                (matrix[neighbours[k][1]][j] - avgJ) * neighbours[k][0];
            denominator += Math.abs(neighbours[k][0]);
        }
    }
    return avgI + (numerator / denominator);
}
function calculatePearson(matrix, i, j) {
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
function avgRow(row, baseRow = row) {
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
function neighValue(values, neigh) {
    const result = []; // [value, index]
    for (let i = 0; i < neigh; i++) {
        let max = -Infinity;
        let maxIndex = -1;
        for (let j = 0; j < values.length; j++) {
            if (typeof values[j] === 'number' && values[j] > max) {
                max = values[j];
                maxIndex = j;
            }
        }
        result.push([max, maxIndex]);
        values[maxIndex] = -Infinity;
    }
    return result;
}
//# sourceMappingURL=index.js.map