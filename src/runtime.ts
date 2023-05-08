import { Black, Block, Line, Program } from "./programGraph.js";
import { log } from "./logger.js";
import * as readline from 'node:readline/promises';

export class Runtime {
    DP: number = 1; //0,1,2,3
    CC: number = 0; //0,1 
    Palette: Map<number,Color> = initPalette();
    Stack: number[] = [];
    program: Program;
    curBlock: Block;
    isDone: boolean;
    isPaused: boolean;
    expectingNumber: boolean;
    in: number;

}

export function printState(runtime: Runtime) {
    const d = runtime.DP > 1 ? (runtime.DP > 0 ? '>' : '^') : (runtime.DP > 2 ? '<' : 'v')
    log(" -- DP: " + d + ", CC: " + runtime.CC + " , Stack: " + printStack(runtime.Stack));
}

export function printStack(s: number[]) : string {
    var str : string = "[";
    for(var i = 0; i < s.length; i++) {
        str += " " + s[i];
    }
    return str + " ]";
}


function initPalette() : Map<number,Color> {
  var p: Map<number,Color> = new Map<number,Color>();

  //light red
  p.set(0xFFC0C0,new Color(0,0,0xFFC0C0));

  //light yellow
  p.set(0xFFFFC0,new Color(0,1,0xFFFFC0));

  //light green
  p.set(0xC0FFC0,new Color(0,2,0xC0FFC0));

  //light cyan
  p.set(0xC0FFFF,new Color(0,3,0xC0FFFF));

  //light blue
  p.set(0xC0C0FF,new Color(0,4,0xC0C0FF));

  //light magenta
  p.set(0xFFC0FF,new Color(0,5,0xFFC0FF));

  //red
  p.set(0xFF0000,new Color(1,0,0xFF0000));

  //yellow
  p.set(0xFFFF00,new Color(1,1,0xFFFF00));

  //green
  p.set(0x00FF00,new Color(1,2,0x00FF00));

  //cyan
  p.set(0x00FFFF,new Color(1,3,0x00FFFF));

  //blue
  p.set(0x0000FF,new Color(1,4,0x0000FF));

  //magenta
  p.set(0xFF00FF,new Color(1,5,0xFF00FF));

  //dark red
  p.set(0xC00000,new Color(2,0,0xC00000));

  //dark yellow
  p.set(0xC0C000,new Color(2,1,0xC0C000));

  //dark green
  p.set(0x00C000,new Color(2,2,0x00C000));

  //dark cyan
  p.set(0x00C0C0,new Color(2,3,0x00C0C0));

  //dark blue
  p.set(0x0000C0,new Color(2,4,0x0000C0));

  //dark magenta
  p.set(0xC000C0,new Color(2,5,0xC000C0));
  
  return p;
}

function mod(n, m) {
    return ((n % m) + m) % m;
}



function applyIn(expectsNumber: boolean, runtime: Runtime) {
    runtime.isPaused = true;
    runtime.expectingNumber = expectsNumber;
}

export class Color {
  light: number; //Can be light medium or dark
  hue: number; //can be red, yellow, green, cyan, blue, magenta, white or black
  code: number;

  constructor(l: number, h: number, c: number) {
    this.light = l;
    this.hue = h;
    this.code = c;
  }
}
  
export function loadProgram(runtime: Runtime, program: Program) {
    runtime.program = program;
    runtime.curBlock = program.start;
    runtime.isDone = false;
    runtime.isPaused = false;
}
export function runUntilPause(runtime: Runtime) {
    var nextBlock: Block;

    if(runtime.isPaused) {
        //Execution was interrupted by 'in' instruction, reading runtime.in and resume
        if(runtime.in != undefined) {
            runtime.Stack.push(runtime.in);
        } else {
            log("failed to read input");
        }
        runtime.isPaused = false;
    }

    while(!runtime.isDone && ! runtime.isPaused) {
        if(runtime.curBlock.isFinal) {
            runtime.isDone = true;
        } else {
            printState(runtime);
            nextBlock = getNextBlock(runtime, runtime.curBlock);
            if(nextBlock.color == white || runtime.Palette.get(nextBlock.color) == undefined) {
                nextBlock = applyWhiteBlock(runtime, runtime.curBlock, nextBlock);
                if(nextBlock == Black) runtime.isDone = true;
            } else {
                if(nextBlock == Black) runtime.isDone = true;
                applyInstruction(runtime, runtime.curBlock, nextBlock);
            }
            runtime.curBlock = nextBlock;
        }
    }
}

