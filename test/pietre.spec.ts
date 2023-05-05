import { expect } from 'chai';
import * as Pietre from '../src/pietre';
//import { Jimp } from 'jimp';
import Jimp = require("jimp");

describe('sampleFunction', () => {
  it('should return the input value', () => {
    const input = 'Hello World!';
    const result = Pietre.sampleFunction(input);
    expect(result).to.equal(input);
  });
});


describe('testJimp', () => {
  it('should read height and width of an image', () => {
    Jimp.read("input-programs/Piet_hello.png", function (err, image) {
      console.log("Image: " + image.bitmap.height + "x" + image.bitmap.width);
    });
  });
});



describe('5x5 pixels w/ black -> 25 blocks test', () => {
  it('should return a program with 6 non black block', () => {
    var data: number[][] = [
      [1,1,0,1,1],
      [1,0,2,0,1],
      [0,2,2,2,0],
      [0,0,3,0,0],
      [3,3,3,3,3]
    ];
    var w: number = 5;
    var h: number = 5;
    const p = Pietre.parseProgram(data, w, h);
    Pietre.printProgram(p);
    expect(p.blocks.length).to.equal(9);
  });
});

describe('6x6 pixels -> 36 blocks test', () => {
  it('should return a program with 13 non black block', () => {
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
    const p = Pietre.parseProgram(data, w, h);
    //Pietre.printProgram(p);
    expect(p.blocks.length).to.equal(13);
  });
});


describe('5x5 pixels -> 25 blocks test', () => {
  it('should return a program with 6 non black block', () => {
    var data: number[][] = [
      [1,1,1,1,1],
      [2,3,3,3,3],
      [4,5,5,5,3],
      [4,5,3,3,3],
      [4,6,6,6,6]
    ];
    var w: number = 5;
    var h: number = 5;
    const p = Pietre.parseProgram(data, w, h);
    //Pietre.printProgram(p);
    expect(p.blocks.length).to.equal(6);
  });
});


describe('3x3 pixels 2 -> 9 blocks test', () => {
  it('should return a program with 3 non black block', () => {
    var data: number[][] = [
      [1,1,2],
      [1,3,2],
      [2,2,2]
    ];
    var w: number = 3;
    var h: number = 3;
    const p = Pietre.parseProgram(data, w, h);
    //Pietre.printProgram(p);
    expect(p.blocks.length).to.equal(3);
  });
});


describe('3x3 pixels -> 9 blocks test', () => {
  it('should return a program with 5 non black block', () => {
    var data: number[][] = [
      [1,2,2],
      [1,3,4],
      [5,5,4]
    ];
    var w: number = 3;
    var h: number = 3;
    const p = Pietre.parseProgram(data, w, h);
    //Pietre.printProgram(p);
    expect(p.blocks.length).to.equal(5);
  });
});


describe('2x2 pixels -> 4 blocks test', () => {
  it('should return a program with 4 non black block', () => {
    var data: number[][] = [
      [1,2],
      [3,4]
    ];
    var w: number = 2;
    var h: number = 2;
    const p = Pietre.parseProgram(data, w, h);
    //Pietre.printProgram(p);
    expect(p.blocks.length).to.equal(4);
  });
});

describe('1 pixel -> 1 block test', () => {
  it('should return a program with one non black block', () => {
    var data: number[][] = [
      [1]
    ];
    var w: number = 1;
    var h: number = 1;
    const p = Pietre.parseProgram(data, w, h);
    //Pietre.printProgram(p);
    expect(p.blocks.length).to.equal(1);
  });
});



/*describe('printProgram', () => {
  it('should print the block description of each color blocks of a program', () => {
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
      const p = Pietre.parseProgram(data, w, h);
      Pietre.printProgram(p);
    });
  });
});*/
