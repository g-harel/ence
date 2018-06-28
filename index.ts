const addressSeparator = ".";
const arrayKey = "[n]";
const typePrefix = " :: ";
const typeSeparator = " | ";

type Map<T> = {
    [key: string]: T;
};

const joinKeys = (o: Map<boolean>) => {
    return Object.keys(o)
        .sort()
        .join(typeSeparator);
};

class TypeInfo {
    private store: Map<Map<boolean>> = {};

    public add(address: string, type: string) {
        let value = this.store[address];
        if (value === undefined) {
            value = this.store[address] = {};
        }
        value[type] = true;
    }

    public toString() {
        return Object.keys(this.store)
            .sort()
            .map((address) => {
                return address + typePrefix + joinKeys(this.store[address]);
            })
            .join("\n");
    }
}

const addToInfo = (value: any, address: string, info: TypeInfo): void => {
    // typeof null === "object"
    if (value === null) {
        info.add(address, "null");
        return;
    }

    // typeof [] === "object"
    if (Array.isArray(value)) {
        info.add(address, "array");
        const newAddr = address + arrayKey;
        value.forEach((child) => {
            addToInfo(child, newAddr, info);
        });
        return;
    }

    const type = typeof value;
    info.add(address, type);

    if (type === "object") {
        Object.keys(value).forEach((key) => {
            addToInfo(value[key], address + addressSeparator + key, info);
        });
    }
};

const ence = (json: string) => {
    let value = JSON.parse(json);

    const info = new TypeInfo();
    addToInfo(value, "", info);

    return info.toString();
};

export default ence;
