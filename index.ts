type JSON = JSONBasic | JSONObject | JSONArray;
type JSONBasic = null | boolean | number | string;
interface JSONArray extends Array<JSON> {}
interface JSONObject {
    [k: string]: JSON;
}

// exported to allow customization
export const format = {
    item: "[n]",
    join: " | ",
    key: ".",
    type: " :: ",

    array: "array",
    boolean: "boolean",
    empty: "empty",
    null: "null",
    number: "number",
    object: "object",
    string: "string",
};

// reset the formatting options
const backup = Object.assign({}, format);
export const reset = () => {
    Object.assign(format, backup);
};

let info: {
    [address: string]: {[type: string]: boolean};
} = {};

let expectedKeys: {
    [address: string]: string[];
} = {};

const typeOf = (value: JSON): string => {
    // "object" types
    if (value === null) {
        return format.null;
    }
    if (Array.isArray(value)) {
        return format.array;
    }

    // basic types
    const type = typeof value;
    if (type === "boolean") {
        return format.boolean;
    }
    if (type === "number") {
        return format.number;
    }
    if (type === "string") {
        return format.string;
    }

    return format.object;
};

const add = (address: string, value: JSON): void => {
    const type = typeOf(value);
    if (info[address] === undefined) {
        info[address] = {};
    }
    info[address][type] = true;

    if (type === format.array) {
        const val = value as JSONArray;
        const addr = address + format.item;
        for (let i = 0, len = val.length; i < len; ++i) {
            add(addr, val[i]);
        }
    }

    if (type === format.object) {
        const val = value as JSONObject;
        empties(address, val);
        const keys = Object.keys(val);
        for (let i = 0, len = keys.length; i < len; ++i) {
            add(address + format.key + keys[i], val[keys[i]]);
        }
    }
};

const empties = (address: string, value: JSONObject): void => {
    if (expectedKeys[address] === undefined) {
        expectedKeys[address] = Object.keys(value);
        return;
    }

    let keys: string[];

    // check that all expected keys are on object
    keys = expectedKeys[address];
    for (let i = 0, len = keys.length; i < len; ++i) {
        const key = keys[i];
        if (value[key] === undefined) {
            info[address + format.key + key][format.empty] = true;
            expectedKeys[address].slice(i, 1);
        }
    }

    // check that object does not have any extra keys
    keys = Object.keys(value);
    for (let i = 0, len = keys.length; i < len; ++i) {
        const addr = address + format.key + keys[i];
        if (info[addr] === undefined) {
            info[addr] = {[format.empty]: true};
        }
    }
};

const ence = (json: string): string => {
    let value: JSON = JSON.parse(json);

    info = {};
    expectedKeys = {};

    add("", value);

    const addresses = Object.keys(info).sort();
    let str = "";
    for (let i = 0, len = addresses.length; i < len; ++i) {
        const joinedTypes = Object.keys(info[addresses[i]])
            .sort()
            .join(format.join);
        str += addresses[i] + format.type + joinedTypes + "\n";
    }

    return str.trimRight();
};

export default ence;
