/**
 * Advent of Code 2024 - Day 2
 * https://adventofcode.com/2024/day/2
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day7/input.txt", "utf-8");
const calibrations: Array<[number, number[]]> = dataFromInput
  .split("\n")
  .map((i) => {
    const [res, nums] = i.split(": ");
    return [+res, nums.split(" ").map(Number)];
  });

/**
 * Solution Part 1
 */

let time = Date.now();
const validIndexes: number[] = [];
const validCalibrations = calibrations.filter(([result, numbers], idx) => {
  const possibleCombinations = 2 ** (numbers.length - 1);
  let currentCombination = 0;
  let canBeDone = false;

  while (currentCombination < possibleCombinations) {
    /**
     * Converts decimal into binary.
     * With this, we can for eg: convert 2 to 10, and use each binary value as an operator
     *
     * 0 => +  |  1 => *
     */
    const combinationString = currentCombination
      .toString(2)
      .padStart(numbers.length - 1, "0");

    const currentOperationResult = numbers.reduce((acc, num, idx) => {
      if (idx === 0) {
        return num;
      } else {
        return combinationString[idx - 1] === "0" ? acc + num : acc * num;
      }
    }, 0);

    if (currentOperationResult === result) {
      canBeDone = true;
      break;
    } else {
      currentCombination++;
    }
  }

  if (canBeDone) validIndexes.push(idx);

  return canBeDone;
});

const resultPart1 = validCalibrations.reduce(
  (acc, calibration) => acc + calibration[0],
  0
);

console.log("Part 1: ", resultPart1, "Time: ", (Date.now() - time) / 1000);

/**
 * Solution Part 2
 */

time = Date.now();

const validCalibrationsAfterAdjustment = calibrations
  .filter((_, idx) => !validIndexes.includes(idx)) // We only need to recalculate the failed calibrations. The others we already know are possible from Part1
  .filter(([result, numbers]) => {
    const possibleCombinations = 3 ** (numbers.length - 1);
    let currentCombination = 0;
    let canBeDone = false;

    while (currentCombination < possibleCombinations) {
      /**
       * Converts decimal into base3.
       * With this, we can for eg: convert 3 to 10, and use each number (0-2) value as an operator
       *
       * 0 => +  |  1 => *  |  2 => ||
       */
      const combinationString = currentCombination
        .toString(3)
        .padStart(numbers.length - 1, "0");

      const currentOperationResult = numbers.reduce((acc, num, idx) => {
        if (idx === 0) {
          return num;
        } else {
          switch (combinationString[idx - 1]) {
            case "0":
              return acc + num;
            case "1":
              return acc * num;
            case "2":
            default:
              return +`${acc}${num}`;
          }
        }
      }, 0);

      if (currentOperationResult === result) {
        canBeDone = true;
        break;
      } else {
        currentCombination++;
      }
    }

    return canBeDone;
  });

const resultPart2 = validCalibrationsAfterAdjustment.reduce(
  (acc, calibration) => acc + calibration[0],
  0
);

console.log(
  "Part 2: ",
  resultPart2 + resultPart1,
  "Time: ",
  (Date.now() - time) / 1000
);
