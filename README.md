# Minesweeper

Build a simple Minesweeper clone in the next hour or so.

## Setup

To start the boilerplate React app, run `yarn && yarn start` and go to localhost:3000.

You should see a white screen with a "New game" button.

## Spec

Your job is to edit `src/App.js` such that the game is playable.

Your implementation should include the following:

0. The board contains mines.
0. A board renders. (Markup and styles are provided.)
0. Revealed cells show a mine, or a count of adjacent mines.
0. Revealed cells with zero adjacent mines should be blank.
0. Clicking an unrevealed cell reveals it.
0. Clicking an unrevealed cell with zero adjacent mines recursively reveals all adjacent cells.

## Reference

http://minesweeperonline.com/
