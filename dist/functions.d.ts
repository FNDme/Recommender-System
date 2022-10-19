export declare type algorithm = 'Pearson' | 'Cosine' | 'Euclidean';
export declare function solve(matrix: Array<Array<number | null>>, neighbours: number, algorithm?: algorithm): Array<Array<number | null>>;
export declare function solveAlgorithm(matrix: Array<Array<number | null>>, i: number, j: number, algorithm: algorithm, numberOfNeighbours: number): number;
export declare function calculatePearson(matrix: Array<Array<number | null>>, i: number): Array<number | null>;
export declare function calculateCosine(matrix: Array<Array<number | null>>, i: number): Array<number | null>;
export declare function calculateEuclidean(matrix: Array<Array<number | null>>, i: number): Array<number | null>;
export declare function avgRow(row: Array<number | null>, baseRow?: Array<number | null>): number;
export declare function neighValue(values: Array<number | null>, neigh: number): [number, number][];
export declare function matrixToString(matrix: Array<Array<number | null>>): string;
