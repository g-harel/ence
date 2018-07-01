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

    MISS: "empty",
    NIL: "null",
    BOOL: "boolean",
    STR: "string",
    NUM: "number",
    ARR: "array",
    OBJ: "object",
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
        return format.NIL;
    }
    if (Array.isArray(value)) {
        return format.ARR;
    }

    // basic types
    const type = typeof value;
    if (type === "boolean") {
        return format.BOOL;
    }
    if (type === "number") {
        return format.NUM;
    }
    if (type === "string") {
        return format.STR;
    }

    return format.OBJ;
};

const add = (address: string, value: JSON): void => {
    const type = typeOf(value);
    if (info[address] === undefined) {
        info[address] = {};
    }
    info[address][type] = true;

    if (type === format.ARR) {
        const addr = address + format.item;
        const val = value as JSONArray;
        val.forEach((child: any) => {
            add(addr, child);
        });
    }

    if (type === format.OBJ) {
        const val = value as JSONObject;
        keys(address, val);
        Object.keys(val).forEach((key) => {
            add(address + format.key + key, val[key]);
        });
    }
};

const keys = (address: string, value: JSONObject): void => {
    if (expectedKeys[address] === undefined) {
        expectedKeys[address] = Object.keys(value);
        return;
    }

    // check that all expected keys are on object
    expectedKeys[address].forEach((key) => {
        if (value[key] === undefined) {
            info[address + format.key + key][format.MISS] = true;
        }
    });

    // check that object does not have any extra keys
    Object.keys(value).forEach((key) => {
        const addr = address + format.key + key;
        if (info[addr] === undefined) {
            info[addr] = {[format.MISS]: true};
        }
    });
};

const ence = (json: string): string => {
    let value: JSON = JSON.parse(json);

    info = {};
    expectedKeys = {};

    add("", value);

    return Object.keys(info)
        .sort()
        .map((address) => {
            const joinedTypes = Object.keys(info[address])
                .sort()
                .join(format.join);
            return address + format.type + joinedTypes;
        })
        .join("\n");
};

export default ence;
