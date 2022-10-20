import { solve, matrixToString, algorithm } from './functions.js';

const enableBTN = [false, false]; // file - neighbours
let matrix: Array<Array<number | null>>;

document.getElementById('file-input')?.addEventListener('change',
    function(event) {
      if (event.target instanceof HTMLInputElement) {
        const response = document.getElementById('response-block') as
          HTMLDivElement;
        const resultDiv = document.getElementById('solution') as HTMLDivElement;
        readMatrix(document.getElementById('file-input') as
          HTMLInputElement).then(
            (matrixMLoaded) => {
              matrix = matrixMLoaded;
              enableBTN[0] = true;
              if (enableBTN[0] && enableBTN[1]) {
                document.getElementById('submit-btn')?.
                    removeAttribute('disabled');
              } else {
                if (!document.getElementById('submit')?.
                    hasAttribute('disabled')) {
                  document.getElementById('submit')?.
                      setAttribute('disabled', '');
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

document.getElementById('neighbours-input')?.addEventListener('change',
    function(event) {
      if (event.target instanceof HTMLInputElement) {
        enableBTN[1] = true;
        if (enableBTN[0] && enableBTN[1]) {
          document.getElementById('submit-btn')?.removeAttribute('disabled');
        } else {
          if (!document.getElementById('submit')?.hasAttribute('disabled')) {
            document.getElementById('submit')?.setAttribute('disabled', '');
          }
        }
      }
    });

document.getElementById('submit-btn')?.addEventListener('click',
    function(event) {
      const file = document.getElementById('file-input') as HTMLInputElement;
      const neighbours = document.getElementById('neighbours-input') as
      HTMLInputElement;
      const resultDiv = document.getElementById('solution') as HTMLDivElement;
      const response = document.getElementById('response-block') as
      HTMLDivElement;
      if (!file.files || !neighbours.value) {
        response.innerHTML = 'Please, fill all the fields';
        response.classList.add('shown');
        return;
      }
      let algorithm: algorithm = 'Pearson';
      for (const radio of document.getElementsByName('algorithm')) {
        if ((radio as HTMLInputElement).checked) {
          algorithm = (radio as HTMLInputElement).value as algorithm;
        }
      }
      response.innerHTML = '';
      response.classList.remove('error');
      const result: Array<Array<number | null>> = solve(matrix,
          parseInt(neighbours.value), algorithm);
      resultDiv.classList.add('shown');
      if (result.length <= (screen.height/45)/3 && result[0].length <=
          (screen.width/40)/2) {
        if (resultDiv instanceof HTMLDivElement) {
          resultDiv.innerHTML = '';
          for (const line of result) {
            const row = document.createElement('div');
            if (row instanceof HTMLDivElement) {
              row.classList.add('row');
              for (const item of line) {
                row.innerHTML += `<div class="cell">${item === null ?
                  '-.--' : item?.toFixed(2)}</div>`;
              }
              resultDiv.appendChild(row);
            }
          }
        }
      } else {
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
    });

document.getElementById('info-btn')?.addEventListener('click', function(event) {
  document.getElementsByClassName('popup')[0].classList.remove('hidden');
  document.getElementsByClassName('popup')[0].classList.add('shown');
});

document.getElementById('close-btn')?.addEventListener('click',
    function(event) {
      document.getElementsByClassName('popup')[0].classList.remove('shown');
      document.getElementsByClassName('popup')[0].classList.add('hidden');
    });

// ----------------------------

export function readMatrix(input: HTMLInputElement):
    Promise<Array<Array<number | null>>> {
  return new Promise((resolve, reject) => {
    const file = input.files?.item(0);
    file?.text().then((text) => {
      const data = text;
      let rows: string[] = [];
      if (data === '') {
        reject(new Error('File is empty'));
      }
      rows = data.trim().split('\n');
      if (rows.length < 2) {
        reject(new Error('File must contain enough rows'));
      }
      const result: Array<Array<number | null>> = [];
      translateToMatrix(rows, reject, result);
      resolve(result);
    }).catch((error) => {
      reject(error);
    });
  });
}

function translateToMatrix(rows: string[], reject: (reason?: any) =>
    void, result: (number | null)[][]) {
  const rowSize = rows[0].trim().split(' ').length;
  for (let i = 0; i < rows.length; i++) {
    const cols: string[] = rows[i].trim().split(' ');
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
