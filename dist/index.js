var _a, _b, _c, _d, _e;
import { solve, matrixToString } from './functions.js';
const enableBTN = [false, false]; // file - neighbours
(_a = document.getElementById('file-input')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', function (event) {
    var _a, _b, _c;
    if (event.target instanceof HTMLInputElement) {
        enableBTN[0] = true;
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
(_b = document.getElementById('neighbours-input')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', function (event) {
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
    const file = document.getElementById('file-input');
    const neighbours = document.getElementById('neighbours-input');
    const resultDiv = document.getElementById('solution');
    const response = document.getElementById('response-block');
    if (!file.files || !neighbours.value) {
        response.innerHTML = 'Please, fill all the fields';
        response.classList.add('shown');
        return;
    }
    let algorithm = 'Pearson';
    for (const radio of document.getElementsByName('algorithm')) {
        if (radio.checked) {
            algorithm = radio.value;
        }
    }
    readMatrix(file).then((matrix) => {
        response.innerHTML = '';
        response.classList.remove('error');
        const result = solve(matrix, parseInt(neighbours.value), algorithm);
        resultDiv.classList.add('shown');
        if (result.length <= (screen.height / 45) / 3 && result[0].length <=
            (screen.width / 40) / 2) {
            if (resultDiv instanceof HTMLDivElement) {
                resultDiv.innerHTML = '';
                for (const line of result) {
                    const row = document.createElement('div');
                    if (row instanceof HTMLDivElement) {
                        row.classList.add('row');
                        for (const item of line) {
                            row.innerHTML += `<div class="cell">${item === null ?
                                '-.--' : item === null || item === void 0 ? void 0 : item.toFixed(2)}</div>`;
                        }
                        resultDiv.appendChild(row);
                    }
                }
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
            encodeURIComponent(matrixToString(result)));
        link.setAttribute('download', 'result.txt');
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