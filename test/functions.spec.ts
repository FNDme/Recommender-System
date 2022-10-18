import 'mocha';
import { expect } from 'chai';
import { solve, solveByPearson, calculatePearson,
  avgRow, neighValue, readMatrix, checkMatrixTypes, checkMatrixSize } from '../src/functions';

describe('readMatrix', () => {
  it('should return a matrix', () => {
    const result = readMatrix('./examples/test-01.txt');
    expect(result).to.be.an('array');
    expect(result[0]).to.be.an('array');
    expect(result[0][0]).to.be.a('number' || 'null');
    expect(result).to.have.lengthOf(5);
    expect(result[0]).to.have.lengthOf(5);
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

describe('checkMatrixTypes', () => {
  it ('should return true if the matrix is valid', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, 3, 5],
      [3, 3, 1, 5, 4],
      [1, 5, 5, 2, 1]];
    expect(checkMatrixTypes(test)).to.be.true;
  });

  it ('should return false if the matrix is not valid', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, 3, 5],
      [3, 3, 1, 5, 4],
      [1, 5, 5, '2', 1]];
    expect(checkMatrixTypes(test)).to.be.false;
  });
});

describe('checkMatrixSize', () => {
  it ('should return true if the matrix is valid', () => {
    const test = [
      [5, 3, 4, 4, null],
      [3, 1, 2, 3, 3],
      [4, 3, 4, 3, 5],
      [3, 3, 1, 5, 4],
      [1, 5, 5, 2, 1]];
    expect(checkMatrixSize(test)).to.be.true;
  });

  it ('should return false if the matrix is not valid', () => {
    const test01 = [[1, 2, 3, 4, 5]];
    const test02 = [[5, 3, 4, 4, null]];
    const test03 = [[5], [3], [4], [4], [null]];
    const test04 = [[5, 3, 4, 4, null], [3, 1, 2]];
    expect(checkMatrixSize(test01)).to.be.false;
    expect(checkMatrixSize(test02)).to.be.false;
    expect(checkMatrixSize(test03)).to.be.false;
    expect(checkMatrixSize(test04)).to.be.false;
  });
});