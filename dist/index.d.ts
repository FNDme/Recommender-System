declare function solve(matriz: Array<Array<number | null>>, neighbours: number): Array<Array<number | null>>;
declare function solveByPearson(matriz: Array<Array<number | null>>, i: number, j: number, numberOfNeighbours: number): number;
declare function calculatePearson(matriz: Array<Array<number | null>>, i: number, j: number): Array<number | null>;
declare function avgRow(row: Array<number | null>): number;
declare function neighValue(values: Array<number | null>, neigh: number): [number, number][];
declare const matriz: Array<Array<number | null>>;
declare const solution: (number | null)[][];