export function runProgram(runtime: Runtime, program: Program) {
    var curBlock: Block = program.start;
    var nextBlock: Block;

    log("Program start...")

    while(!curBlock.isFinal) {
        printState(runtime);
        nextBlock = getNextBlock(runtime, curBlock);
        if(nextBlock.color == white) {
            nextBlock = applyWhiteBlock(runtime, curBlock, nextBlock);
            if(nextBlock == Black) break;
        } else {
            if(nextBlock == Black) break;
            applyInstruction(runtime, curBlock, nextBlock);
        }
        curBlock = nextBlock;
    }

    log("Program ended.")
}

export function getNextBlock(runtime: Runtime, curBlock: Block): Block {
    var tentative : Block = Black;
    var c: number = 0;
    while (c < 8) {
        switch(runtime.DP) {
            case 0: {
                tentative = curBlock.up[runtime.CC];
                break;
            }
            case 1: {
                tentative = curBlock.right[runtime.CC];
                break;
            }
            case 2: {
                tentative = curBlock.down[runtime.CC];
                break;
            }
            case 3: {
                tentative = curBlock.left[runtime.CC];
                break;
            }
        }
        if(tentative == Black) {
            if( c % 2 == 0) {
                runtime.CC = (runtime.CC + 1) % 2;
            } else {
                runtime.DP = (runtime.DP + 1) % 4;
            }
            c++;
        } else {
            return tentative;
        }
    }
    return tentative;
}

