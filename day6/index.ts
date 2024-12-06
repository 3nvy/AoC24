/**
 * Advent of Code 2024 - Day 2
 * https://adventofcode.com/2024/day/2
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day6/input.txt", "utf-8");
const puzzleString = dataFromInput.split("\n");
const matrix = puzzleString.map((line) => line.split(""));

const MAX_X = matrix[0].length;
const MAX_Y = matrix.length;

const guardPos = puzzleString.join("").indexOf("^");
let START_POS = [guardPos % MAX_X, Math.floor(guardPos / MAX_X)];

let directionIndex = 0;
const directionVectors = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

/**
 * Solution Part 1
 */

let currentPos = [...START_POS];
const visitedPositions = new Set([currentPos.join(",")]);

while (true) {
  const [nextX, nextY] =
    directionVectors[directionIndex % directionVectors.length];
  const newX = currentPos[0] + nextX;
  const newY = currentPos[1] + nextY;

  if (newX < 0 || newX >= MAX_X || newY < 0 || newY >= MAX_Y) {
    break;
  }

  const nextStep = matrix[newY][newX];

  // Rotates the direction if obstacle found
  if (nextStep === "#") {
    directionIndex++;
  }
  // Moves to new position and adds it to the Set
  else {
    currentPos = [newX, newY];
    visitedPositions.add(`${newX},${newY}`);
  }
}

console.log("Part 1: ", visitedPositions.size);

/**
 * Solution Part 2
 *
 * In order to solve Part 2, we need to know when we are on an infinite loop, but by its own nature
 * is infinite, so we need some signal to detect that.
 *
 * In an obstacle puzzle, we can detect we are in a loop if the same step has been traversed twice, through the same direction,
 * so in order to detect this, we store a collision log for each obstacle, and every time we hit a new obstacle, we compare and see
 * if we had done so already by the same direction before. If so, we are in a loop!
 */

let neededObstacles = 0;

for (let y = 0; y < MAX_Y; y++) {
  for (let x = 0; x < MAX_X; x++) {
    const step = matrix[y][x];

    if (step === ".") {
      // Resets position and direction
      directionIndex = 0;
      currentPos = [...START_POS];

      // Storage for hit log
      const hitLog = new Set();

      while (true) {
        const [nextX, nextY] =
          directionVectors[directionIndex % directionVectors.length];
        const newX = currentPos[0] + nextX;
        const newY = currentPos[1] + nextY;

        if (newX < 0 || newX >= MAX_X || newY < 0 || newY >= MAX_Y) {
          break;
        }

        const nextStep = matrix[newY][newX];

        // Rotates the direction if obstacle found
        if (nextStep === "#" || (newX === x && newY === y)) {
          const hitRecord = `${newX},${newY},${currentPos[0]},${currentPos[1]}`;
          const hasHitRecord = hitLog.has(hitRecord);

          if (hasHitRecord) {
            neededObstacles++;
            break;
          }

          directionIndex++;
          hitLog.add(hitRecord);
        }
        // Moves to new position and adds it to the Set
        else {
          currentPos = [newX, newY];
        }
      }
    }
  }
}

console.log("Part 2: ", neededObstacles);
