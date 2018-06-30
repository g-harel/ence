#!/usr/bin/env node

import ence from ".";

let input = "";

process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
    input += chunk;
});

process.stdin.on("end", () => {
    console.log(ence(input));
});

// nothing being piped
if (process.stdin.isTTY) {
    process.exit(0);
}