export function applyInstruction(runtime: Runtime, source: Block, destination: Block) {
    //Non of these block should be black or white, nor should they be the same color
    const c1 = runtime.Palette.get(source.color);
    const c2 = runtime.Palette.get(destination.color);

    const ldiff: number = mod(c2.light - c1.light, 3);
    const hdiff: number = mod(c2.hue - c1.hue, 6);

    switch (ldiff) {
        case 0: {
            switch (hdiff) {
                case 0: {
                    break;
                }
                case 1: {
                    //Add
                    if(runtime.Stack.length >= 2) {
                        const a = runtime.Stack.pop();
                        const b = runtime.Stack.pop();
                        runtime.Stack.push(a + b);
                        log("add " + a + " " + b);
                    } else {
                        log("add failed, stack underflow");
                    }
                    break;
                }
                case 2: {
                    //divide
                    if(runtime.Stack.length >= 2) {
                        const a = runtime.Stack.pop();
                        const b = runtime.Stack.pop();
                        runtime.Stack.push(Math.floor(b/a));
                        log("divide " + a + " " + b);
                    } else {
                        log("devide failed, stack underflow");
                    }
                    break;
                }
                case 3: {
                    //greater
                    if(runtime.Stack.length >= 2) {
                        const a = runtime.Stack.pop();
                        const b = runtime.Stack.pop();
                        runtime.Stack.push(b > a ? 1 : 0);
                        log("greater " + a + " " + b);
                    } else {
                        log("greater failed, stack underflow");
                    }
                    
                    break;
                }
                case 4: {
                    if(runtime.Stack.length >= 1) {
                        const a = runtime.Stack[runtime.Stack.length-1];
                        runtime.Stack.push(a);
                        log("duplicate " + a);
                    } else {
                        log("duplicate failed, stack underflow");
                    }
                    break;
                }
                case 5: {
                    //in(char)
                    log("in(char) ");
                    applyIn(false, runtime);
                    break;
                }
            }
            break;
        }
        case 1: {
            switch (hdiff) {
                case 0: {
                    //Push
                    runtime.Stack.push(source.value);
                    log("push " + source.value);
                    break;
                }
                case 1: {
                    //Substract
                    if(runtime.Stack.length >= 2) {
                        const a = runtime.Stack.pop();
                        const b = runtime.Stack.pop();
                        runtime.Stack.push(b - a);
                        log("substract " + a + " " + b);
                    } else {
                        log("substract failed, stack underflow");
                    }
                    break;
                }
                case 2: {
                    //mod
                    if(runtime.Stack.length >= 2) {
                        const a = runtime.Stack.pop();
                        const b = runtime.Stack.pop();
                        runtime.Stack.push(b % a);
                        log("mod " + a + " " + b);
                    } else {
                        log("mod failed, stack underflow");
                    }
                    break;
                }
                case 3: {
                    //pointer
                    if(runtime.Stack.length >= 1) {
                        const a = runtime.Stack.pop();
                        runtime.DP = (runtime.DP + a) % 4;
                        log("pointer " + a);
                    } else {
                        log("pointer failed, stack underflow");
                    }
                    break;
                }
                case 4: {
                    //roll
                    if(runtime.Stack.length >= 2) {
                        const a = runtime.Stack.pop();
                        const b = runtime.Stack.pop();

                        roll(runtime.Stack, b, a);
                        log("roll " + a + " " + b);
                    } else {
                        log("roll failed, stack underflow");
                    }
                    break;
                }
                case 5: {
                    //out(number)
                    if(runtime.Stack.length >= 1) {
                        const a = runtime.Stack.pop();
                        process.stdout.write(a.toString());
                        log("out(number) ");
                    } else {
                        log("out(number) failed, stack underflow");
                    }
                    break;
                }
            }
            break;
        }
        case 2: {
            switch (hdiff) {
                case 0: {
                    //pop
                    if(runtime.Stack.length >= 1) {
                        runtime.Stack.pop();
                        log("pop ");
                    } else {
                        log("pop failed, stack underflow");
                    }
                    break;
                }
                case 1: {
                    //multiply
                    if(runtime.Stack.length >= 2) {
                        const a = runtime.Stack.pop();
                        const b = runtime.Stack.pop();
                        runtime.Stack.push(a * b);
                        log("multiply " + a + " " + b);
                    } else {
                        log("multiply failed, stack underflow");
                    }
                    break;
                }
                case 2: {
                    //not
                    if(runtime.Stack.length >= 1) {
                        const a = runtime.Stack.pop();
                        runtime.Stack.push(a == 0 ? 1 : 0);
                        log("not " + a);
                    } else {
                        log("not failed, stack underflow");
                    }
                    break;
                }
                case 3: {
                    //switch
                    if(runtime.Stack.length >= 2) {
                        const a = runtime.Stack.pop();
                        runtime.CC = (runtime.CC + a) % 2;
                        log("switch " + a);
                    } else {
                        log("switch failed, stack underflow");
                    }
                    break;
                }
                case 4: {
                    //in(number)
                    log("in(number) ");
                    applyIn(true, runtime);
                    break;
                }
                case 5: {
                    //out(character)
                    if(runtime.Stack.length >= 1) {
                        const a = runtime.Stack.pop();
                        process.stdout.write(String.fromCharCode(a));
                        log("out(character) " + a);
                    } else {
                        log("out(character) failed, stack underflow");
                    }
                    break;
                }
            }
            break;
        }
    }
}

export function roll(stack: number[], depth: number, times: number) {
    if(depth <= stack.length) {
        var barrel : number[] = stack.slice(stack.length - depth);
        for (var i = 0; i < depth; i++) {
            stack[stack.length - depth + i] = barrel[mod(i - times, depth)];
        }
    } else {
        log("roll failed, stack underflow")
    }
}


const white: number = 0xFFFFFF;

