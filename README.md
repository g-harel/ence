# ence [![NPM Version](https://img.shields.io/npm/v/ence.svg)](https://www.npmjs.com/package/ence) [![Build Status](https://travis-ci.org/g-harel/ence.svg?branch=master)](https://travis-ci.org/g-harel/ence) [![NPM Type Definitions](https://img.shields.io/npm/types/ence.svg)](https://github.com/g-harel/ence)

> automation friendly json schemas

* Deterministic result ideal for diffs and snapshot testing
* Full address output convenient for grep analysis
* Missing/inconsistent object key detection
* Compatible with any tool outputting to stdin

#### Syntax

```text
.items[n].name.en :: null | string
└────────┬──────┘    └─────┬─────┘
      address           type(s)
```

#### Example

```json
[{"id": 123456, "abc": 31415}, {"id": "654321"}, null]
```

```text
 :: array
[n] :: null | object
[n].abc :: empty | number
[n].id :: number | string
```

## Install

#### CLI

```shell
$ npm install --global ence
```

#### Package

```shell
$ npm install ence
```

## Usage

#### CLI

```
ence [--help] [--pretty]
```

```shell
# Explore api response data
$ curl example.com/data.json | ence

# Analyze local file
$ cat ./data.json | ence --pretty
```


```shell
# Filter top level keys
$ ... | ence | grep -P "^\.\w+ ::"

# Filter potentially empty addresses
$ ... | ence | grep -P "::.*empty"

# Filter mixed-type arrays
$ ... | ence | grep -P "\[n\] ::.*\|"
```

#### API

```typescript
// compute schema
ence(json: string, options?: Options): string

const options: Options = {
   // customize syntax strings
   item: "[n]",
   join: " | ",
   key: ".",
   type: " :: ",

   // customize type strings
   array: "array",
   boolean: "boolean",
   empty: "empty",
   null: "null",
   number: "number",
   object: "object",
   string: "string",
}

```

```javascript
const ence = require("ence");

ence("[]");                  // => " :: array"
ence("[]", {array: "list"}); // => " :: list"
```

## Performance

```
Quad core Intel Core i7-8550U @ 1.80GHz
```

```text
+---------------------------+-----------+------------+
| Example                   | Time (ms) | Input (kB) |
+===========================+===========+============+
| data-bank                 |     42.26 |    1624.44 |
| data-reddit               |      6.74 |     207.46 |
| data-government           |      5.44 |     168.95 |
| array-array-object-empty  |      0.02 |       0.15 |
| array-object-empty-simple |      0.02 |       0.13 |
| array-object              |      0.01 |       0.10 |
| array-object-empty-mixed  |      0.02 |       0.08 |
| object-array-mixed        |      0.01 |       0.05 |
| object-simple             |      0.01 |       0.05 |
| array-simple              |      0.01 |       0.03 |
| array-mixed               |      0.01 |       0.01 |
| string                    |      0.00 |       0.01 |
| boolean                   |      0.00 |       0.01 |
| null                      |      0.00 |       0.01 |
| number                    |      0.00 |       0.00 |
| object                    |      0.00 |       0.00 |
| array                     |      0.01 |       0.00 |
+---------------------------+-----------+------------+
```

The test cases can be found [in this directory](./examples).

## License

[MIT](./LICENSE)
