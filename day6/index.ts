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

let time = Date.now();
let currentPos = [...START_POS];
const visitedPositions = new Set([currentPos.join(",")]);
const fullPathHistory: string[] = []; // The full history path will be used by part 2

while (true) {
  const [nextX, nextY] =
    directionVectors[directionIndex % directionVectors.length];
  const newX = currentPos[0] + nextX;
  const newY = currentPos[1] + nextY;

  // Out of bounds means we exited the puzzle
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
    fullPathHistory.push(`${newX},${newY},${directionIndex}`);
  }
}

console.log(
  "Part 1: ",
  visitedPositions.size,
  "Time: ",
  (Date.now() - time) / 1000
);

/**
 * Solution Part 2
 *
 * In order to solve Part 2, we need to know when we are on an infinite loop, but by its own nature
 * is infinite, so we need some signal to detect that.
 *
 * In an obstacle puzzle, we can detect we are in a loop if the same step has been traversed twice, through the same direction,
 * so in order to detect this, we store a collision log for each obstacle, and every time we hit a new obstacle, we compare and see
 * if we had done so already by the same direction before. If so, we are in a loop!
 *
 * OPTIMIZATIONS
 *
 * - Use the traversed tiles recorded in part 1, these are the only ones the guard is guaranteed to go to
 *   so the other tiles are useless, as the guard will never go there until the new obstacle is places.
 *
 * - Start each path from the tile traversed by the guard on part 1, before the placed obstacle. Every path behind is irrelevant as it will always be the same
 *   and only change right before the newly placed obstacle
 */

time = Date.now();
let neededObstacles = 0;
const usedObstacleLocations = new Set();
for (let i = 1; i < fullPathHistory.length; i++) {
  const [x, y] = fullPathHistory[i].split(",").map(Number);

  if (!usedObstacleLocations.has(`${x},${y}`)) {
    usedObstacleLocations.add(`${x},${y}`);
    const step = matrix[y][x];

    if (step === ".") {
      // Resets position and direction

      let [sX, sY, directionIndex = 0] = fullPathHistory[i - 1]
        .split(",")
        .map(Number);
      currentPos = [sX, sY];

      // Storage for hit log
      const hitLog = new Set();

      while (true) {
        const [nextX, nextY] =
          directionVectors[directionIndex % directionVectors.length];
        const newX = currentPos[0] + nextX;
        const newY = currentPos[1] + nextY;

        // Out of bounds means we exited the puzzle
        if (newX < 0 || newX >= MAX_X || newY < 0 || newY >= MAX_Y) {
          break;
        }

        const nextStep = matrix[newY][newX];

        // Checks if next step is obstacle or the place of the new obstacle (want to avoid manipulating or duplicating matrixes for a single tile)
        if (nextStep === "#" || (newX === x && newY === y)) {
          // Creates a hit log and chesks if it already exists. If so, obstacle is valid, if not adds the log to the list and continues
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

console.log("Part 2: ", neededObstacles, "Time: ", (Date.now() - time) / 1000);
