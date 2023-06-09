export class Program {
  start: Block;
  blocks: Block[] = [];
  lines: Line[] = [];
  columns: Line[] = [];
}


export class Block {
  color: number;
  value: number;
  up: Block[] = [];
  right: Block[] = [];
  down: Block[] = [];
  left: Block[] = [];
  isFinal: boolean = false;
  inBound: Block[] = [];


  margins = {"up": -2,"right": -2,"down": -2,"left": -2};
  corners = {"up": [[0,0],[0,0]],"right": [[0,0],[0,0]],"down": [[0,0],[0,0]],"left": [[0,0],[0,0]]}

  constructor(c:number,v:number) {
    this.color = c;
    this.value = v;
  }
}

export class LineElement {
  block: Block;
  begining: number;
  end: number;
}

export class Line {
  elements: LineElement[] = [];
}

export const Black = new Block(-1,0);

export function getBlockFromX(x : number, l: Line): Block {
  for(var el of l.elements) {
    if(x >= el.begining && x <= el.end) {
      return el.block;
    }
  }
  return Black;
}

export function replaceLinks(replaced: Block, replacement: Block) {
  for(var b of replaced.inBound) {
    if(b.up[0] == replaced) b.up[0] = replacement;
    if(b.up[1] == replaced) b.up[1] = replacement;
    if(b.right[0] == replaced) b.right[0] = replacement;
    if(b.right[1] == replaced) b.right[1] = replacement;
    if(b.down[0] == replaced) b.down[0] = replacement;
    if(b.down[1] == replaced) b.down[1] = replacement;
    if(b.left[0] == replaced) b.left[0] = replacement;
    if(b.left[1] == replaced) b.left[1] = replacement;
    replacement.inBound.push(b);
  }
}

export function updateMargins(stays: Block, removed: Block) {
  //removed is right of stays if one does not go around the other
  if(stays.margins.up >= removed.margins.up) {
    if(stays.margins.up > removed.margins.up) {
      stays.up[0] = removed.up[0];
      stays.corners.up[0] = removed.corners.up[0].slice();
    }
    stays.margins.up = removed.margins.up;
    stays.up[1] = removed.up[1];
    stays.corners.up[1] = removed.corners.up[1].slice();
  }
  if(stays.margins.left >= removed.margins.left) {
    if(stays.margins.left > removed.margins.left) {
      stays.left[0] = removed.left[0];
      stays.corners.left[0] = removed.corners.left[0].slice();
    }
    stays.margins.left = removed.margins.left;
    stays.left[1] = removed.left[1];
    stays.corners.left[1] = removed.corners.left[1].slice();
  }
  if(stays.margins.right <= removed.margins.right) {
    if(stays.margins.right < removed.margins.right) {
      stays.right[0] = removed.right[0];
      stays.corners.right[0] = removed.corners.right[0].slice();
    }
    stays.margins.right = removed.margins.right;
    stays.right[1] = removed.right[1];
    stays.corners.right[1] = removed.corners.right[1].slice();
  }
}

export function merge(x: number, y: number, b1: Block, b2: Block, curLine: Line, p: Program) {
  if (b1 == Black || b2 == Black) return;
  
  b1.value += b2.value;

  updateMargins(b1, b2);

  replaceLinks(b2, b1);

  //update lines
  for(var line of p.lines) {
    for(var el of line.elements) {
      if(el.block == b2) el.block = b1;
    }
  }

  for(var el of curLine.elements) {
    if(el.block == b2) el.block = b1;
  }

  if(p.start == b2) p.start = b1;

  const index = p.blocks.indexOf(b2, 0);
  if (index > -1) {
    p.blocks.splice(index, 1);
  }
  
}


