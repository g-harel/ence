#!/usr/bin/env node

import chalk from "chalk";

import ence, {Options} from ".";

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
    const options: Options = {};
    if (flags.pretty) {
        options.item = chalk.bold.grey("[") + "n" + chalk.bold.grey("]");
        options.join = chalk.bold.grey(" | ");
        options.key = chalk.bold.bold.grey(".");
        options.type = chalk.bold.grey(" :: ");

        options.array = chalk.magentaBright("array");
        options.boolean = chalk.magentaBright("boolean");
        options.empty = chalk.redBright("empty");
        options.null = chalk.magentaBright("null");
        options.number = chalk.magentaBright("number");
        options.object = chalk.magentaBright("object");
        options.string = chalk.magentaBright("string");
    }
    console.log(ence(input, options));
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
