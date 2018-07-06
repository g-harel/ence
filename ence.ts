#!/usr/bin/env node

import chalk from "chalk";

import ence, {format, reset} from ".";

const flags = {
    help: process.argv.indexOf("--help") > -1,
    pretty: process.argv.indexOf("--pretty") > -1,
};

let input = "";

process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
    input += chunk;
});

process.stdin.on("end", () => {
    if (flags.pretty) {
        format.item = chalk.bold.grey("[") + "n" + chalk.bold.grey("]");
        format.join = chalk.bold.grey(" | ");
        format.key = chalk.bold.bold.grey(".");
        format.type = chalk.bold.grey(" :: ");

        format.array = chalk.magentaBright("array");
        format.boolean = chalk.magentaBright("boolean");
        format.empty = chalk.redBright("empty");
        format.null = chalk.magentaBright("null");
        format.number = chalk.magentaBright("number");
        format.object = chalk.magentaBright("object");
        format.string = chalk.magentaBright("string");
    }
    console.log(ence(input));
    reset();
});

// nothing being piped or --help
if (process.stdin.isTTY || flags.help) {
    console.log(`
    ence [--help] [--pretty]

      Examples
        ${chalk.grey("Explore api response object")}
        $ curl example.com/data.json | ence

        ${chalk.grey("Analyze local file")}
        $ cat ./data.json | ence --pretty
    `);
    process.exit(0);
}
