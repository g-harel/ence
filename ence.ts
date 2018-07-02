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
        format.key = chalk.bold.bold.grey(".");
        format.join = chalk.bold.grey(" | ");
        format.type = chalk.bold.grey(" :: ");
        format.empty = chalk.redBright("empty");
        format.null = chalk.magentaBright("null");
        format.boolean = chalk.magentaBright("boolean");
        format.string = chalk.magentaBright("string");
        format.number = chalk.magentaBright("number");
        format.array = chalk.magentaBright("array");
        format.object = chalk.magentaBright("object");
    }
    console.log(ence(input));
    reset();
});

// nothing being piped or --help
if (process.stdin.isTTY || flags.help) {
    console.log(`
    ence [--help] [--pretty]

      example usages:
        $ curl http://example.com/users.json | ence
        $ cat data.json | ence --pretty
    `);
    process.exit(0);
}
