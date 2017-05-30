'use strict';

const diip = require('diip');

const conflict = 'conflict';

const ence = (obj) => {
    try {
        obj = JSON.parse(JSON.stringify(obj));
    } catch (e) {
        throw new Error('Invalid input object format');
    }

    const compare = (a, b) => {
        let diff = diip(a, b);
        if (diff !== null) {
            if (diff[0].length === 0) {
                return conflict;
            }
            for (let i = 0; i < diff.length; ++i) {
                let address = diff[i];
                let _a = a;
                let _b = b;
                for (let j = 0; j + 1 < address.length; ++j) {
                    _a = _a[address[j]];
                    _b = _b[address[j]];
                }
                let lastKey = address[address.length - 1];
                if (_a[lastKey] == null) {
                    _a[lastKey] = _b[lastKey];
                    continue;
                }
                if (_b[lastKey] == null) {
                    continue;
                }
                if (_a[lastKey] != _b[lastKey]) {
                    _a[lastKey] = conflict;
                }
            };
        }
        return a;
    };

    const scan = (obj) => {
        if (Array.isArray(obj)) {
            let temp = obj
                .filter((item) => item != null)
                .map(scan);
            let collapsed = temp.slice(1).reduce(compare, temp[0]);
            if (collapsed) {
                return [collapsed];
            }
            return [];
        }
        if (obj === Object(obj)) {
            let temp = {};
            Object.keys(obj).forEach((key) => {
                temp[key] = scan(obj[key]);
            });
            return temp;
        }
        if (obj === null) {
            return null;
        };
        return typeof obj;
    };

    return scan(obj);
};

module.exports = ence;
