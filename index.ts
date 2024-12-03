import { select } from "@inquirer/prompts";
import { readdirSync } from "fs";
import { $ } from "zx";

const dirs = readdirSync("./");
const dayDirs = dirs
  .filter((name) => name.startsWith("day"))
  .sort((a, b) => +a.slice(3) - +b.slice(3));

const answer = await select({
  message: "Select a day",
  choices: dayDirs.map((dir) => ({
    name: dir,
    value: dir,
  })),
});

const log = await $`bun ./${answer}/index.ts`;

console.log(log.stdout);
