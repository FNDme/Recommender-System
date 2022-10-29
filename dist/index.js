/**
 * @title index.ts
 * @description It is the entry point for the application.
 * @content It reads the file and translates it into a matrix.
 */
var _a, _b, _c, _d, _e;
import { solve, matrixToString, neighValue } from './functions.js';
/**
 * @variable enableBTN Button to enable
 */
const enableBTN = [false, false]; // file - neighbors
/**
 * @variable matrix Matrix to fill
 */
let matrix;
/**
 * @variable nullValues Count of null values in matrix
 */
const nullValues = [];
(_a = document.getElementById('file-input')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', function (event) {
    if (event.target instanceof HTMLInputElement) {
        const response = document.getElementById('response-block');
        const resultDiv = document.getElementById('solution');
        readMatrix(document.getElementById('file-input')).then((matrixMLoaded) => {
            var _a, _b, _c;
            matrix = matrixMLoaded;
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    if (matrix[i][j] === null) {
                        nullValues.push([i, j]);
                    }
                }
            }
            enableBTN[0] = true;
            if (enableBTN[0] && enableBTN[1]) {
                (_a = document.getElementById('submit-btn')) === null || _a === void 0 ? void 0 : _a.removeAttribute('disabled');
            }
            else {
                if (!((_b = document.getElementById('submit')) === null || _b === void 0 ? void 0 : _b.hasAttribute('disabled'))) {
                    (_c = document.getElementById('submit')) === null || _c === void 0 ? void 0 : _c.setAttribute('disabled', '');
                }
            }
        }).catch((error) => {
            if (response instanceof HTMLDivElement) {
                const githubLink = document.createElement('a');
                githubLink.setAttribute('href', 'https://github.com/FNDme/recommender-system');
                githubLink.innerHTML = 'GitHub';
                response.innerHTML = error + ': check ' + githubLink.outerHTML +
                    ' for more info';
                response.classList.add('error');
                resultDiv.classList.remove('shown');
                resultDiv.innerHTML = '';
            }
        });
    }
});
(_b = document.getElementById('neighbors-input')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', function (event) {
    var _a, _b, _c;
    if (event.target instanceof HTMLInputElement) {
        enableBTN[1] = true;
        if (enableBTN[0] && enableBTN[1]) {
            (_a = document.getElementById('submit-btn')) === null || _a === void 0 ? void 0 : _a.removeAttribute('disabled');
        }
        else {
            if (!((_b = document.getElementById('submit')) === null || _b === void 0 ? void 0 : _b.hasAttribute('disabled'))) {
                (_c = document.getElementById('submit')) === null || _c === void 0 ? void 0 : _c.setAttribute('disabled', '');
            }
        }
    }
});
(_c = document.getElementById('submit-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (event) {
    var _a, _b, _c, _d;
    const file = document.getElementById('file-input');
    const neighbors = document.getElementById('neighbors-input');
    const resultDiv = document.getElementById('solution');
    const response = document.getElementById('response-block');
    if (!file.files || !neighbors.value) {
        response.innerHTML = 'Please, fill all the fields';
        response.classList.add('shown');
        return;
    }
    const form = document.forms.namedItem('form');
    const radios = form.elements.namedItem('algorithm');
    const algorithm = radios.value;
    response.innerHTML = '';
    response.classList.remove('error');
    const solution = solve(matrix, parseInt(neighbors.value), algorithm);
    const result = solution[0];
    const correlation = solution[1];
    resultDiv.classList.add('shown');
    if (result.length <= (screen.height / 45) / 3 && result[0].length <=
        (screen.width / 40) / 2.5) {
        if (resultDiv instanceof HTMLDivElement) {
            resultDiv.innerHTML = '';
            const resultTable = resultDiv.appendChild(document.
                createElement('div'));
            resultTable.classList.add('result-table');
            const corr = document.createElement('div');
            for (let i = 0; i < correlation.length; i++) {
                const row = document.createElement('div');
                let highlightedNeighbors = [];
                for (const solRow of nullValues) {
                    if (solRow[0] === i) {
                        highlightedNeighbors = neighValue(correlation[i], Number(neighbors.value));
                    }
                }
                const neighborsRows = [];
                for (const neigh of highlightedNeighbors) {
                    neighborsRows.push(neigh[1]);
                }
                if (row instanceof HTMLDivElement) {
                    row.classList.add('row');
                    for (let j = 0; j < correlation[i].length; j++) {
                        if (neighborsRows.includes(j)) {
                            row.innerHTML +=
                                `<div class="cell objective">${correlation[i][j] ===
                                    null ? '\\' : (_a = correlation[i][j]) === null || _a === void 0 ? void 0 : _a.toFixed(2)}</div>`;
                            continue;
                        }
                        row.innerHTML +=
                            `<div class="cell">${correlation[i][j] === null ?
                                '\\' : (_b = correlation[i][j]) === null || _b === void 0 ? void 0 : _b.toFixed(2)}</div>`;
                    }
                    corr.appendChild(row);
                }
            }
            resultTable.appendChild(corr);
            const sol = document.createElement('div');
            for (let i = 0; i < result.length; i++) {
                const row = document.createElement('div');
                if (row instanceof HTMLDivElement) {
                    row.classList.add('row');
                    for (let j = 0; j < result[i].length; j++) {
                        if (nullValues.some((value) => value[0] === i &&
                            value[1] === j)) {
                            row.innerHTML +=
                                `<div class="cell objective">${result[i][j] === null ?
                                    '-.--' : (_c = result[i][j]) === null || _c === void 0 ? void 0 : _c.toFixed(2)}</div>`;
                        }
                        else {
                            row.innerHTML += `<div class="cell">${result[i][j] === null ?
                                '-.--' : (_d = result[i][j]) === null || _d === void 0 ? void 0 : _d.toFixed(2)}</div>`;
                        }
                    }
                    sol.appendChild(row);
                }
            }
            resultTable.appendChild(sol);
        }
    }
    else {
        resultDiv.innerHTML = 'Result is too big to display';
    }
    const link = resultDiv.appendChild(document.createElement('a'));
    const btn = link.appendChild(document.createElement('button'));
    btn.setAttribute('class', 'button is-dark');
    btn.setAttribute('id', 'download-btn');
    btn.innerHTML = 'Download as .txt';
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        encodeURIComponent('Result\n' + matrixToString(result)) +
        '\n\nCorrelation\n' + matrixToString(correlation));
    link.setAttribute('download', 'result.txt');
});
(_d = document.getElementById('info-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function (event) {
    document.getElementsByClassName('popup')[0].classList.remove('hidden');
    document.getElementsByClassName('popup')[0].classList.add('shown');
});
(_e = document.getElementById('close-btn')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function (event) {
    document.getElementsByClassName('popup')[0].classList.remove('shown');
    document.getElementsByClassName('popup')[0].classList.add('hidden');
});
// ----------------------------
/**
 * Reads a matrix from a file and returns it
 * @param file File to read
 */
export function readMatrix(input) {
    return new Promise((resolve, reject) => {
        var _a;
        const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a.item(0);
        file === null || file === void 0 ? void 0 : file.text().then((text) => {
            const data = text;
            let rows = [];
            if (data === '') {
                reject(new Error('File is empty'));
            }
            rows = data.trim().split('\n');
            if (rows.length < 2) {
                reject(new Error('File must contain enough rows'));
            }
            const result = [];
            translateToMatrix(rows, reject, result);
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}
/**
 * Translates a string array to a matrix
 * @param rows Array of strings to translate
 * @param reject Reject function
 * @param result Matrix to fill
 */
function translateToMatrix(rows, reject, result) {
    const rowSize = rows[0].trim().split(' ').length;
    for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].trim().split(' ');
        if (cols.length !== rowSize) {
            reject('File does not contain a valid matrix');
        }
        result.push([]);
        for (const col of cols) {
            if (col === '-') {
                result[i].push(null);
                continue;
            }
            isNaN(Number(col)) ? reject('Invalid value in file') :
                result[i].push(parseInt(col, 10));
        }
    }
}
//# sourceMappingURL=index.js.map