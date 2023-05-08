//import { expect } from 'chai';
import * as Runtime from '../src/runtime';
import { roll } from '../src/runtime';
import * as pgraph from '../src/programGraph';


const r: number = 0xFF0000;
const w: number = 0xFFFFFF;
const b: number = 0;

describe('Simple loop while traversing white block', () => {
    test('should not terminate the program and still reach the next block.', () => {
      var data: number[][] = [
        [r,w,w,w,b,r],
        [b,w,w,w,b,r],
        [w,w,w,w,w,r],
        [w,w,w,w,b,r]
      ];
      const p = pgraph.buildProgramGraph(data, 6, 4);
      var rt : Runtime.Runtime = new Runtime.Runtime();
      Runtime.loadProgram(rt, p);
      Runtime.runUntilPause(rt);
      //pgraph.printProgram(p);
      expect(rt.DP).toBe(1);
    });
  });

describe('Infinite loop while traversing a white block', () => {
    test('should detect the loop and stop.', () => {
      var data: number[][] = [
        [r,w,w,w],
        [b,w,w,w],
        [w,w,w,w],
        [w,w,w,w]
      ];
      const p = pgraph.buildProgramGraph(data, 4, 4);
      var rt : Runtime.Runtime = new Runtime.Runtime();
      Runtime.loadProgram(rt, p);
      Runtime.runUntilPause(rt);
      //pgraph.printProgram(p);
      expect(rt.DP).toBe(2);
    });
  });

describe('White block traversal with simple turn', () => {
    test('should reach the next block.', () => {
      var data: number[][] = [
        [r,r,w,w,w,b,r],
        [r,b,b,b,r,r,r],
        [r,b,r,r,r,r,r],
        [r,b,b,b,r,r,r]
      ];
      const p = pgraph.buildProgramGraph(data, 7, 4);
      var rt : Runtime.Runtime = new Runtime.Runtime();
      Runtime.loadProgram(rt, p);
      Runtime.runUntilPause(rt);
      //pgraph.printProgram(p);
      expect(rt.DP).toBe(2);
    });
  });

describe('Single white pixel traversal left to right', () => {
    test('should reach the next block.', () => {
      var data: number[][] = [
        [r,r,w,r,r],
        [r,b,b,b,r],
        [r,b,r,r,r],
        [r,b,b,b,r],
      ];
      const p = pgraph.buildProgramGraph(data, 5, 4);
      var rt : Runtime.Runtime = new Runtime.Runtime();
      Runtime.loadProgram(rt, p);
      Runtime.runUntilPause(rt);
      //pgraph.printProgram(p);
      expect(rt.DP).toBe(1);
    });
  });

  describe('roll test 1', () => {
    test('roll', () => {
      var stack: number[] = [
          0,2,2
      ];
  
      roll(stack, 2, 2)
      expect(stack).toStrictEqual([0,2,2]);
    });
  });


describe('roll test 2', () => {
  test('roll', () => {
    var stack: number[] = [
        1,2,3,4
    ];

    roll(stack, 2, 1)
    expect(stack).toStrictEqual([1,2,4,3]);
  });
});

describe('roll test 3', () => {
  test('roll', () => {
    var stack: number[] = [
        1,2,3,4
    ];

    roll(stack, 3, 1)
    expect(stack).toStrictEqual([1,4,2,3]);
  });
});

describe('roll test 4', () => {
  test('roll', () => {
    var stack: number[] = [
        1,2,3,4
    ];

    roll(stack, 3, 2)
    expect(stack).toStrictEqual([1,3,4,2]);
  });
});

describe('roll test 5', () => {
  test('roll', () => {
    var stack: number[] = [
        1,2,3,4
    ];

    roll(stack, 3, 3)
    expect(stack).toStrictEqual([1,2,3,4]);
  });
});

describe('roll test 6', () => {
    test('roll', () => {
    var stack: number[] = [
        1,2,3,4
    ];

    roll(stack, 3, -1)
    expect(stack).toStrictEqual([1,3,4,2]);
  });
});
