/**
 * Advent of Code 2024 - Day 1
 * https://adventofcode.com/2024/day/1
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day1/input.txt", "utf-8");
const listOne: number[] = [];
const listTwo: number[] = [];

dataFromInput.split("\n").forEach((line) => {
  const [numOne, numTwo] = line.split("   ").map(Number);
  listOne.push(numOne);
  listTwo.push(numTwo);
});

// Solution Part 1
const sortedListOne = listOne.toSorted((a, b) => a - b);
const sortedListTwo = listTwo.toSorted((a, b) => a - b);

let part1Solution = 0;
for (let i = 0; i < sortedListOne.length; i++) {
  part1Solution += Math.abs(sortedListOne[i] - sortedListTwo[i]);
}

console.log("Part 1: ", part1Solution); // 2031679

// Solution Part 2
const part2Solution = listOne.reduce((acc, num) => {
  const count = listTwo.filter((n) => n === num).length;
  return acc + num * count;
}, 0);

console.log("Part 2: ", part2Solution); // 2031679
