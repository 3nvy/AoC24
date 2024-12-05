/**
 * Advent of Code 2024 - Day 2
 * https://adventofcode.com/2024/day/2
 */

import { readFileSync } from "fs";

// Input
const dataFromInput = readFileSync("day5/input.txt", "utf-8");
const [rules, updates] = dataFromInput.split("\n\n").map((i) => i.split("\n"));

/**
 * Solution Part 1
 */
const correctlyOrderedUpdates = updates.filter((update) => {
  const updateNumbers = update.split(",");

  let isOrdered = true;

  // Reduces the amount of rules it has to go through each number
  const relevantRules = rules.filter((rule) =>
    updateNumbers.some((number) => rule.includes(number))
  );

  for (let j = 0; j < updateNumbers.length; j++) {
    const currentNumber = updateNumbers[j];
    for (let i = j; i < updateNumbers.length; i++) {
      const compareNumber = updateNumbers[i];
      for (const rule of relevantRules) {
        // If rule is valid, break cycle as other rules are irrelevant
        if (rule === `${currentNumber}|${compareNumber}`) break;

        // If rule has both numbers, but wrong order, break cycle and immediately break the comparison
        // as we know the update is not ordered
        if (rule === `${compareNumber}|${currentNumber}`) {
          isOrdered = false;
          break;
        }
      }
      if (!isOrdered) break;
    }
    if (!isOrdered) break;
  }

  return isOrdered;
});

const solutionPart1 = correctlyOrderedUpdates.reduce((acc, update) => {
  const numbers = update.split(",");
  return acc + +numbers[Math.floor(numbers.length / 2)];
}, 0);

console.log("Part 1: ", solutionPart1);

/**
 * Solution Part 2
 */
const inCorrectlyOrderedUpdates = updates.filter((update) => {
  const updateNumbers = update.split(",");

  let isOrdered = true;

  // Reduces the amount of rules it has to go through each number
  const relevantRules = rules.filter((rule) =>
    updateNumbers.some((number) => rule.includes(number))
  );

  for (let j = 0; j < updateNumbers.length; j++) {
    const currentNumber = updateNumbers[j];
    for (let i = j; i < updateNumbers.length; i++) {
      const compareNumber = updateNumbers[i];
      for (const rule of relevantRules) {
        // If rule is valid, break cycle as other rules are irrelevant
        if (rule === `${currentNumber}|${compareNumber}`) break;

        // If rule has both numbers, but wrong order, break cycle and immediately break the comparison
        // as we know the update is not ordered
        if (rule === `${compareNumber}|${currentNumber}`) {
          isOrdered = false;
          break;
        }
      }
      if (!isOrdered) break;
    }
    if (!isOrdered) break;
  }

  return !isOrdered; // Return non-ordered reports
});

const reorderUpdates = inCorrectlyOrderedUpdates.map((update) => {
  const updateNumbers = update.split(",");
  const relevantRules = rules.filter((rule) =>
    updateNumbers.some((number) => rule.includes(number))
  );

  return updateNumbers.toSorted((a, b) => {
    // Gets rule relevant to numbers being compared, and checks if they need to be re-ordered
    const rule = relevantRules.find((rule) =>
      [`${a}|${b}`, `${b}|${a}`].includes(rule)
    );

    // In case theres no rule for the numbers
    if (!rule) return 0;

    return rule.endsWith(a) ? 1 : -1;
  });
});

const solutionPart2 = reorderUpdates.reduce((acc, numbers) => {
  return acc + +numbers[Math.floor(numbers.length / 2)];
}, 0);

console.log("Part 2: ", solutionPart2);
