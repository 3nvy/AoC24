/**
 * Advent of Code 2024 - Day 10
 * https://adventofcode.com/2024/day/10
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day10/input.txt", "utf-8");
const matrix = dataFromInput
  .split("\n")
  .map((line) => line.split("").map(Number));

const MAX_X = matrix[0].length;
const MAX_Y = matrix.length;

const directionVectors = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

/**
 * Solution Part 1
 */

const lookupTrail = (x: number, y: number, val: number, endPos: string[]) => {
  let trails = 0;

  for (const dir of directionVectors) {
    const nX = x + dir[0];
    const nY = y + dir[1];

    if (nX >= 0 && nX < MAX_X && nY >= 0 && nY < MAX_Y) {
      const nValue = matrix[nY][nX];

      if (val + 1 === nValue && nValue == 9) {
        if (!endPos.includes(`${nX},${nY}`)) {
          endPos.push(`${nX},${nY}`);
          trails++;
        }
      } else if (val + 1 === nValue) {
        const deepTrails = lookupTrail(nX, nY, nValue, endPos);
        trails += deepTrails;
      }
    }
  }

  return trails;
};
let time = Date.now();

let result = 0;
for (let y = 0; y < MAX_Y; y++) {
  for (let x = 0; x < MAX_X; x++) {
    const isStartPos = matrix[y][x] === 0;
    if (isStartPos) {
      const numberOfTrails = lookupTrail(x, y, 0, []);

      result += numberOfTrails;
    }
  }
}

console.log("Part 1: ", result, "Time: ", (Date.now() - time) / 1000);

/**
 * Solution Part 2
 */

const lookupTrailTwo = (x: number, y: number, val: number) => {
  let trails = 0;

  for (const dir of directionVectors) {
    const nX = x + dir[0];
    const nY = y + dir[1];

    if (nX >= 0 && nX < MAX_X && nY >= 0 && nY < MAX_Y) {
      const nValue = matrix[nY][nX];

      if (val + 1 === nValue && nValue == 9) {
        trails++;
      } else if (val + 1 === nValue) {
        const deepTrails = lookupTrailTwo(nX, nY, nValue);
        trails += deepTrails;
      }
    }
  }

  return trails;
};

let resultPartTwo = 0;
time = Date.now();

for (let y = 0; y < MAX_Y; y++) {
  for (let x = 0; x < MAX_X; x++) {
    const isStartPos = matrix[y][x] === 0;
    if (isStartPos) {
      resultPartTwo += lookupTrailTwo(x, y, 0);
    }
  }
}

console.log("Part 2: ", resultPartTwo, "Time: ", (Date.now() - time) / 1000);
