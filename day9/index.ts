/**
 * Advent of Code 2024 - Day 9
 * https://adventofcode.com/2024/day/9
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day9/input.txt", "utf-8").replaceAll(
  "\n",
  ""
);

/**
 * Solution Part 1
 */
const bitSort = (arr: string[]) => {
  const tmpArr = [...arr];
  let startIdx = 0;
  let endIdx = tmpArr.length - 1;

  while (startIdx < endIdx) {
    if (tmpArr[startIdx] === ".") {
      const tmpVal = tmpArr[startIdx];
      tmpArr[startIdx] = tmpArr[endIdx];
      tmpArr[endIdx] = tmpVal;

      endIdx--;

      if (tmpArr[startIdx] !== ".") startIdx++;
    } else startIdx++;
  }

  return tmpArr;
};
let time = Date.now();

let idCount = 0;
const decodedString = dataFromInput
  .split("")
  .flatMap((val, idx) => Array(+val).fill(idx % 2 ? "." : `${idCount++}`));

const orderedSequence = bitSort(decodedString);
const result = orderedSequence.reduce((acc, val, idx) => {
  return val === "." ? acc : acc + +val * idx;
}, 0);

console.log("Part 1: ", result, "Time: ", (Date.now() - time) / 1000);

/**
 * Solution Part 2
 */
const fileSort = (arr: Array<[string, number]>) => {
  const tmpArr = [...arr].reverse();

  for (let i = 0; i < tmpArr.length; i++) {
    const [fragment, fragmentSize] = tmpArr[i];

    if (!fragment.includes(".")) {
      const fittableSpotIndex = tmpArr.findLastIndex(
        (fgm, idx) => idx > i && fgm[0] === "." && fgm[1] >= fragmentSize
      );

      if (fittableSpotIndex !== -1) {
        const [_, fittableSpotSize] = tmpArr[fittableSpotIndex];

        if (fittableSpotSize === fragmentSize) {
          const tmpVal = tmpArr[i];
          tmpArr[i] = tmpArr[fittableSpotIndex];
          tmpArr[fittableSpotIndex] = tmpVal;
        } else {
          const difference = fittableSpotSize - fragmentSize;

          const tmpVal = tmpArr[i];
          tmpArr[i] = [".", fragmentSize];
          tmpArr[fittableSpotIndex] = tmpVal;
          tmpArr.splice(fittableSpotIndex, 0, [".", difference]);
        }
      }
    }
  }

  return tmpArr.reverse();
};

idCount = 0;
time = Date.now();

const segments: Array<[string, number]> = dataFromInput
  .split("")
  .map((val, idx) => [idx % 2 ? "." : `${idCount++}`, +val]);

const sortedFileSegments = fileSort(segments);

const [result2] = sortedFileSegments.reduce(
  (acc, [fragment, fragmentCount]) => {
    if (fragment !== ".") {
      for (let i = 0; i < fragmentCount; i++) {
        acc[0] += +fragment * acc[1]++;
      }
    } else {
      acc[1] += fragmentCount;
    }
    return acc;
  },
  [0, 0]
);

console.log("Part 2: ", result2, "Time: ", (Date.now() - time) / 1000);
