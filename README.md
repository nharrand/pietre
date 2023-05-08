# Pietre

Pietre is interpreter for esoteric language [Piet](https://dangermouse.net/esoteric/piet.html).


## Usage

```bash
  node dist/piet.js my_input
```

Currently Pietre implements the common specification. It supports white blocks and user inputs. Program relying on character sequences as input are supported if EOL is used sequence delimiter.


## Build

```bash
  npm install
  npm run build
```

## Test

```bash
  npm run test
```

## API

To parse a bitmap see `buildProgramGraph(data: number[][], w: number, h: number): Program` from `programGraph.ts`.

To load a program in a `Runtime`, use `loadProgram(Runtime: runtime, program: Program)` from `runtime.ts`.

See `runUntilPause(runtime: Runtime)` to run a loaded program until next user inputs (or program termination) from `runtime.ts`.

To a program for the CLI, see `pietre.ts`


## Todo

 - Handle different codel sizes
 - Improve CLI.
 - Add options to specify undefined behaviors (Non standard colors, non standard instruction interpretations).
 - Clean up exports.
 - Vizual execution.
