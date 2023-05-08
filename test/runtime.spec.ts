import { expect } from 'chai';
import * as Runtime from '../src/runtime';
import { roll } from '../src/runtime';
import * as Pietre from '../src/programGraph';


const r: number = 0xFF0000;
const w: number = 0xFFFFFF;
const b: number = 0;

describe('5x5 pixels w/ black -> 25 blocks test', () => {
    it('should return a program with 6 non black block', () => {
      var data: number[][] = [
        [r,w,w,w,b,r],
        [b,w,w,w,b,r],
        [w,w,w,w,w,r],
        [w,w,w,w,b,r]
      ];
      const p = Pietre.buildProgramGraph(data, 6, 4);
      var rt : Runtime.Runtime = new Runtime.Runtime();
      Runtime.runProgram(rt,p);
      //Pietre.printProgram(p);
      expect(rt.DP).to.equal(1);
    });
  });

describe('5x5 pixels w/ black -> 25 blocks test', () => {
    it('should return a program with 6 non black block', () => {
      var data: number[][] = [
        [r,w,w,w],
        [b,w,w,w],
        [w,w,w,w],
        [w,w,w,w]
      ];
      const p = Pietre.buildProgramGraph(data, 4, 4);
      var rt : Runtime.Runtime = new Runtime.Runtime();
      Runtime.runProgram(rt,p);
      //Pietre.printProgram(p);
      expect(rt.DP).to.equal(2);
    });
  });

describe('5x5 pixels w/ black -> 25 blocks test', () => {
    it('should return a program with 6 non black block', () => {
      var data: number[][] = [
        [r,r,w,w,w,b,r],
        [r,b,b,b,r,r,r],
        [r,b,r,r,r,r,r],
        [r,b,b,b,r,r,r]
      ];
      const p = Pietre.buildProgramGraph(data, 7, 4);
      var rt : Runtime.Runtime = new Runtime.Runtime();
      Runtime.runProgram(rt,p);
      //Pietre.printProgram(p);
      expect(rt.DP).to.equal(2);
    });
  });

describe('5x5 pixels w/ black -> 25 blocks test', () => {
    it('should return a program with 6 non black block', () => {
      var data: number[][] = [
        [r,r,w,r,r],
        [r,b,b,b,r],
        [r,b,r,r,r],
        [r,b,b,b,r],
      ];
      const p = Pietre.buildProgramGraph(data, 5, 4);
      var rt : Runtime.Runtime = new Runtime.Runtime();
      Runtime.runProgram(rt,p);
      //Pietre.printProgram(p);
      expect(rt.DP).to.equal(1);
    });
  });

  describe('roll test', () => {
    it('roll', () => {
      var stack: number[] = [
          0,2,2
      ];
  
      roll(stack, 2, 2)
      expect(stack).deep.to.equal([0,2,2]);
    });
  });


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