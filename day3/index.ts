/**
 * Advent of Code 2024 - Day 2
 * https://adventofcode.com/2024/day/2
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day3/input.txt", "utf-8");
const formattedMemoryString = dataFromInput.replaceAll("\n", "");

// Solution Part 1

const mulEntries: string[] =
  formattedMemoryString.match(/mul\(\d+,\d+\)/g) ?? [];

const solutionPart1 = mulEntries?.reduce((acc, inst) => {
  const [a, b] = inst.match(/\d+/g)?.map(Number) ?? [];

  if (a && b) return acc + a * b;

  return acc;
}, 0);

console.log("Part 1: ", solutionPart1); // 170068701

// Solution Part 2

const operations = formattedMemoryString.match(
  /mul\(\d+,\d+\)|do\(\)|don't\(\)/g
);

let canExecute = true;

const solutionPart2 = operations?.reduce((acc, operation) => {
  if (operation === "do()") {
    canExecute = true;
    return acc;
  }

  if (operation === "don't()") {
    canExecute = false;
    return acc;
  }

  if (!canExecute) return acc;

  const [a, b] = operation.match(/\d+/g)?.map(Number) ?? [];

  if (a && b) return acc + a * b;

  return acc;
}, 0);

console.log("Part 2: ", solutionPart2); // 78683433
