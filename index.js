'use strict';

const diip = require('diip');

const ence = (obj) => {
    try {
        obj = JSON.parse(JSON.stringify(obj));
    } catch (e) {
        throw new Error('Invalid input object format');
    }

    const compare = (a, b) => {
        let diff = diip(a, b);
        if (diff !== null) {
            diff.forEach((address) => {
                if (address.length === 0) {
                    a = null;
                    return;
                }
                let _a = a;
                let _b = b;
                for (let i = 0; i + 1 < address.length; ++i) {
                    _a = _a[address[i]];
                    _b = _b[address[i]];
                }
                let lastKey = address[address.length - 1];
                if (Array.isArray(_a)) {
                    if (_a[lastKey] == null) {
                        _a[lastKey] = _b[lastKey];
                    }
                    return;
                }
                _a[lastKey] = null;
            });
        }
        return a;
    };

    const scan = (obj) => {
        if (Array.isArray(obj)) {
            let temp = obj
                .filter((item) => item != null)
                .map(scan);
            return [temp.slice(1).reduce(compare, temp[0]) || null];
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
