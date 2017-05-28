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
                let temp = a;
                while (address.length > 1) {
                    temp = temp[address.shift()];
                }
                temp[address[0]] = null;
            });
        }
        return a;
    };

    const scan = (obj) => {
        if (Array.isArray(obj)) {
            let temp = obj.map(scan);
            return [temp.slice(1).reduce(compare, temp[0])];
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
