import { exit, stdin as input, stdout as output } from "node:process";
import * as readline from 'node:readline/promises';
import { Program, parseProgram, printProgram, unifyBlackBlocks, findStartingPosition, buildColumns, buildProgramGraph } from "./programGraph.js";
import { Runtime, loadProgram, runProgram, runUntilPause } from "./runtime.js";
import Jimp = require("jimp");



    var inputFile : string | undefined = process.argv[2];

    //inputFile = "input-programs/hw6.png";


    console.log(" -------------- PietRE --------------");

    if((inputFile) === undefined) {
        console.log("no file to run");
        exit(-1);
    }

    console.log(" - input: " + inputFile);

    var data : number[][] = [];
    var w: number;
    var h: number;


    Jimp.read(inputFile, async function (err, image) {
        console.log(" - Image: " + image.getHeight() + "x" + image.getWidth());
        w = image.getWidth();
        h = image.getHeight();
        for(var x = 0; x < image.getHeight(); x++) {
            var row: number[] = [];
            for(var y = 0; y < image.getWidth(); y++) {
                row.push((image.getPixelColour(y,x) - 0xFF)/0x100);
                //console.log("(" + x + "," + y + ") -> 0x" + ((image.getPixelColour(y,x) - 0xFF)/0x100).toString(16));
            }
            data.push(row);
        }
    
    
        var program: Program = buildProgramGraph(data, w, h);
    
        var runtime: Runtime = new Runtime();
    
        loadProgram(runtime, program);

        console.log(" -------------- Start  --------------");
        var inBuffer: string;
    
        while(!runtime.isDone) {
            runUntilPause(runtime);
    
            if(runtime.isPaused) {
    
                if(runtime.expectingNumber) {
                    const rl = readline.createInterface({ input, output });
        
                    const answer = await rl.question("Input number: ");
        
                    rl.close();
        
                    runtime.in = parseInt(answer);
                } else {
                    if(inBuffer == undefined) {
                        const rl = readline.createInterface({ input, output });
            
                        const answer = await rl.question("Input character(s) :");
                        inBuffer = answer;
            
                        rl.close();
                    }
                    if(inBuffer.length > 0) {
                        runtime.in = inBuffer.charCodeAt(0);
                        inBuffer = inBuffer.substring(1);
                    } else {
                        runtime.in = '\n'.charCodeAt(0);
                        inBuffer = undefined;
                    }
                }
            }
        }
        console.log("\n --------------  Done  --------------");
    });



