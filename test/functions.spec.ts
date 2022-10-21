import 'mocha';
import { expect } from 'chai';
import { solve, solveAlgorithm, avgRow,
  neighValue, matrixToString, calculateCorrelations } from '../src/functions';

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

describe('calculateCorrelation', () => {
  it('should return the correlation matrix', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, 3, 5],
      [3, 3, 1, 5, 4],
      [1, 5, 5, 2, 1]];
    const result = calculateCorrelations(test, 'Cosine');
    const result2 = calculateCorrelations(test, 'Pearson');
    const result3 = calculateCorrelations(test, 'Euclidean');
    expect(matrixToString(result)).to.be.equal(
        '-.-- 0.98 0.99 0.89 0.80' + '\n' +
        '0.98 -.-- 0.96 0.94 0.64' + '\n' +
        '0.99 0.96 -.-- 0.89 0.77' + '\n' +
        '0.89 0.94 0.89 -.-- 0.64' + '\n' +
        '0.80 0.64 0.77 0.64 -.--');
    expect(matrixToString(result2)).to.be.equal(
        '-.-- 0.85 0.71 0.00 -0.79' + '\n' +
        '0.84 -.-- 0.47 0.49 -0.90' + '\n' +
        '0.61 0.47 -.-- -0.16 -0.47' + '\n' +
        '0.00 0.49 -0.16 -.-- -0.64' + '\n' +
        '-0.77 -0.90 -0.47 -0.64 -.--');
    expect(matrixToString(result3)).to.be.equal(
        '-.-- 3.61 1.41 3.74 5.00' + '\n' +
        '3.61 -.-- 3.61 3.16 5.83' + '\n' +
        '1.41 3.61 -.-- 3.87 5.57' + '\n' +
        '3.74 3.16 3.87 -.-- 6.48' + '\n' +
        '5.00 5.83 5.57 6.48 -.--');
  });
});

describe('solveAlgorithm', () => {
  it('should return the solution', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, 3, 5],
      [3, 3, 1, 5, 4],
      [1, 5, 5, 2, 1]];
    const result = solveAlgorithm(test, 0, 4, 'Euclidean', 2);
    const result2 = solveAlgorithm(test, 0, 4, 'Pearson', 2);
    const result3 = solveAlgorithm(test, 0, 4, 'Cosine', 2);
    expect(result).to.be.a('number');
    expect(result.toFixed(2)).to.be.equal('3.31');
    expect(result2).to.be.a('number');
    expect(result2.toFixed(2)).to.be.equal('4.87');
    expect(result3).to.be.a('number');
    expect(result3.toFixed(2)).to.be.equal('4.90');
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
    expect(result[0]).to.be.an('array');
    expect(result[0][0]).to.be.a('array');
    expect(result[0][0][4]).to.be.a('number');
    expect((result[0][0][4] as number).toFixed(2)).to.be.equal('4.87');
  });

  it('should return the solution for matrix with many spaces', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, null, 5],
      [3, 3, 1, 5, 4],
      [1, null, 5, 2, 1]];
    const result = solve(test, 3, 'Pearson');
    expect(result[0]).to.be.an('array');
    expect(result[0][0]).to.be.a('array');
    expect(result[0][0][4]).to.be.a('number');
    expect((result[0][0][4] as number).toFixed(2)).to.be.equal('4.80');
    expect(result[0][2][3]).to.be.a('number');
    expect((result[0][2][3] as number).toFixed(2)).to.be.equal('4.58');
    expect(result[0][4][1]).to.be.a('number');
    expect((result[0][4][1] as number).toFixed(2)).to.be.equal('2.94');
  });

  it('should throw an error if neighbours value is greater than rows', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, null, 5],
      [3, 3, 1, 5, 4],
      [1, null, 5, 2, 1]];
    expect(() => solve(test, 6, 'Pearson')).to.
        throw('Neighbours count is bigger than matrix rows');
  });

  it('should throw an error if neighbours value is less than 1', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, null, 5],
      [3, 3, 1, 5, 4],
      [1, null, 5, 2, 1]];
    expect(() => solve(test, -1, 'Pearson')).to.
        throw('Neighbours count is less than 1');
  });
});

describe('matrixToString', () => {
  it('should return the matrix as a string', () => {
    const test = [
      [5, 3, 4, 4, 4.87123],
      [3, 1, 3, 3, 3],
      [4, 3, 4, 3, null],
      [null, null, null, 5, 4],
      [1, 5, 5.08779, 2, 1]];
    const test2 = [[null]];
    const result = matrixToString(test);
    const result2 = matrixToString(test2);
    expect(result2).to.be.a('string');
    expect(result).to.be.a('string');
    expect(result).to.be.equal(
        '5.00 3.00 4.00 4.00 4.87\n' +
        '3.00 1.00 3.00 3.00 3.00\n' +
        '4.00 3.00 4.00 3.00 -.--\n' +
        '-.-- -.-- -.-- 5.00 4.00\n' +
        '1.00 5.00 5.09 2.00 1.00');
    expect(result2).to.be.equal('-.--');
    expect(result).to.contain('4.87');
    expect(result).to.contain('-.--');
    expect(result).to.contain('\n');
    expect(result).to.contain(' ');
  });
});