export function parseProgram(data : number[][], w: number, h: number): Program {
  //const w = data[0].length;
  //const h = data.length;

  var program: Program = new Program();


  var prevLine: Line;
  var curLine: Line = new Line();
  var leftBlock: Block;
  var topBlock: Block;
  var curLineElement: LineElement = new LineElement();


  curLine.elements.push(new LineElement());
  curLine.elements[0].begining = 0;
  curLine.elements[0].end = w-1;
  curLine.elements[0].block = Black;


  for(let i = 0; i < h; i++) {
    prevLine = curLine;
    leftBlock = Black;
    curLine = new Line();

    for(let j = 0; j < w; j++) {
      topBlock = getBlockFromX(j, prevLine);

      let curColor = data[i][j];
      if (curColor == leftBlock.color) {
          // extend left block
          leftBlock.value++;
          curLineElement.end++;

        if (curColor == topBlock.color) {
          // merge up if different block
          if(leftBlock != topBlock) {
            merge(i,j,leftBlock, topBlock, curLine, program);
          }
        } else {
          // update top block
          topBlock.down[0] = leftBlock;
          topBlock.corners.down[0] = [j, i-1];
          if(topBlock.margins.down < (i-1)) {
            topBlock.margins.down = i-1;
            topBlock.down[1] = leftBlock;
            topBlock.corners.down[1] = [j, i-1];
          }
          if(leftBlock.inBound.indexOf(topBlock) == -1) leftBlock.inBound.push(topBlock);
          
          // update left block
          if(leftBlock.margins.up == i) {
            leftBlock.up[1] = topBlock;
            leftBlock.corners.up[1] = [j, i];
            if(topBlock.inBound.indexOf(leftBlock) == -1) topBlock.inBound.push(leftBlock);
          }
        }
      } else {
        if (curColor == topBlock.color) {
          // extend top block
          topBlock.value++;
          curLineElement = new LineElement();
          curLineElement.block = topBlock;
          curLineElement.begining = j;
          curLineElement.end = j;
          curLine.elements.push(curLineElement);

          // update left block
          if(leftBlock.margins.right <= (j-1)) {
            if(leftBlock.margins.right < (j-1)) {
              leftBlock.margins.right = j-1;
              leftBlock.right[0] = topBlock;
              leftBlock.corners.right[0] = [j-1, i];
            }
            leftBlock.right[1] = topBlock;
            leftBlock.corners.right[1] = [j-1, i];
            if(topBlock.inBound.indexOf(leftBlock) == -1) topBlock.inBound.push(leftBlock);
          }

          // update top block?
          if(topBlock.margins.left >= j) {
            if(topBlock.margins.left > j) {
              topBlock.margins.left = j;
              topBlock.left[1] = leftBlock;
              topBlock.corners.left[1] = [j, i];
            }
            topBlock.left[0] = leftBlock;
            topBlock.corners.left[0] = [j, i];
            if(leftBlock.inBound.indexOf(topBlock) == -1) leftBlock.inBound.push(topBlock);

          }
          leftBlock = topBlock;
        } else {
          // new block
          var newBlock = new Block(curColor, 1);
          newBlock.up[0] = topBlock;
          newBlock.up[1] = topBlock;
          newBlock.margins.up = i;
          newBlock.corners.up[0] = [j,i];
          newBlock.corners.up[1] = [j,i];
          topBlock.inBound.push(newBlock);
          newBlock.left[0] = leftBlock;
          newBlock.left[1] = leftBlock;
          newBlock.margins.left = j;
          newBlock.corners.left[0] = [j,i];
          newBlock.corners.left[1] = [j,i];
          leftBlock.inBound.push(newBlock);

          curLineElement = new LineElement();
          curLineElement.block = newBlock;
          curLineElement.begining = j;
          curLineElement.end = j;
          curLine.elements.push(curLineElement);

          program.blocks.push(newBlock);

          // update left block
          if(leftBlock.margins.right <= (j-1)) {
            if(leftBlock.margins.right < (j-1)) {
              leftBlock.margins.right = j-1;
              leftBlock.right[0] = newBlock;
              leftBlock.corners.right[0] = [j-1, i];
            }
            leftBlock.right[1] = newBlock;
            leftBlock.corners.right[1] = [j-1, i];
            newBlock.inBound.push(leftBlock);
          }

          // update top block
          topBlock.down[0] = newBlock;
          topBlock.corners.down[0] = [j, i-1];
          if(topBlock.margins.down < (i-1)) {
            topBlock.margins.down = i-1;
            topBlock.down[1] = newBlock;
            topBlock.corners.down[1] = [j, i-1];
          }
          newBlock.inBound.push(topBlock);

          leftBlock = newBlock;
        }
      }
    }
    // left block is a neighbor of the edge
    leftBlock.right[0] = Black;
    if (leftBlock.margins.right != (w-1)) {
      leftBlock.corners.right[0] = [w-1, i];
    }
    leftBlock.right[1] = Black;
    leftBlock.corners.right[1] = [w-1, i];
    leftBlock.margins.right = w-1;
    program.lines.push(curLine);
  }
  //Block of the last line are neighbor of the edge
  for(var el of curLine.elements) {
    el.block.down[0] = Black;
    el.block.down[1] = Black;
    el.block.corners.down[0] = [el.end, h-1];
    el.block.corners.down[1] = [el.begining, h-1];
    el.block.margins.down = h-1;
  }

  return program;
}

