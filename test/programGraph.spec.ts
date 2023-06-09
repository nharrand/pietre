import * as pgraph from '../src/programGraph';


describe('5x25 pixels w/ black -> 125 blocks test', () => {
  test('should return a program with a main block with a value of 70.', () => {
    var data: number[][] = [
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,0,1,1],
      [1,0,2,0,1],
      [1,2,3,2,1],
      [1,0,2,0,1],
      [1,1,0,1,1],
      [1,4,1,4,1],
      [1,5,4,5,1],
      [1,4,1,4,1],
      [1,5,4,5,1],
      [1,4,1,4,1],
      [1,5,4,5,1],
      [1,4,1,4,1],
      [1,5,4,5,1],
      [1,4,1,4,1],
      [1,5,4,5,1],
      [1,4,1,4,1],
      [1,1,0,1,1],
      [1,0,2,0,1],
      [1,2,3,2,1],
      [1,0,2,0,1],
      [1,1,0,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1]
    ];
    var w: number = 5;
    var h: number = 25;
    const p = pgraph.parseProgram(data, w, h);
    pgraph.unifyBlackBlocks(p);
    pgraph.findStartingPosition(p);
    //pgraph.printProgram(p);
    expect(p.start.value).toBe(70);
  });
});

describe('5x8 pixels w/ black -> 40 blocks test', () => {
  test('should return a program with a main block with a value of 29.', () => {
    var data: number[][] = [
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,0,1,1],
      [1,0,2,0,1],
      [1,2,3,2,1],
      [1,0,2,0,1],
      [1,1,0,1,1],
      [1,1,1,1,1]
    ];
    var w: number = 5;
    var h: number = 8;
    const p = pgraph.parseProgram(data, w, h);
    pgraph.unifyBlackBlocks(p);
    pgraph.findStartingPosition(p);
    //pgraph.printProgram(p);
    expect(p.start.value).toBe(29);
  });
});

describe('11x11 pixels w/ black -> 7 blocks test', () => {
  test('should return a program with 7 non black blocks.', () => {
    var data: number[][] = [
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,2,2,2],
      [1,1,1,1,1,1,1,1,2,2,3],
      [1,1,1,1,1,1,1,2,2,3,3],
      [1,1,1,1,1,1,1,2,2,3,3],
      [1,1,1,1,1,1,3,3,3,3,3],
      [1,1,1,1,0,1,1,3,3,3,3],
      [1,1,1,0,1,0,1,1,3,3,3],
      [1,1,0,1,1,1,0,1,3,3,3],
      [1,1,1,0,4,0,1,1,1,3,3],
      [5,5,5,5,5,1,1,1,1,1,6],
      [5,5,5,5,5,6,6,6,6,6,6],
    ];
    var w: number = 11;
    var h: number = 11;
    var p = pgraph.parseProgram(data, w, h);
    pgraph.unifyBlackBlocks(p);
    //pgraph.printProgram(p);
    expect(p.blocks.length).toBe(7);
  });
});


describe('5x5 pixels w/ black -> 25 blocks test', () => {
  test('should return a program with 6 non black block.', () => {
    var data: number[][] = [
      [1,1,0,1,1],
      [1,0,2,0,1],
      [0,2,2,2,0],
      [0,0,3,0,0],
      [3,3,3,3,3]
    ];
    var w: number = 5;
    var h: number = 5;
    const p = pgraph.parseProgram(data, w, h);
    //pgraph.printProgram(p);
    expect(p.blocks.length).toBe(9);
  });
});

describe('6x6 pixels -> 36 blocks test', () => {
  test('should return a program with 13 non black block.', () => {
    var data: number[][] = [
      [4,4,1,2,4,4],
      [4,4,3,3,4,4],
      [5,3,3,3,3,6],
      [7,3,3,3,3,8],
      [4,4,3,3,4,4],
      [4,4,9,1,4,4]
    ];
    var w: number = 6;
    var h: number = 6;
    const p = pgraph.parseProgram(data, w, h);
    //pgraph.printProgram(p);
    expect(p.blocks.length).toBe(13);
  });
});


describe('5x5 pixels -> 25 blocks test', () => {
  test('should return a program with 6 non black blocks.', () => {
    var data: number[][] = [
      [1,1,1,1,1],
      [2,3,3,3,3],
      [4,5,5,5,3],
      [4,5,3,3,3],
      [4,6,6,6,6]
    ];
    var w: number = 5;
    var h: number = 5;
    const p = pgraph.parseProgram(data, w, h);
    //pgraph.printProgram(p);
    expect(p.blocks.length).toBe(6);
  });
});

describe('3x4 pixels w/ black -> 40 blocks test', () => {
  test('should return a program with a main block with a value of 10.', () => {
    var data: number[][] = [
      [1,1,1],
      [1,2,1],
      [1,2,1],
      [1,1,1],
    ];
    var w: number = 3;
    var h: number = 4;
    const p = pgraph.parseProgram(data, w, h);
    pgraph.unifyBlackBlocks(p);
    pgraph.findStartingPosition(p);
    //pgraph.printProgram(p);
    expect(p.start.value).toBe(10);
  });
});


