import { Program, parseProgram, printProgram, unifyBlackBlocks, findStartingPosition } from "./programGraph";
import { Runtime, runProgram } from "./runtime";
import Jimp = require("jimp");


export function run(data : number[][], w: number, h: number) {

    var program: Program = parseProgram(data,w,h);

  
    //Unify black
    unifyBlackBlocks(program);
    printProgram(program);
    findStartingPosition(program);
  
    //Remove white
  
  
    //Run

    var runtime : Runtime = new Runtime();
    
    runProgram(runtime, program);
  }

    var inputFile : string | undefined = process.argv[2];

    //inputFile = "input-programs/hw4-1.gif";

    if((inputFile) === undefined) {
        console.log("no file to run");
    } else {
        Jimp.read(inputFile, function (err, image) {
            console.log("Image: " + image.getHeight() + "x" + image.getWidth());
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
    }

