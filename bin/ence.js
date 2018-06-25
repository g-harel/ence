#! /usr/bin/env node

const readline = require("readline");

const ence = require("../");

let input = "";

const rl = readline.createInterface({
    input: process.stdin,
    terminal: true,
});

const timeout = setTimeout(() => {
    console.log("terminated, no input after 3s");
    process.exit(0);
}, 3000);

rl.on("line", (line) => {
    clearTimeout(timeout);
    input += line + "\n";
});

rl.on("close", () => {
    console.log(JSON.stringify(ence(JSON.parse(input)), null, 2));
});
