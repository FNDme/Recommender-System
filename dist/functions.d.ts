/**
 * @title function.ts
 * @description Functions needed to solve the problem
 */
/**
 * @type algorithm Which algorithm is going to be used.
 */
export declare type algorithm = 'Pearson' | 'Cosine' | 'Euclidean';
/**
 * Return the solved matrix
 * @param matrix Matrix made of numbers and nulls
 * @param neighbors Numbers of neighbors to choose
 * @param algorithm Which algorithm are we going to use
 */
export declare function solve(matrix: Array<Array<number | null>>, neighbors: number, algorithm?: algorithm): [
    Array<Array<number | null>>,
    Array<Array<number | null>>
];
/**
 * @description It calculates the correlation for an item of the matrix
 * @type {Array} Matrix made of numbers and nulls
 * @param matrix Matrix where we are going to calculate the correlation
 * @param algorithm Which algorithm are we going to use
 * @returns Array of correlations
 */
export declare function calculateCorrelations(matrix: Array<Array<number | null>>, algorithm: algorithm): Array<Array<number | null>>;
/**
 * This function calculates the final number in the matrix
 * @param matrix Matrix to solve
 * @param i Row
 * @param j Col
 * @param algorithm Which algorithm are we going to use
 * @param numberOfNeighbors numbers of neighbors to calculate the number
 */
export declare function solveAlgorithm(matrix: Array<Array<number | null>>, i: number, j: number, algorithm: algorithm, numberOfNeighbors: number): number;
/**
 * Function to calculate the correlation by Pearson
 * @param matrix Matrix
 * @param i Row
 */
export declare function calculatePearson(matrix: Array<Array<number | null>>, i: number): Array<number | null>;
/**
 * Function to calculate the correlation by Cosine Distance
 * @param matrix Matrix
 * @param i Row
 */
export declare function calculateCosine(matrix: Array<Array<number | null>>, i: number): Array<number | null>;
/**
 * Function to calculate the correlation by Euclidean Distance
 * @param matrix Matrix
 * @param i Row
 */
export declare function calculateEuclidean(matrix: Array<Array<number | null>>, i: number): Array<number | null>;
/**
 * Function to calculate the average of a row
 * @param row
 * @param baseRow row to compare
 */
export declare function avgRow(row: Array<number | null>, baseRow?: Array<number | null>): number;
/**
 * Function to return the N higher neighbors
 * @param values Array of neighbors
 * @param neigh Number of neighbors
 */
export declare function neighValue(values: Array<number | null>, neigh: number): [number, number][];
/**
 * Function to transform a matrix into a string
 * @param matrix Matrix
 */
export declare function matrixToString(matrix: Array<Array<number | null>>): string;
