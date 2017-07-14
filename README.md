# ence

> Tool to map JSON objects' type information and collapse the arrays

Recursively travels an object to find the type of each value. Arrays are collapsed into a single item that has the most possible type information about each child. When there is a conflict between types, the value is set to the string `'conflict'`.

## Install

````
$ npm install --save ence
````

## Usage

````javascript
const ence = require('ence');

ence(0);
// 'number'

ence({a: {b: true}});
// {a: {b: 'boolean'}}

ence([0, 1, 2, 3]);
// ['number']

ence({
    a: [{
        b: 'a',
        c: [0, 1, 2],
    }, {
        b: 'b',
        c: [3, 7],
        d: true,
    }, {
        b: 'c',
        c: [6, 8, 2],
    }],
    b: true,
});
// {a: [{b: 'string', c: ['number'], d: 'boolean'}], b: 'boolean'}
````
