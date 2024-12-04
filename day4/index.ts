/**
 * Advent of Code 2024 - Day 2
 * https://adventofcode.com/2024/day/2
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day4/input.txt", "utf-8");
const matrix = dataFromInput.split("\n").map((line) => line.split(""));

const MAX_X = matrix[0].length;
const MAX_Y = matrix.length;

// Solution Part 1
let wordCount = 0;
const wantedWord = "XMAS";
const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

const verifyWordByDirection = (
  originX: number,
  originY: number,
  direction: number[],
  idx: number = 1
) => {
  const [x, y] = direction;
  const newX = originX + x;
  const newY = originY + y;
  // Validate Borders
  if (newX >= MAX_X || newX < 0 || newY >= MAX_Y || newY < 0) return false;

  // Check Letter on Index
  if (matrix[newY][newX] === wantedWord[idx]) {
    if (idx === wantedWord.length - 1) return true;
    return verifyWordByDirection(newX, newY, direction, ++idx);
  } else return false;
};

for (let y = 0; y < MAX_Y; y++) {
  for (let x = 0; x < MAX_X; x++) {
    if (matrix[y][x] === "X") {
      for (const direction of directions) {
        const hasWord = verifyWordByDirection(x, y, direction);
        if (hasWord) {
          wordCount++;
        }
      }
    }
  }
}

console.log("Part 1: ", wordCount); // 2646

// Solution Part 2
let X_MASCount = 0;
const verifyCrossMAS = (x: number, y: number) => {
  // Validate Borders
  if (x + 1 >= MAX_X || x - 1 < 0 || y + 1 >= MAX_Y || y - 1 < 0) return false;

  const hasDirOneValid =
    (matrix[y + 1][x + 1] === "S" && matrix[y - 1][x - 1] === "M") ||
    (matrix[y + 1][x + 1] === "M" && matrix[y - 1][x - 1] === "S");

  const hasDirTwoValid =
    (matrix[y - 1][x + 1] === "S" && matrix[y + 1][x - 1] === "M") ||
    (matrix[y - 1][x + 1] === "M" && matrix[y + 1][x - 1] === "S");

  if (hasDirOneValid && hasDirTwoValid) return true;
};

for (let y = 0; y < MAX_Y; y++) {
  for (let x = 0; x < MAX_X; x++) {
    if (matrix[y][x] === "A") {
      const hasWord = verifyCrossMAS(x, y);
      if (hasWord) {
        X_MASCount++;
      }
    }
  }
}

console.log("Part 2: ", X_MASCount); // 2646
