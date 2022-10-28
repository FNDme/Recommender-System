/**
 * @title index.ts
 * @description It is the entry point for the application.
 * @content It reads the file and translates it into a matrix.
 */
/**
 * Reads a matrix from a file and returns it
 * @param file File to read
 */
export declare function readMatrix(input: HTMLInputElement): Promise<Array<Array<number | null>>>;
