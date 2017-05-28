const ence = require('./index');

let o = {
    test: true,
    other: {
        potato: 5,
        test: 'test',
        arr: [
            {
                test: 'hi',
                items: {
                    type: 'small',
                    count: 2,
                },
            },
            {
                test: 9,
                items: {
                    type: 'small',
                    count: 2,
                },
            },
            {
                m: 0,
                items: {
                    type: 'small',
                    count: 'asd',
                },
            },
        ],
    },
};

console.log(JSON.stringify(ence(o), null, 2));

o = [
    {a: {b: {c: {d: {e: {f: 0}}}, test: 'a'}}},
    {a: {b: {c: {d: {e: {f: 'test'}}}, test: 'a'}}},
    {a: {b: {c: {d: {e: {f: 'test'}}}, test: 'a'}}},
];

console.log(JSON.stringify(ence(o), null, 2));

o = [0, 1, 'asd'];

console.log(JSON.stringify(ence(o), null, 2));
