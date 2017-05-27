'use strict';

const ence = (obj) => {
    try {
        obj = JSON.parse(JSON.stringify(obj));
    } catch (e) {
        throw new Error('Invalid input object format');
    }

    const merge = (objects) => {
        let temp = {};
        objects.forEach((obj) => {
            Object.keys(obj).forEach((key) => {
                if (key in temp) {
                    if (JSON.stringify(temp[key]) !== JSON.stringify(obj[key])) {
                        temp[key] = null;
                        return;
                    }
                }
                temp[key] = obj[key];
            });
        });
        return [temp];
    };

    const scan = (obj) => {
        if (Array.isArray(obj)) {
            return merge(obj.map(scan));
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
