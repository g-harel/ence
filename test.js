const ence = require('./index');

describe('ence', () => {
    it('returns a function', () => {
        expect(ence).toBeInstanceOf(Function);
    });

    it('fails when input is not valid JSON', () => {
        expect(() => ence(() => {})).toThrow(Error);
    });

    it('returns the type of the argument', () => {
        expect(ence(0)).toBe('number');
        expect(ence('a')).toBe('string');
        expect(ence(true)).toBe('boolean');
        expect(ence(0)).toBe('number');
    });

    it('travels objects to find nested value types', () => {
        expect(ence({a: 0, b: {c: true, d: 'a', e: null}}))
            .toMatchObject({a: 'number', b: {c: 'boolean', d: 'string', e: null}});
    });

    it('collapses arrays into a single item', () => {
        expect(ence(['a', 'b', 'c'])).toMatchObject(['string']);
        expect(ence({a: [0, 1, 2]})).toMatchObject({a: ['number']});
    });

    it('ignores empty arrays', () => {
        expect(ence([{a: []}, {a: []}])).toMatchObject([{a: []}]);
        expect(ence([[0, 1, 2], [], []])).toMatchObject([['number']]);
        expect(ence([[], [], [0, 1, 2]])).toMatchObject([['number']]);
        expect(ence([{a: []}, {a: [{b: 1}]}])).toMatchObject([{a: [{b: 'number'}]}]);
        expect(ence([{a: [{b: 1}]}, {a: []}])).toMatchObject([{a: [{b: 'number'}]}]);
    });

    it('ignores empty items (null, undefined)', () => {
        expect(ence([null, undefined])).toMatchObject([]);
        expect(ence([null, {a: 0}])).toMatchObject([{a: 'number'}]);
        expect(ence([{a: 0}, null])).toMatchObject([{a: 'number'}]);
        expect(ence([undefined, {a: 0}])).toMatchObject([{a: 'number'}]);
        expect(ence([{a: 0}, undefined])).toMatchObject([{a: 'number'}]);
        expect(ence([{a: 1}, {a: null}])).toMatchObject([{a: 'number'}]);
        expect(ence([{a: null}, {a: 1}])).toMatchObject([{a: 'number'}]);
        expect(ence([{a: 1}, {b: 0}])).toMatchObject([{a: 'number', b: 'number'}]);
    });

    it('collapses arrays recursively', () => {
        expect(ence({a: [{b: [0, 1, 2]}, {b: [3, 7]}, {b: [6, 8, 2]}]}))
            .toMatchObject({a: [{b: ['number']}]});
    });

    it('uses null when value type is conflicting', () => {
        expect(ence([0, 'a'])).toMatchObject(['conflict']);
        expect(ence([{a: 0}, {a: 'a'}])).toMatchObject([{a: 'conflict'}]);
        expect(ence([{a: {b: 0, c: ['c'], d: 2}},
                     {a: {b: true, c: ['a', 'b', 'c'], d: 1}},
                     {a: {b: 0, c: ['a', 'c']}}]))
            .toMatchObject([{a: {b: 'conflict', c: ['string'], d: 'number'}}]);
    });
});
