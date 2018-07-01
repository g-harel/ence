const addressSeparator = ".";
const arrayKey = "[n]";
const typePrefix = " :: ";
const typeSeparator = " | ";

enum types {
    E = "empty",
    N = "null",
    B = "boolean",
    S = "string",
    M = "number",
    A = "array",
    O = "object",
}

type JSON = JSONBasic | JSONObject | JSONArray;
type JSONBasic = null | boolean | number | string;
interface JSONArray extends Array<JSON> {}
interface JSONObject {
    [k: string]: JSON;
}

let info: {
    [address: string]: {[type in types]?: boolean};
} = {};

let expectedKeys: {
    [address: string]: string[];
} = {};

const typeOf = (value: JSON): types => {
    // "object" types
    if (value === null) {
        return types.N;
    }
    if (Array.isArray(value)) {
        return types.A;
    }

    // basic types
    const type = typeof value;
    if (type === "boolean") {
        return types.B;
    }
    if (type === "number") {
        return types.M;
    }
    if (type === "string") {
        return types.S;
    }

    return types.O;
};

const addType = (address: string, value: JSON, shouldExist?: boolean) => {
    const type = typeOf(value);
    if (info[address] === undefined) {
        if (shouldExist) {
            info[address] = {[types.E]: true};
        } else {
            info[address] = {};
        }
    }
    info[address][type] = true;

    if (type === types.A) {
        const addr = address + arrayKey;
        const val = value as JSONArray;
        val.forEach((child: any) => {
            addType(addr, child);
        });
    }
    if (type === types.O) {
        const val = value as JSONObject;
        const shouldExist = checkKeys(val, address);
        Object.keys(val).forEach((key) => {
            const addr = address + addressSeparator + key;
            addType(addr, val[key], shouldExist);
        });
    }
};

const checkKeys = (value: JSONObject, address: string) => {
    let keys = expectedKeys[address];
    const first = keys === undefined;

    if (first) {
        keys = expectedKeys[address] = Object.keys(value);
    } else {
        keys.forEach((key) => {
            if (value[key] === undefined) {
                info[address + addressSeparator + key][types.E] = true;
            }
        });
    }

    return !first;
};

const ence = (json: string) => {
    let value: JSON = JSON.parse(json);

    info = {};
    expectedKeys = {};

    addType("", value);

    return Object.keys(info)
        .sort()
        .map((address) => {
            const joinedTypes = Object.keys(info[address])
                .sort()
                .join(typeSeparator);
            return address + typePrefix + joinedTypes;
        })
        .join("\n");
};

export default ence;
