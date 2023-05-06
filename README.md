# Pietre

Pietre is interpreter for esoteric language [Piet](https://dangermouse.net/esoteric/piet.html).


## Build

```bash
  npm install
  npm build
```

## Usage

```bash
  node dist/piet.js my_input
```

## API

To parse a bitmap see `parseProgram(data : number[][], w: number, h: number): Program`.

## Todo

 - Handle white blocks.
 
 - Clean up exports.
