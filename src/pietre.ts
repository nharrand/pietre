import { Program, parseProgram, printProgram, unifyBlackBlocks } from "./programGraph";
import { Runtime, runProgram } from "./runtime";
import Jimp = require("jimp");


export function run(data : number[][], w: number, h: number) {

    var program: Program = parseProgram(data,w,h);

    printProgram(program);
  
    //Unify black
    unifyBlackBlocks(program);
  
    //Remove white
  
  
    //Run

    var runtime : Runtime = new Runtime();
    
    runProgram(runtime, program);
  }

  Jimp.read("input-programs/Piet_hello.png", function (err, image) {
    console.log("Image: " + image.bitmap.height + "x" + image.bitmap.width);
    var data: number[][] = [];
    for(var x = 0; x < image.getHeight(); x++) {
        var row: number[] = [];
        for(var y = 0; y < image.getWidth(); y++) {
            row.push((image.getPixelColour(y,x) - 0xFF)/0x100);
            //console.log("(" + x + "," + y + ") -> 0x" + ((image.getPixelColour(y,x) - 0xFF)/0x100).toString(16));
        }
        data.push(row);
    }

    run(data, image.getWidth(), image.getHeight());
  });