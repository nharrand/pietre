import { Black, Block, Program } from "./programGraph";
import { log } from "./logger";

export class Runtime {
    DP: number = 1; //0,1,2,3
    CC: number = 0; //0,1 
    Palette: Map<number,Color> = initPalette();
    Stack: number[] = [];
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

export function runProgram(runtime: Runtime, program: Program) {
    var curBlock: Block = program.start;
    var nextBlock: Block;

    log("Program start...")

    while(!curBlock.isFinal) {
        nextBlock = getNextBlock(runtime, curBlock);
        if(nextBlock == Black) break;
        applyInstruction(runtime, curBlock, nextBlock);
        curBlock = nextBlock;
    }
    
    log("Program ended.")
}

export function getNextBlock(runtime: Runtime, curBlock: Block): Block {
    var tentative : Block = Black;
    var c: number = 0;
    do {
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
        if( c % 2 == 0) {
            runtime.CC = (runtime.CC + 1) % 2;
        } else {
            runtime.DP = (runtime.DP + 1) % 4;
        }
        c++;
    } while ((tentative == Black) && (c < 8));
    return tentative;
}

export function applyInstruction(runtime: Runtime, source: Block, destination: Block) {
    //Non of these block should be black or white, nor should they be the same color
    const c1 = runtime.Palette.get(source.color);
    const c2 = runtime.Palette.get(destination.color);

    const ldiff: number = c2.light - c1.light % 3;
    const hdiff: number = c2.hue - c1.hue % 6;

    switch (ldiff) {
        case 0: {
            switch (hdiff) {
                case 0: {
                    break;
                }
                case 1: {
                    //Add
                    const a = runtime.Stack.pop();
                    const b = runtime.Stack.pop();
                    runtime.Stack.push(a + b);
                    log("add " + a + " " + b);
                    break;
                }
                case 2: {
                    //divide
                    const a = runtime.Stack.pop();
                    const b = runtime.Stack.pop();
                    runtime.Stack.push(Math.floor(b/a));
                    log("divide " + a + " " + b);
                    break;
                }
                case 3: {
                    //greater
                    const a = runtime.Stack.pop();
                    const b = runtime.Stack.pop();
                    runtime.Stack.push(b > a ? 1 : 0);
                    log("greater " + a + " " + b);
                    
                    break;
                }
                case 4: {
                    const a = runtime.Stack[runtime.Stack.length];
                    runtime.Stack.push(a);
                    log("duplicate " + a);
                    break;
                }
                case 5: {
                    //in(char)
                    log("in(char) ");
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
                    const a = runtime.Stack.pop();
                    const b = runtime.Stack.pop();
                    runtime.Stack.push(b - a);
                    log("substract " + a + " " + b);
                    break;
                }
                case 2: {
                    //mod
                    const a = runtime.Stack.pop();
                    const b = runtime.Stack.pop();
                    runtime.Stack.push(b % a);
                    log("mod " + a + " " + b);
                    break;
                }
                case 3: {
                    //pointer
                    const a = runtime.Stack.pop();
                    runtime.DP = (runtime.DP + a) % 4;
                    log("pointer " + a);
                    break;
                }
                case 4: {
                    //roll
                    const a = runtime.Stack.pop();
                    const b = runtime.Stack.pop();
                    log("roll " + a + " " + b);
                    break;
                }
                case 5: {
                    //out(number)
                    const a = runtime.Stack.pop();
                    console.log(a);
                    log("out(number) ");
                    break;
                }
            }
            break;
        }
        case 2: {
            switch (hdiff) {
                case 0: {
                    //pop
                    runtime.Stack.pop();
                    log("pop ");
                    break;
                }
                case 1: {
                    //multiply
                    const a = runtime.Stack.pop();
                    const b = runtime.Stack.pop();
                    runtime.Stack.push(a * b);
                    log("multiply " + a + " " + b);
                    break;
                }
                case 2: {
                    //not
                    const a = runtime.Stack.pop();
                    runtime.Stack.push(a == 0 ? 1 : 0);
                    log("not " + a);
                    break;
                }
                case 3: {
                    //switch
                    const a = runtime.Stack.pop();
                    runtime.CC = (runtime.CC + a) % 2;
                    log("switch " + a);
                    break;
                }
                case 4: {
                    //in(number)
                    log("in(number) ");
                    break;
                }
                case 5: {
                    //out(character)
                    const a = runtime.Stack.pop();
                    console.log(String.fromCharCode(a));
                    log("out(character) " + a);
                    break;
                }
            }
            break;
        }
    }
}
