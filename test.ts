import chalk from "chalk";
import fs from "fs";
import globby from "globby";
import path from "path";

import ence from ".";

test("should be a function", () => {
    expect(ence).toBeInstanceOf(Function);
});

test("should fail when input is not valid JSON", () => {
    expect(() => ence("")).toThrow(Error);
    expect(() => ence("abc")).toThrow(Error);
    expect(() => ence("{0}")).toThrow(Error);
});

test("should return a string", () => {
    expect(typeof ence("{}")).toBe("string");
    expect(typeof ence("[]")).toBe("string");
    expect(typeof ence("null")).toBe("string");
    expect(typeof ence("123")).toBe("string");
    expect(typeof ence('"abc"')).toBe("string");
});

test("should match the examples", async () => {
    const paths = await globby("./examples/*.json");

    // load file data from example directory
    const cases = paths.map((sourcePath) => {
        const outPath = sourcePath.replace(/\.json$/, ".out");

        if (!fs.existsSync(outPath)) {
            throw "missing `.out` file for " + path.basename(sourcePath);
        }

        return {
            name: path.basename(sourcePath).replace(/\..+$/g, ""),
            input: fs.readFileSync(sourcePath, "utf8"),
            expected: fs.readFileSync(outPath, "utf8"),
            results: [] as number[],
        };
    });

    // run all cases and record perfomance data
    cases.forEach(({input, expected, results}) => {
        expect(ence(input)).toBe(expected.trimRight());

        const count = 32;
        for (let i = 0; i < count; i++) {
            const start = process.hrtime();
            ence(input);
            const [s, ns] = process.hrtime(start);
            const ms = s * 1000 + ns / 1000000;
            results.push(ms);
        }
    });

    // format and print test results
    const maxNameLength = cases.reduce((max, {name}) => {
        return Math.max(max, name.length);
    }, 0);
    const output = cases.map(({name, input, results}) => {
        const average = results.reduce((a, b) => a + b, 0) / results.length;
        const padding = Array(maxNameLength - name.length + 1).join(" ");
        name = chalk.bold.blue.underline(name);
        const avg = average.toFixed(5);
        const bytes = chalk.grey("" + input.length);
        return `${name}${padding} ${avg} ${bytes}`;
    });
    console.log(output.join("\n"));
});
