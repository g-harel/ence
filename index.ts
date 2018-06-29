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

type Map<T> = {
    [key: string]: T;
};

const joinKeys = (o: Map<boolean>) => {
    return Object.keys(o)
        .sort()
        .join(typeSeparator);
};

const isBasic = (value: any): string => {
    if (value === null) {
        return types.N;
    }
    const type = typeof value;
    if (type === "boolean") {
        return types.B;
    } else if (type === "number") {
        return types.M;
    } else if (type === "string") {
        return types.S;
    }
    return "";
};

const joinInfo = (info: Map<Map<boolean>>) => {
    return Object.keys(info)
        .sort()
        .map((address) => {
            return address + typePrefix + joinKeys(info[address]);
        })
        .join("\n");
};

const createEntry = (info: Map<Map<boolean>>, address: string) => {
    if (info[address] === undefined) {
        info[address] = {};
    }
};

const addToInfo = (info: Map<Map<boolean>>, address: string, type: string) => {
    if (info[address] === undefined) {
        info[address] = {};
    }
    info[address][type] = true;
};

const addToInfoExpect = (
    info: Map<Map<boolean>>,
    address: string,
    type: string,
) => {
    if (info[address] === undefined) {
        info[address] = {[types.E]: true};
    }
    info[address][type] = true;
};

const addArray = (
    value: any,
    address: string,
    info: Map<Map<boolean>>,
    firsts: Map<string[]>,
) => {
    if (value.length === 0) {
        return;
    }

    const newAddr = address + arrayKey;
    value.forEach((child: any) => {
        const type = isBasic(child);
        if (type !== "") {
            addToInfo(info, newAddr, type);
            return;
        }
        if (Array.isArray(child)) {
            addToInfo(info, newAddr, types.A);
            addArray(child, newAddr, info, firsts);
            return;
        }
        addToInfo(info, newAddr, types.O);
        addObject(child, newAddr, info, firsts);
    });
};

const addObject = (
    value: any,
    address: string,
    info: Map<Map<boolean>>,
    firsts: Map<string[]>,
): void => {
    let keys = firsts[address];
    if (keys === undefined) {
        keys = Object.keys(value);
        firsts[address] = keys;
        keys.forEach((key) => {
            createEntry(info, address + addressSeparator + key);
        });
    } else {
        keys.forEach((key) => {
            if (value[key] === undefined) {
                addToInfo(info, address + addressSeparator + key, types.E);
            }
        });
    }

    Object.keys(value).forEach((key) => {
        const val = value[key];
        const type = isBasic(val);
        const addr = address + addressSeparator + key;
        if (type !== "") {
            addToInfoExpect(info, addr, type);
            return;
        }
        if (Array.isArray(val)) {
            addToInfoExpect(info, addr, types.A);
            addArray(val, addr, info, firsts);
            return;
        }
        addToInfoExpect(info, addr, types.O);
        addObject(val, addr, info, firsts);
    });
};

const ence = (json: string) => {
    let value = JSON.parse(json);

    let type = isBasic(value);
    if (type !== "") {
        return typePrefix + type;
    }

    const info: Map<Map<boolean>> = {};

    if (Array.isArray(value)) {
        addToInfo(info, "", types.A);
        addArray(value, "", info, {});
    } else {
        addToInfo(info, "", types.O);
        addObject(value, "", info, {});
    }

    return joinInfo(info);
};

export default ence;
