/**
 * Advent of Code 2024 - Day 10
 * https://adventofcode.com/2024/day/10
 */

import { readFileSync } from "fs";

// Input
const stones = readFileSync("day11/input.txt", "utf-8").split(" ");

/**
 * Solution Part 1
 */

let ticks = 1;
let stoneFormation: string[] = [...stones];
let time = Date.now();

while (ticks > 0) {
  console.log("Tick: ", ticks, "length: ", stoneFormation.length);
  const newStonesFormation = [];
  for (const stone of stoneFormation) {
    // If stone starts with 0, replace with 1
    if (stone === "0") {
      newStonesFormation.push("1");
    }
    //If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
    else if (!(stone.length % 2)) {
      const leftEngrave = stone.substring(0, stone.length / 2);
      const rightEngrave = stone.substring(stone.length / 2);
      newStonesFormation.push(`${+leftEngrave}`);
      newStonesFormation.push(`${+rightEngrave}`);
    }
    // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
    else {
      newStonesFormation.push(stone);
      // newStonesFormation.push(`${+stone * 2024}`);
    }
  }

  stoneFormation = newStonesFormation;
  ticks--;
}

console.log(
  "Part 1: ",
  stoneFormation.length,
  "Time: ",
  (Date.now() - time) / 1000
);

/**
 * Solution Part 2
 */
const cache: { [key: string]: number } = {};

const getTransformedStone = (stone: string) => {
  if (stone === "0") return ["1"];
  if (!(stone.length % 2)) {
    const leftEngrave = `${+stone.substring(0, stone.length / 2)}`;
    const rightEngrave = `${+stone.substring(stone.length / 2)}`;
    return [leftEngrave, rightEngrave];
  } else {
    return [`${+stone * 2024}`];
  }
};

const getDeepStoneNumber = (stones: string[], tick: number): number => {
  if (tick === 0) return stones.length;

  let numberOfStones = 0;

  for (const stone of stones) {
    // Check if stone had been calculated already, if so, increase the count by the number of stones cached
    if (cache[`${stone}:${tick}`]) {
      numberOfStones += cache[`${stone}:${tick}`];
    } else {
      const nextStoneFormation = getTransformedStone(stone);

      const stoneNumber = getDeepStoneNumber(nextStoneFormation, tick - 1);

      numberOfStones += stoneNumber;

      cache[`${stone}:${tick}`] = stoneNumber;
    }
  }

  return numberOfStones;
};

ticks = 75;
stoneFormation = [...stones];
time = Date.now();

const result2 = getDeepStoneNumber(stoneFormation, ticks);

console.log("Part 2: ", result2, "Time: ", (Date.now() - time) / 1000);
