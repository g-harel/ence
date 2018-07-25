import chalk from "chalk";
import fs from "fs";
import path from "path";

import ence from ".";

const examplesPath = "examples";
const examplesInput = "input.json";
const examplesOutput = "output.out";
const benchCount = 16;

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

test("should use the formatting options", () => {
    const test = `[{}, {"a": "a"}, null, true, 0]`;
    expect(ence(test)).toBe(
        " :: array\n" +
            "[n] :: boolean | null | number | object\n" +
            "[n].a :: empty | string",
    );

    const f = {
        item: "{item}",
        join: "{join}",
        key: "{key}",
        type: "{types}",

        array: "{array}",
        boolean: "{boolean}",
        empty: "{empty}",
        null: "{null}",
        number: "{number}",
        object: "{object}",
        string: "{string}",
    };

    expect(ence(test, f)).toBe(
        "{types}{array}\n" +
            "{item}{types}{boolean}{join}{null}{join}{number}{join}{object}\n" +
            "{item}{key}a{types}{empty}{join}{string}",
    );
});

test("should support duplicate formatting strings", () => {
    const f = {
        object: "test",
        array: "test",
        empty: "undefined",
    };
    expect(ence(`[{"a": 0}, {}]`, f)).toBe(
        " :: test\n" + "[n] :: test\n" + "[n].a :: number | undefined",
    );
});

test("should match the examples", async () => {
    const dir = path.join(__dirname, examplesPath);

    // load file data from examples directory
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
                time: [] as number[],
            };
        })
        .sort(({input: a}, {input: b}) => {
            return a.length > b.length ? 1 : -1;
        });

    // run all test cases
    cases.forEach(({input, expected}) => {
        expect(ence(input)).toBe(expected.trimRight());
    });

    // record perfomance data
    for (let i = 0; i < benchCount; i++) {
        cases.forEach(({input, time}) => {
            const start = process.hrtime();
            ence(input);
            const [s, ns] = process.hrtime(start);
            const ms = s * 1000 + ns / 1000000;
            time.push(ms);
        });
    }

    // format and print test results
    const maxNameLength = cases.reduce((max, {name}) => {
        return Math.max(max, name.length);
    }, 0);
    const output = cases.map(({name, input, time}) => {
        // ignore extreme values
        time = time.sort((a, b) => (a < b ? -1 : 1));
        time = time.splice(benchCount / 4, benchCount / 2);

        const average = time.reduce((a, b) => a + b, 0) / time.length;

        const padding = Array(maxNameLength - name.length + 1).join(" ");
        name = chalk.bold.blue.underline(name);
        const avg = average.toFixed(5);
        const bytes = chalk.grey("" + input.length);

        return `${name}${padding} ${avg} ${bytes}`;
    });
    console.log(output.join("\n"));
});