describe('3x3 pixels 2 -> 9 blocks test', () => {
  test('should return a program with 3 non black blocks correctly connected.', () => {
    var data: number[][] = [
      [1,1,2],
      [1,3,2],
      [2,2,2]
    ];
    var w: number = 3;
    var h: number = 3;
    const p = pgraph.parseProgram(data, w, h);
    //pgraph.printProgram(p);
    expect(p.blocks.length).toBe(3);

    expect(p.blocks[0].color).toBe(1);
    expect(p.blocks[0].value).toBe(3);
    expect(p.blocks[0].right[0].color).toBe(2);
    expect(p.blocks[0].right[1].color).toBe(2);
    expect(p.blocks[0].down[0].color).toBe(2);
    expect(p.blocks[0].down[1].color).toBe(2);

    
    expect(p.lines[0].elements[1].block.color).toBe(2);
    expect(p.lines[0].elements[1].block.value).toBe(5);
  });
});


describe('3x3 pixels -> 9 blocks test', () => {
  test('should return a program with 5 non black blocks correctly connected.', () => {
    var data: number[][] = [
      [1,2,2],
      [1,3,4],
      [5,5,4]
    ];
    var w: number = 3;
    var h: number = 3;
    const p = pgraph.parseProgram(data, w, h);
    //pgraph.printProgram(p);
    expect(p.blocks.length).toBe(5);

    expect(p.blocks[0].color).toBe(1);
    expect(p.blocks[0].value).toBe(2);
    expect(p.blocks[0].right[0].color).toBe(2);
    expect(p.blocks[0].right[1].color).toBe(3);

    expect(p.blocks[1].color).toBe(2);
    expect(p.blocks[1].value).toBe(2);
    expect(p.blocks[1].down[0].color).toBe(4);
    expect(p.blocks[1].down[1].color).toBe(3);

    expect(p.blocks[3].color).toBe(4);
    expect(p.blocks[3].value).toBe(2);
    expect(p.blocks[3].left[0].color).toBe(5);
    expect(p.blocks[3].left[1].color).toBe(3);

    expect(p.blocks[4].color).toBe(5);
    expect(p.blocks[4].value).toBe(2);
    expect(p.blocks[4].up[0].color).toBe(1);
    expect(p.blocks[4].up[1].color).toBe(3);
  });
});


describe('2x2 pixels -> 4 blocks test', () => {
  test('should return a program with 4 non black blocks correctly connected.', () => {
    var data: number[][] = [
      [1,2],
      [3,4]
    ];
    var w: number = 2;
    var h: number = 2;
    const p = pgraph.parseProgram(data, w, h);
    //pgraph.printProgram(p);
    expect(p.blocks.length).toBe(4);


    expect(p.blocks[0].color).toBe(1);
    expect(p.blocks[0].value).toBe(1);
    expect(p.blocks[0].right[0].color).toBe(2);
    expect(p.blocks[0].right[1].color).toBe(2);
    expect(p.blocks[0].down[0].color).toBe(3);
    expect(p.blocks[0].down[1].color).toBe(3);

    expect(p.blocks[3].color).toBe(4);
    expect(p.blocks[3].value).toBe(1);
    expect(p.blocks[3].up[0].color).toBe(2);
    expect(p.blocks[3].up[1].color).toBe(2);
    expect(p.blocks[3].left[0].color).toBe(3);
    expect(p.blocks[3].left[1].color).toBe(3);


  });
});

describe('1 pixel -> 1 block test', () => {
  test('should return a program with one non black block.', () => {
    var data: number[][] = [
      [1]
    ];
    var w: number = 1;
    var h: number = 1;
    const p = pgraph.parseProgram(data, w, h);
    //pgraph.printProgram(p);
    expect(p.blocks.length).toBe(1);
    expect(p.blocks[0].color).toBe(1);
    expect(p.blocks[0].value).toBe(1);
  });
});



/*describe('printProgram', () => {
  test('should print the block description of each color blocks of a program', () => {
    var data: number[][] = [];
    var w: number = 0;
    var h: number = 0;
    const image = Jimp.read("input-programs/Piet_hello.png", function (err, image) {
      for(var i = 0; i < image.bitmap.height; i++) {
        var row: number[] = [];
        for(var j = 0; j < image.bitmap.width; j++) {
          row.push(image.getPixelColor(i, j));
        }
        data.push(row);
      }
      w = image.bitmap.width;
      h = image.bitmap.height;
      console.log("Image: " + w + "x" + h);
      console.log("  (0,0)): " + data[0][0]);
      const p = pgraph.parseProgram(data, w, h);
      pgraph.printProgram(p);
    });
  });
});*/
