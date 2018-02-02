# Game of Life
This is a web app which allows you to play [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). This "game" presents you with a grid of cells, which are either "live" or "dead". Live cells either proliferate or die off everytime the grid updates depending on the cells that surround them. Use it to study chaos math, solve NP hard problems (the game of life is actually Turing complete!), or just watch the pretty colors dance on the screen.

## Installation

All you need to do to get this site up and running on a local is a few simple commands:
```
 $ git clone https://github.com/nicholas-zeiss/game-of-life.git
 $ cd game-of-life/
 $ npm i
 $ npm start
```
That's it! The app will now be running on your localhost at port 4050.

## Implementation

The backend is a simple express server that bundles the frontend code with webpack and serves it up. The frontend is implemented with React and the graphics are created using canvas elements.

This implementation wraps the board, so that the left edge connects to the right and the top to the bottom.

## Usage

Cells can be toggled by clicking or dragging your mouse. You can also pick a preset structure from the collapsible sidebar on the left to insert. These presets are well known groupings of cells with interesting effects, such as oscillating through a set pattern indefinitely, propelling themselves across the board (gliders), or even generating such gliders indefinitely!