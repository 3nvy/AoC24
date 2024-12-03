/**
 * Advent of Code 2024 - Day 2
 * https://adventofcode.com/2024/day/2
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day2/input.txt", "utf-8");
const listOfReports = dataFromInput
  .split("\n")
  .map((line) => line.split(" ").map(Number));

const MAX_DIFF = 3;

enum DIRECTION {
  "DECR" = 0,
  "INC" = 1,
}

enum REPORT {
  "INVALID" = 0,
  "VALID" = 1,
}

const isValidReport = (report: number[], direction: number) =>
  report.reduce((acc, num, idx) => {
    // Don't care about the first index, as we will compare indexes backwards
    // We also don't care about further comparisons if the accumulator is already 0 (invalid report)
    if (idx === 0 || !acc) return acc;

    // Checks direction of the report on first interaction
    if (idx === 1) {
      direction = num < report[0] ? DIRECTION.DECR : DIRECTION.INC;
    } else {
      // If the direction is not the same as the first interaction, we can skip this report
      if (num < report[idx - 1] && direction === DIRECTION.INC)
        return REPORT.INVALID;
      if (num > report[idx - 1] && direction === DIRECTION.DECR)
        return REPORT.INVALID;
    }

    // Normalizes the difference between the current number and the previous one
    const diff = Math.abs(num - report[idx - 1]);

    return diff && diff <= MAX_DIFF ? REPORT.VALID : REPORT.INVALID;
  }, REPORT.VALID);

// Solution Part 1

const solutionPart1 = listOfReports.reduce((acc, report) => {
  // Default direction is increasing
  let direction = DIRECTION.DECR;

  const safeInt = isValidReport(report, direction);

  return acc + safeInt;
}, 0);

console.log("Part 1: ", solutionPart1); // 252

// Solution Part 2

const solutionPart2 = listOfReports.reduce((acc, report) => {
  // Default direction is increasing
  let direction = DIRECTION.DECR;

  const safeInt = isValidReport(report, direction);

  if (!safeInt) {
    let validReportWithLevelDeleted = REPORT.INVALID;

    for (let i = 0; i < report.length; i++) {
      const reportCopy = report.toSpliced(i, 1);

      validReportWithLevelDeleted = isValidReport(reportCopy, direction);

      if (validReportWithLevelDeleted) {
        break;
      }
    }

    return acc + validReportWithLevelDeleted;
  } else {
    return acc + safeInt;
  }
}, 0);

console.log("Part 2: ", solutionPart2); // 324
