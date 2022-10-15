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
exports.readMatrix = exports.neighValue = exports.avgRow = exports.calculatePearson = exports.solveByPearson = exports.solve = void 0;
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
exports.solve = solve;
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
exports.solveByPearson = solveByPearson;
function calculatePearson(matriz, i, j) {
    const correlationMatrix = [];
    const avgI = avgRow(matriz[i]);
    for (let k = 0; k < matriz.length; k++) {
        if (k !== i) {
            const avgK = avgRow(matriz[k]);
            let numerator = 0;
            let denominatorFirst = 0;
            let denominatorSecond = 0;
            for (let l = 0; l < matriz[k].length; l++) {
                if (typeof matriz[k][l] === 'number' &&
                    typeof matriz[i][l] === 'number') {
                    numerator +=
                        (matriz[k][l] - avgK) * (matriz[i][l] - avgI);
                    denominatorFirst += Math.pow((matriz[k][l] - avgK), 2);
                    denominatorSecond += Math.pow((matriz[i][l] - avgI), 2);
                }
            }
            correlationMatrix.push(numerator /
                (Math.sqrt(denominatorFirst) * Math.sqrt(denominatorSecond)));
        }
        else {
            correlationMatrix.push(null);
        }
    }
    return correlationMatrix;
}
exports.calculatePearson = calculatePearson;
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
exports.avgRow = avgRow;
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
exports.neighValue = neighValue;
function readMatrix(file) {
    const data = fs.readFileSync(file, 'utf8');
    const rows = data.split('\r');
    const result = [];
    for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].split(' ');
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
    return result;
}
exports.readMatrix = readMatrix;
