import { expect } from 'chai';
import * as Runtime from '../src/runtime';
import { roll } from '../src/runtime';



describe('roll test', () => {
  it('roll', () => {
    var stack: number[] = [
        1,2,3,4
    ];

    roll(stack, 2, 1)
    expect(stack).deep.to.equal([1,2,4,3]);
  });
});

describe('roll test 2', () => {
  it('roll', () => {
    var stack: number[] = [
        1,2,3,4
    ];

    roll(stack, 3, 1)
    expect(stack).deep.to.equal([1,4,2,3]);
  });
});

describe('roll test 3', () => {
  it('roll', () => {
    var stack: number[] = [
        1,2,3,4
    ];

    roll(stack, 3, 2)
    expect(stack).deep.to.equal([1,3,4,2]);
  });
});

describe('roll test 4', () => {
  it('roll', () => {
    var stack: number[] = [
        1,2,3,4
    ];

    roll(stack, 3, 3)
    expect(stack).deep.to.equal([1,2,3,4]);
  });
});

describe('roll test 5', () => {
  it('roll', () => {
    var stack: number[] = [
        1,2,3,4
    ];

    roll(stack, 3, -1)
    expect(stack).deep.to.equal([1,3,4,2]);
  });
});