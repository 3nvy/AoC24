/**
 * Advent of Code 2024 - Day 2
 * https://adventofcode.com/2024/day/2
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day8/input.txt", "utf-8");
const matrix = dataFromInput.split("\n").map((line) => line.split(""));

const MAX_X = matrix[0].length;
const MAX_Y = matrix.length;

// Build Signal Location and Signal Groups Maps
const signalLocations = new Map();
const signalTypeLocations = new Map();
const antiNodes = new Set();

// Build Data Structure
for (let y = 0; y < MAX_Y; y++) {
  for (let x = 0; x < MAX_X; x++) {
    const tile = matrix[y][x];
    if (tile !== ".") {
      signalLocations.set(`${x},${y}`, tile);
      signalTypeLocations.set(tile, [
        ...(signalTypeLocations.get(tile) ?? []),
        `${x},${y}`,
      ]);
    }
  }
}

// Calculates the next AntiNode
const generateAntiNode = (
  x: number,
  y: number,
  xIncrease: number,
  yIncrease: number,
  recursive?: boolean
) => {
  const antiNode = [x + xIncrease, y + yIncrease];
  if (
    antiNode[0] >= 0 &&
    antiNode[0] < MAX_X &&
    antiNode[1] >= 0 &&
    antiNode[1] < MAX_Y
  ) {
    antiNodes.add(`${antiNode[0]},${antiNode[1]}`);
    signalLocations.set(`${antiNode[0]},${antiNode[1]}`, "#");

    if (recursive)
      generateAntiNode(
        antiNode[0],
        antiNode[1],
        xIncrease,
        yIncrease,
        recursive
      );

    return true;
  }
};

/**
 * Solution Part 1
 */
antiNodes.clear();
let time = Date.now();

for (const group of signalTypeLocations.values()) {
  for (let i = 0; i < group.length - 1; i++) {
    const [cX, cY] = group[i].split(",").map(Number);

    for (let j = i + 1; j < group.length; j++) {
      const [nX, nY] = group[j].split(",").map(Number);

      generateAntiNode(cX, cY, cX - nX, cY - nY);
      generateAntiNode(nX, nY, nX - cX, nY - cY);
    }
  }
}

console.log("Part 1: ", antiNodes.size, "Time: ", (Date.now() - time) / 1000);

/**
 * Solution Part 2
 */
antiNodes.clear();
time = Date.now();

for (const group of signalTypeLocations.values()) {
  for (let i = 0; i < group.length - 1; i++) {
    const [cX, cY] = group[i].split(",").map(Number);
    antiNodes.add(`${cX},${cY}`);

    for (let j = i + 1; j < group.length; j++) {
      const [nX, nY] = group[j].split(",").map(Number);
      antiNodes.add(`${nX},${nY}`);

      generateAntiNode(cX, cY, cX - nX, cY - nY, true);
      generateAntiNode(nX, nY, nX - cX, nY - cY, true);
    }
  }
}

console.log("Part 2: ", antiNodes.size, "Time: ", (Date.now() - time) / 1000);

// Visualize Puzzle
if (!true) {
  for (let y = 0; y < MAX_Y; y++) {
    let row = "";
    for (let x = 0; x < MAX_X; x++) {
      row += signalLocations.get(`${x},${y}`) ?? ".";
    }
    console.log(row);
  }
}
