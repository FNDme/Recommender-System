import 'mocha';
import { expect } from 'chai';
import { solve, solveByPearson, calculatePearson,
  avgRow, neighValue, readMatrix } from '../src/functions';

describe('readMatrix', () => {
  it('should return a matrix', () => {
    let result = readMatrix('./examples/test-01.txt');
    expect(result).to.be.an('array');
    expect(result[0]).to.be.an('array');
    expect(result[0][0]).to.be.a('number' || 'null');
    expect(result).to.have.lengthOf(5);
    expect(result[0]).to.have.lengthOf(5);
  });

  it('should throw an error if the file does not exist', () => {
    expect(() => readMatrix('./void.txt')).to.throw('File does not exist');
  });

  it('should throw an error if the file is empty', () => {
    expect(() => readMatrix('./examples/invalid-matrix-5-5-3.txt')).to.throw('File is empty');
  });

  it('should throw an error if the matrix is not valid', () => {
    expect(() => readMatrix('./examples/invalid-matrix-5-5-1.txt')).to.throw('Invalid matrix');
  });

  it('should throw an error if the matrix has not rows enough', () => {
    expect(() => readMatrix('./examples/invalid-matrix-5-5-2.txt')).to.throw('File does not contain enough rows');
  });

  it('should throw an error if the rows have not the same size', () => {
    expect(() => readMatrix('./examples/invalid-matrix-5-5-4.txt')).to.throw('File does not contain a valid matrix');
  });
});

describe('avgRow', () => {
  it('should return the average of a row', () => {
    const result = avgRow([1, 2, 3, 4, 5]);
    expect(result).to.be.a('number');
    expect(result).to.be.equal(3);
  });
});

describe('neighValue', () => {
  it('should return the n highest values with their index', () => {
    const result = neighValue([6, 4, 6, 3, 2], 2);
    expect(result).to.be.an('array');
    expect(result[0]).to.be.an('array');
    expect(result[0][0]).to.be.a('number');
    expect(result[0][1]).to.be.a('number');
    expect(result).to.have.lengthOf(2);
    expect(result).to.deep.equal([[6, 0], [6, 2]]);
  });
});

describe('calculatePearson', () => {
  it('should return the correlation matrix', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, 3, 5],
      [3, 3, 1, 5, 4],
      [1, 5, 5, 2, 1]];
    const result = calculatePearson(test, 0, 0);
    expect(result).to.be.an('array');
    expect(result.map((x) => typeof x == 'number' ?
        x.toFixed(2) : null)).to.deep.equal([
      null,
      '0.85',
      '0.71',
      '0.00',
      '-0.79']);
  });
});

describe('solveByPearson', () => {
  it('should return the solution', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, 3, 5],
      [3, 3, 1, 5, 4],
      [1, 5, 5, 2, 1]];
    const result = solveByPearson(test, 0, 4, 2);
    expect(result).to.be.a('number');
    expect(result.toFixed(2)).to.be.equal('4.87');
  });
});

describe('solve', () => {
  it('should return the solution for matrix with a space', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, 3, 5],
      [3, 3, 1, 5, 4],
      [1, 5, 5, 2, 1]];
    const result = solve(test, 2);
    expect(result).to.be.an('array');
    expect(result[0]).to.be.a('array');
    expect(result[0][4]).to.be.a('number');
    expect((result[0][4] as number).toFixed(2)).to.be.equal('4.87');
  });

  it('should return the solution for matrix with many spaces', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, null, 5],
      [3, 3, 1, 5, 4],
      [1, null, 5, 2, 1]];
    const result = solve(test, 3);
    expect(result).to.be.an('array');
    expect(result[0]).to.be.a('array');
    expect(result[0][4]).to.be.a('number');
    expect((result[0][4] as number).toFixed(2)).to.be.equal('4.80');
    expect(result[2][3]).to.be.a('number');
    expect((result[2][3] as number).toFixed(2)).to.be.equal('4.49');
    expect(result[4][1]).to.be.a('number');
    expect((result[4][1] as number).toFixed(2)).to.be.equal('3.04');
  });
});
