import 'mocha';
import { expect } from 'chai';
import { algorithm, solve, solveAlgorithm, calculatePearson, calculateCosine,
  calculateEuclidean, avgRow, neighValue, matrixToString, } from '../src/functions';

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
    const result = calculatePearson(test, 0);
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
    const result = solve(test, 3, 'Pearson');
    expect(result).to.be.an('array');
    expect(result[0]).to.be.a('array');
    expect(result[0][4]).to.be.a('number');
    expect((result[0][4] as number).toFixed(2)).to.be.equal('4.80');
    expect(result[2][3]).to.be.a('number');
    expect((result[2][3] as number).toFixed(2)).to.be.equal('4.49');
    expect(result[4][1]).to.be.a('number');
    expect((result[4][1] as number).toFixed(2)).to.be.equal('3.04');
  });

  it('should throw an error if neighbours value is greater than the number of rows', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, null, 5],
      [3, 3, 1, 5, 4],
      [1, null, 5, 2, 1]];
    expect(() => solve(test, 6, 'Pearson')).to.throw('Neighbours count is bigger than matrix rows');
  });

  it('should throw an error if neighbours value is less than 1', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, null, 5],
      [3, 3, 1, 5, 4],
      [1, null, 5, 2, 1]];
    expect(() => solve(test, -1, 'Pearson')).to.throw('Neighbours count is less than 1');
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