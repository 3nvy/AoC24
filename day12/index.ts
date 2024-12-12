/**
 * Advent of Code 2024 - Day 10
 * https://adventofcode.com/2024/day/10
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day12/input.txt", "utf-8");
const matrix = dataFromInput.split("\n").map((line) => line.split(""));

const MAX_X = matrix[0].length;
const MAX_Y = matrix.length;

/**
 * Solution Part 1
 */

let pos: any = {};
let time = Date.now();

const outlineFence = (
  fenceType: string,
  x: number,
  y: number,
  p: any
): number => {
  if (x < 0 || x === MAX_X || y < 0 || y === MAX_Y) return 0;

  if (pos[`${x},${y}`]) {
    return 0;
  }

  if (matrix[y][x] === fenceType) {
    pos[`${x},${y}`] = fenceType;

    // Each value starts with 4 corners. We then reduce these on each side the value as an equal value on the matrix
    let perimeter = 4;
    try {
      if (matrix[y][x + 1] === fenceType) perimeter--;
    } catch (e) {}
    try {
      if (matrix[y + 1][x] === fenceType) perimeter--;
    } catch (e) {}
    try {
      if (matrix[y][x - 1] === fenceType) perimeter--;
    } catch (e) {}
    try {
      if (matrix[y - 1][x] === fenceType) perimeter--;
    } catch (e) {}

    p.perimeter += perimeter;

    return (
      1 +
      outlineFence(fenceType, x + 1, y, p) +
      outlineFence(fenceType, x, y + 1, p) +
      outlineFence(fenceType, x - 1, y, p) +
      outlineFence(fenceType, x, y - 1, p)
    );
  }
  return 0;
};

let result = 0;

for (let y = 0; y < MAX_Y; y++) {
  for (let x = 0; x < MAX_X; x++) {
    if (!pos[`${x},${y}`]) {
      const val = matrix[y][x];
      const p = { perimeter: 0 };
      const fenceOutline = outlineFence(val, x, y, p);
      result += fenceOutline * p.perimeter;
    }
  }
}

console.log("Part 1: ", result, "Time: ", (Date.now() - time) / 1000);

/**
 * Solution Part 2
 */

pos = {};
time = Date.now();

/**
 * This creates an array of lines, and on each iteraction it tries to iterconnected them.
 *
 * If an itersection is found between existing lines, than its the same line and expands the edges.
 * If not, it means its a different line.
 */
const fillLine = (
  arr: [string, string][],
  currentVector: string,
  lookupVectors: string[]
) => {
  // Finds existing connection that intersect the current lookup path
  const connectedLines = arr.filter(
    (line) => line.includes(lookupVectors[0]) || line.includes(lookupVectors[1])
  );

  /**
   * The starting point of a path usually creates 2 lines based on its edges.
   * The second path is gonna be the same one as the last path connecting the outside border together.
   * To prevent this from creating separate paths, when we are at this intersection, we remove the line on the path created by the starting point of the cluster
   *
   * TODO(Maybe): Can put logic in place to just not create the line of the path on the first iteraction, but this way shopuld cover any possible edge case
   */
  if (connectedLines.length > 1) {
    const index = arr.findIndex(
      (line) =>
        line.includes(lookupVectors[0]) || line.includes(lookupVectors[1])
    );
    arr.splice(index, 1);
    return;
  }

  const connectedLine = connectedLines[0];

  if (!connectedLine) {
    arr.push([currentVector, currentVector]);
  } else {
    if (
      connectedLine[0] === lookupVectors[0] ||
      connectedLine[0] === lookupVectors[1]
    )
      connectedLine[0] = currentVector;
    else connectedLine[1] = currentVector;
  }
};

const fillLineVertically = (arr: [string, string][], x: number, y: number) =>
  fillLine(arr, `${x},${y}`, [`${x},${y - 1}`, `${x},${y + 1}`]);

const fillLineHorizontally = (arr: [string, string][], x: number, y: number) =>
  fillLine(arr, `${x},${y}`, [`${x + 1},${y}`, `${x - 1},${y}`]);

const outlineFenceTwo = (
  fenceType: string,
  x: number,
  y: number,
  data: {
    [key: string]: [string, string][];
  }
): number => {
  if (x < 0 || x === MAX_X || y < 0 || y === MAX_Y) return 0;

  if (pos[`${x},${y}`]) {
    return 0;
  }

  if (matrix[y][x] === fenceType) {
    pos[`${x},${y}`] = fenceType;

    // Build vertical path on edge while when going right
    // * Uses try/catch to avoid validating vectors every time.
    // * We want to fill a line on each value on the edge of the matrix
    try {
      if (matrix[y][x + 1] !== fenceType) {
        fillLineVertically(data.r, x, y);
      }
    } catch (e) {
      fillLineVertically(data.r, x, y);
    }

    // Build horizontal path on edge while when going down
    try {
      if (matrix[y + 1][x] !== fenceType) {
        fillLineHorizontally(data.b, x, y);
      }
    } catch (e) {
      fillLineHorizontally(data.b, x, y);
    }

    // Build vertical path on edge while when going left
    try {
      if (matrix[y][x - 1] !== fenceType) {
        fillLineVertically(data.l, x, y);
      }
    } catch (e) {
      fillLineVertically(data.l, x, y);
    }

    // Build horizontakl path on edge while when going up
    try {
      if (matrix[y - 1][x] !== fenceType) {
        fillLineHorizontally(data.t, x, y);
      }
    } catch (e) {
      fillLineHorizontally(data.t, x, y);
    }

    return (
      1 +
      outlineFenceTwo(fenceType, x + 1, y, data) +
      outlineFenceTwo(fenceType, x, y + 1, data) +
      outlineFenceTwo(fenceType, x - 1, y, data) +
      outlineFenceTwo(fenceType, x, y - 1, data)
    );
  }
  return 0;
};

let result2 = 0;

for (let y = 0; y < MAX_Y; y++) {
  for (let x = 0; x < MAX_X; x++) {
    if (!pos[`${x},${y}`]) {
      const val = matrix[y][x];
      const p: {
        [key: string]: [string, string][];
      } = { t: [], b: [], l: [], r: [] };

      const fenceOutline = outlineFenceTwo(val, x, y, p);
      const sides = Object.values(p).reduce((acc, arr) => acc + arr.length, 0);

      result2 += fenceOutline * sides;
    }
  }
}

console.log("Part 2: ", result2, "Time: ", (Date.now() - time) / 1000);
