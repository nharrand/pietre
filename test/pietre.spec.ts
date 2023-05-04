import { expect } from 'chai';
import { sampleFunction } from '../src/pietre';

describe('sampleFunction', () => {
  it('should return the input value', () => {
    const input = 'Hello World!';
    const result = sampleFunction(input);
    expect(result).to.equal(input);
  });
});
