export declare function solve(matriz: Array<Array<number | null>>, neighbours: number): Array<Array<number | null>>;
export declare function solveByPearson(matriz: Array<Array<number | null>>, i: number, j: number, numberOfNeighbours: number): number;
export declare function calculatePearson(matriz: Array<Array<number | null>>, i: number, j: number): Array<number | null>;
export declare function avgRow(row: Array<number | null>): number;
export declare function neighValue(values: Array<number | null>, neigh: number): [number, number][];
export declare function readMatrix(file: string): Array<Array<number | null>>;
