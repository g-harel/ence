type JSON = JSONBasic | JSONObject | JSONArray;
type JSONBasic = boolean | null | number | string;
interface JSONArray extends Array<JSON> {}
interface JSONObject extends Record<string, JSON> {}

type Type =
    | "array"
    | "boolean"
    | "empty"
    | "null"
    | "number"
    | "object"
    | "string";
type TypeMap<T> = {[P in Type]: T};

interface Format extends TypeMap<string> {
    item: string;
    join: string;
    key: string;
    type: string;
}

type AddressData<T> = Record<string, T>;

let info: AddressData<Partial<TypeMap<boolean>>> = {};
let expectedKeys: AddressData<string[]> = {};

const typeOf = (value: JSON): Type => {
    // "object" types
    if (value === null) {
        return "null";
    }
    if (Array.isArray(value)) {
        return "array";
    }

    // basic types
    const type = typeof value;
    if (type === "boolean") {
        return type;
    }
    if (type === "number") {
        return type;
    }
    if (type === "string") {
        return type;
    }

    return "object";
};

const add = (address: string, value: JSON, f: Format): void => {
    const type = typeOf(value);
    if (info[address] === undefined) {
        info[address] = {};
    }
    info[address][type] = true;

    if (type === "array") {
        const val = value as JSONArray;
        const addr = address + f.item;
        for (let i = 0, len = val.length; i < len; ++i) {
            add(addr, val[i], f);
        }
    }

    if (type === "object") {
        const val = value as JSONObject;
        empties(address, val, f);
        const keys = Object.keys(val);
        for (let i = 0, len = keys.length; i < len; ++i) {
            add(address + f.key + keys[i], val[keys[i]], f);
        }
    }
};

const empties = (address: string, value: JSONObject, f: Format): void => {
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
            info[address + f.key + key]["empty"] = true;
            expectedKeys[address].slice(i, 1);
        }
    }

    // check that object does not have any extra keys
    keys = Object.keys(value);
    for (let i = 0, len = keys.length; i < len; ++i) {
        const addr = address + f.key + keys[i];
        if (info[addr] === undefined) {
            info[addr] = {["empty"]: true};
        }
    }
};

// default formatting options
const format: Format = {
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

const ence = (json: string, options: Partial<Format> = {}): string => {
    let value: JSON = JSON.parse(json);
    const f = Object.assign({}, format, options);

    info = {};
    expectedKeys = {};

    add("", value, f);

    const addresses = Object.keys(info).sort();
    let str = "";
    for (let i = 0, len = addresses.length; i < len; ++i) {
        const joinedTypes = Object.keys(info[addresses[i]])
            .map((type) => f[type as Type])
            .sort()
            .join(f.join);
        str += addresses[i] + f.type + joinedTypes + "\n";
    }

    return str.trimRight();
};

export default ence;
