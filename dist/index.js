"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
function solve(matriz, neighbours) {
    const result = matriz;
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] === null) {
                matriz[i][j] = result[i][j] = solveByPearson(matriz, i, j, neighbours);
            }
        }
    }
    return result;
}
function solveByPearson(matriz, i, j, numberOfNeighbours) {
    const correlationMatrix = calculatePearson(matriz, i, j);
    const neighbours = neighValue(correlationMatrix, numberOfNeighbours);
    const avgI = avgRow(matriz[i]);
    let numerator = 0;
    let denominator = 0;
    for (let k = 0; k < neighbours.length; k++) {
        const avgJ = avgRow(matriz[neighbours[k][1]]);
        if (typeof matriz[neighbours[k][1]][j] === 'number') {
            numerator +=
                (matriz[neighbours[k][1]][j] - avgJ) * neighbours[k][0];
            denominator += Math.abs(neighbours[k][0]);
        }
    }
    return avgI + (numerator / denominator);
}
function calculatePearson(matriz, i, j) {
    const correlationMatrix = [];
    const avgI = avgRow(matriz[i]);
    for (let k = 0; k < matriz.length; k++) {
        if (k !== i) {
            const avgK = avgRow(matriz[k]);
            let correlation = 0;
            let numerator = 0;
            let denominator = 0;
            for (let l = 0; l < matriz[k].length; l++) {
                if (typeof matriz[k][l] === 'number' &&
                    typeof matriz[i][l] === 'number') {
                    numerator +=
                        (matriz[k][l] - avgK) *
                            (matriz[i][l] - avgI);
                    denominator +=
                        Math.sqrt(Math.pow((matriz[k][l] - avgK), 2)) *
                            Math.sqrt(Math.pow((matriz[i][l] - avgI), 2));
                }
            }
            correlation = numerator / denominator;
            correlationMatrix.push(correlation);
        }
        else {
            correlationMatrix.push(null);
        }
    }
    return correlationMatrix;
}
function avgRow(row) {
    let sum = 0;
    let nullCount = 0;
    for (let i = 0; i < row.length; i++) {
        if (typeof row[i] === 'number') {
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
    for (let i = 0; i < values.length; i++) {
        if (typeof values[i] === 'number' && result.length < neigh) {
            result.push([values[i], i]);
        }
        else if (typeof values[i] === 'number' && result.length === neigh) {
            for (let j = 0; j < result.length; j++) {
                if (values[i] > result[j][0]) {
                    result[j] = [values[i], i];
                    break;
                }
            }
        }
    }
    return result;
}
function readMatrix(file) {
    const lines = fs.readFileSync(file).toString().split('\r');
    const result = [];
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
        if (lines[i] !== '') {
            result.push(lines[i].split(' ').map((value) => {
                if (value === '-') {
                    return null;
                }
                else {
                    return Number(value);
                }
            }));
        }
    }
    return result;
}
const input = process.argv[2];
const matriz = readMatrix(input);
console.log('Original matrix');
for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
        if (typeof matriz[i][j] === 'number') {
            process.stdout.write(matriz[i][j]?.toFixed(2) + ' ');
        }
        else {
            process.stdout.write('---- ');
        }
    }
    process.stdout.write('\n');
}
const solution = solve(matriz, 3);
console.log('\nSolution matrix');
for (let i = 0; i < solution.length; i++) {
    for (let j = 0; j < solution[i].length; j++) {
        if (solution[i][j] % 1 === 0) {
            process.stdout.write(solution[i][j]?.toFixed() + '.-- ');
        }
        else {
            process.stdout.write('\x1b[34m' + solution[i][j]?.toFixed(2) + '\x1b[0m ');
        }
    }
    process.stdout.write('\n');
}
