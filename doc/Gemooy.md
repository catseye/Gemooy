Gemooy
======

This document aims to describe Gemooy, an esoteric programming language.

Program structure
-----------------

A Gemooy program consists of an unbounded two-dimensional grid of cells; each
cell may contain one of three symbols: `@`, `#`, or blank.  A program text may
contain any other symbols, but they are treated as blank cells upon program load.
The symbols `$` and `%` have special meaning; `$` indicates the initial position
of the instruction pointer, `%` indicates the initial position of the data pointer.
All cells outside of the loaded program are considered to contain blanks.

Program state
-------------

Pointing into the grid is an instruction pointer.  The instruction pointer is at
any time moving in one of eight directions corresponding to the deltas (dx, dy)
where -1 <= dx <= 1 and -1 <= dy <= 1 and not (dx = 0 and dy = 0).  The
instruction pointer is initially travelling southeast (dx = 1, dy = 1).

Also pointing into the grid is a data pointer.  The cell under the data pointer
can be "incremented", which means:

*   If it is a blank, it becomes a `#`.
*   If it is a `#`, it becomes a `@`.
*   If it is a `@`, it becomes a blank.

Decrementation is the inverse operation.

Program execution
-----------------

The cells that the instruction pointer passes over are executed.  Executing `@`
causes the direction of the instruction pointer's travel to turn 45 degrees
clockwise if the cell at the data pointer contains a blank, 45 degrees
counterclockwise if the cell at the data pointer contains `#`, or not at all
if the cell at the data pointer contains `@`.

Executing `#` has an effect that depends on direction that the instruction
pointer is travelling:

*   North = Move data pointer one cell north, skip instruction pointer over next cell.
*   East = Move data pointer one cell east, skip instruction pointer over next cell.
*   South = Move data pointer one cell south, skip instruction pointer over next cell.
*   West = Move data pointer one cell west, skip instruction pointer over next cell.
*   Northeast or Northwest = Increment cell at data pointer.
*   Southeast or Southwest = Decrement cell at data pointer.

Executing a blank does nothing.

The program terminates when the instruction pointer travels out of bounds, i.e. away
from the populated grid and into empty space from which it cannot possibly return.