export function printProgram(p: Program) {
  for(var block of p.blocks) {
    console.log("");
    console.log("--------------------------------------------------------------------------------------------------------------");
    console.log("Block:");
    console.log(" - color: " + block.color.toString(16));
    console.log(" - value: " + block.value);
    console.log(" - margins: ");
    console.log("   - up    0: " + block.margins.up + " -> (c: " + block.up[0].color.toString(16) + ", v: " + block.up[0].value + ")");
    console.log("   - up    1: " + block.margins.up + " -> (c: " + block.up[1].color.toString(16) + ", v: " + block.up[1].value + ")");

    console.log("   - right 0: " + block.margins.right + " -> (c: " + block.right[0].color.toString(16) + ", v: " + block.right[0].value + ")");
    console.log("   - right 1: " + block.margins.right + " -> (c: " + block.right[1].color.toString(16) + ", v: " + block.right[1].value + ")");

    console.log("   - down  0: " + block.margins.down + " -> (c: " + block.down[0].color.toString(16) + ", v: " + block.down[0].value + ")");
    console.log("   - down  1: " + block.margins.down + " -> (c: " + block.down[1].color.toString(16) + ", v: " + block.down[1].value + ")");

    console.log("   - left  0: " + block.margins.left + " -> (c: " + block.left[0].color.toString(16) + ", v: " + block.left[0].value + ")");
    console.log("   - left  1: " + block.margins.left + " -> (c: " + block.left[1].color.toString(16) + ", v: " + block.left[1].value + ")");
    
  }
}


export function unifyBlackBlocks(program: Program) {
  //Connect all non black blocks connected to a black block to the uniq "Black".
  var toRemove = [];
  for(var k of program.blocks.keys()) {
    var b: Block = program.blocks[k];
    var c: number = 0;
    if(b.up[0].color == 0) {b.up[0] = Black; c++;}
    if(b.up[1].color == 0) {b.up[1] = Black; c++;}
    if(b.right[0].color == 0) {b.right[0] = Black; c++;}
    if(b.right[1].color == 0) {b.right[1] = Black; c++;}
    if(b.down[0].color == 0) {b.down[0] = Black; c++;}
    if(b.down[1].color == 0) {b.down[1] = Black; c++;}
    if(b.left[0].color == 0) {b.left[0] = Black; c++;}
    if(b.left[1].color == 0) {b.left[1] = Black; c++;}

    if(c == 8) b.isFinal = true;

    if(b.color == 0 && b != Black) toRemove.push(k);
  }

  for(var line of program.lines) {
    for(var el of line.elements) {
      if(el.block.color == 0) el.block = Black;
    }
  }
  for(var line of program.columns) {
    for(var el of line.elements) {
      if(el.block.color == 0) el.block = Black;
    }
  }

  //Remove dangling black blocks
  for (var i = toRemove.length -1; i >= 0; i--) {
    program.blocks.splice(toRemove[i],1);
  }
}


export function findStartingPosition(program: Program) {
  //Apparently the top left corner must be non black
  //TOFIX handle the case where the corner is white
  program.start = program.lines[0].elements[0].block;
}

export function buildColumns(program: Program, w: number) {
 

  for(var x = 0; x < w; x++) {
    program.columns.push(new Line());
  }


  for(var y = 0; y < program.lines.length; y++) {
    var line: Line = program.lines[y];
    for(var el of line.elements) {
      for(var x = el.begining; x <= el.end; x++) {
        var column = program.columns[x];
        //console.log("column " + x);
        if((column.elements.length > 0 ) && (el.block == column.elements[column.elements.length-1].block)) {
          column.elements[column.elements.length-1].end++;
        } else {
          var ncolel = new LineElement();
          ncolel.begining = y;
          ncolel.end = y;
          ncolel.block = el.block;
          column.elements.push(ncolel);
        }
      }
    }
  }
}


export function buildProgramGraph(data: number[][], w: number, h: number): Program {

  Black.color = -1;
  var program: Program = parseProgram(data,w,h);
  buildColumns(program, w);
  Black.color = 0;
  unifyBlackBlocks(program);
  findStartingPosition(program);

  return program;
}