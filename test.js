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
        expect(ence({
            a: 0,
            b: {
                c: true,
                d: 'a',
            },
        })).toMatchObject({
            a: 'number',
            b: {
                c: 'boolean',
                d: 'string',
            },
        });
    });

    it('collapses arrays into a single item', () => {
        expect(ence({
            a: [0, 1, 2],
        })).toMatchObject({
            a: ['number'],
        });
    });

    it('collapses arrays recursively', () => {
        expect(ence({
            a: [
                {b: [0, 1, 2]},
                {b: [3, 7]},
                {b: [6, 8, 2]},
            ],
        })).toMatchObject({
            a: [
                {b: ['number']},
            ],
        });
    });

    it('uses null when value type is conflicting', () => {
        expect(ence([
            {
                a: {
                    b: 0,
                    c: ['c'],
                    d: 2,
                },
            }, {
                a: {
                    b: true,
                    c: ['a', 'b', 'c'],
                    d: 1,
                },
            }, {
                a: {
                    b: 0,
                    c: ['a', 'c'],
                },
            },
        ])).toMatchObject([{
            a: {
                b: null,
                c: ['string'],
                d: null,
            },
        }]);
    });
});
