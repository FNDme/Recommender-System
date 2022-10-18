import { solve, readMatrix, matrixToString } from "./functions.js";

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
