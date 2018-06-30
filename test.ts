import chalk from "chalk";
import fs from "fs";
import path from "path";

import ence from ".";

const examplesPath = "examples";
const examplesInput = "input.json";
const examplesOutput = "output.out";
const benchCount = 32;

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
    const dir = path.join(__dirname, examplesPath);

    // load file data from example directory
    const cases = fs
        .readdirSync(dir)
        .filter((name) => {
            const childPath = path.join(dir, name);
            return fs.lstatSync(childPath).isDirectory();
        })
        .map((name) => {
            const dirPath = path.join(dir, name);

            const inputPath = path.join(dirPath, examplesInput);
            const outputPath = path.join(dirPath, examplesOutput);

            if (!fs.existsSync(inputPath)) {
                throw `missing ${examplesInput} file for ${name}`;
            }
            if (!fs.existsSync(outputPath)) {
                throw `missing ${examplesOutput} file for ${name}`;
            }

            return {
                name,
                input: fs.readFileSync(inputPath, "utf8"),
                expected: fs.readFileSync(outputPath, "utf8"),
                results: [] as number[],
            };
        })
        .sort(({input: a}, {input: b}) => {
            return a.length > b.length ? 1 : -1;
        });

    // run all cases and record perfomance data
    cases.forEach(({input, expected, results}) => {
        expect(ence(input)).toBe(expected.trimRight());

        for (let i = 0; i < benchCount; i++) {
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