export function applyWhiteBlock(runtime: Runtime, source: Block, destination: Block): Block {
    log("White block");
    var visitedCorners : number[][] = [];
    var curX: number = -1;
    var curY: number = -1;
    
    var path: Line;
    switch(runtime.DP) {
        case 0: {
            path = runtime.program.columns[source.corners.up[runtime.CC][0]];
            curX = source.corners.up[runtime.CC][0];
            curY = source.corners.up[runtime.CC][1] - 1;
        }
        break;
        case 1: {
            path = runtime.program.lines[source.corners.right[runtime.CC][1]];
            curX = source.corners.right[runtime.CC][0] + 1;
            curY = source.corners.right[runtime.CC][1];
        }
        break;
        case 2: {
            path = runtime.program.columns[source.corners.down[runtime.CC][0]];
            curX = source.corners.down[runtime.CC][0];
            curY = source.corners.down[runtime.CC][1] + 1;
        }
        break;
        case 3: {
            path = runtime.program.lines[source.corners.left[runtime.CC][1]];
            curX = source.corners.left[runtime.CC][0] - 1;
            curY = source.corners.left[runtime.CC][1];
        }
        break;
    }


    while(true) {
        log("Entering at " + curX + ", " + curY + " -> dir: " + runtime.DP);

        switch(runtime.DP) {
            case 0: {
                //up
                for(var i = 0; i < path.elements.length; i++) {
                    if(path.elements[i].block == destination) {
                        if((i-1 >= 0) && (path.elements[i-1].block != Black)) {
                            return path.elements[i-1].block;
                        } else {
                            curY = path.elements[i].begining;
                            if(visitedCorners.some(c => (c[0] == curX && c[1]== curY && c[2] == runtime.DP))) {
                                return Black;
                            }
                            visitedCorners.push([curX,curY,runtime.DP]);

                            runtime.CC = (runtime.CC + 1) % 2;
                            runtime.DP = (runtime.DP + 1) % 4;
                            path = runtime.program.lines[path.elements[i].begining];
                            break;
                        }
                    }
                }
                break;
            }
            case 1: {
                //right
                for(var i = 0; i < path.elements.length; i++) {
                    if(path.elements[i].block == destination) {
                        if((i+1 < path.elements.length) && (path.elements[i+1].block != Black)) {
                            return path.elements[i+1].block;
                        } else {
                            curX = path.elements[i].end;
                            if(visitedCorners.some(c => (c[0] == curX && c[1]== curY && c[2] == runtime.DP))) {
                                return Black;
                            }
                            visitedCorners.push([curX,curY,runtime.DP]);

                            runtime.CC = (runtime.CC + 1) % 2;
                            runtime.DP = (runtime.DP + 1) % 4;
                            path = runtime.program.columns[path.elements[i].end];
                            break;
                        }
                    }
                }
                break;
            }
            case 2: {
                //down
                for(var i = 0; i < path.elements.length; i++) {
                    if(path.elements[i].block == destination) {
                        if((i+1 < path.elements.length) && (path.elements[i+1].block != Black)) {
                            return path.elements[i+1].block;
                        } else {
                            curY = path.elements[i].end;
                            if(visitedCorners.some(c => (c[0] == curX && c[1]== curY && c[2] == runtime.DP))) {
                                return Black;
                            }
                            visitedCorners.push([curX,curY,runtime.DP]);

                            runtime.CC = (runtime.CC + 1) % 2;
                            runtime.DP = (runtime.DP + 1) % 4;
                            path = runtime.program.lines[path.elements[i].end];
                            break;
                        }
                    }
                }
                break;
            }
            case 3: {
                //left
                for(var i = 0; i < path.elements.length; i++) {
                    if(path.elements[i].block == destination) {
                        if((i-1 >= 0) && (path.elements[i-1].block != Black)) {
                            return path.elements[i-1].block;
                        } else {
                            curX = path.elements[i].begining;
                            if(visitedCorners.some(c => (c[0] == curX && c[1]== curY && c[2] == runtime.DP))) {
                                return Black;
                            }
                            visitedCorners.push([curX,curY,runtime.DP]);

                            runtime.CC = (runtime.CC + 1) % 2;
                            runtime.DP = (runtime.DP + 1) % 4;
                            path = runtime.program.columns[path.elements[i].begining];
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    return Black;
}
