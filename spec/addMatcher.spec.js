let sut = require('..');

describe('matcher', () => {
    describe('.compare', () => {
        describe('determines pass/fail', () => {
            let matcher = sut.matcher('toBe5', 'to be five', (actual) => actual === 5),
                compare = matcher.toBe5({}, {}).compare;

            it('passes if check passes', () => {
                expect(compare(5)).toEqual(jasmine.objectContaining({
                    pass: true
                }));
            });

            it('does not pass if check fails', () => {
                expect(compare(6)).toEqual(jasmine.objectContaining({
                    pass: false
                }));
            });

        });

        describe('with single templatized message', () => {
            let matcher = sut.matcher('toBeDivisibleBy', 'expected {actual} to (not) be divisible by {expected}',
                    (act, exp) => act % exp === 0),
                compare = matcher.toBeDivisibleBy({}, {}).compare;

            it('gives positive message if check fails', () => {
                expect(compare(4, 3)).toEqual(jasmine.objectContaining({
                    message: 'expected 4 to be divisible by 3'
                }));
            });

            it('gives negative message if check passes', () => {
                expect(compare(4, 2)).toEqual(jasmine.objectContaining({
                    message: 'expected 4 to not be divisible by 2'
                }));
            });
        });

        describe('with dual templatized messages', () => {
            let matcher = sut.matcher('toBeEven',
                    ['expected {actual} to be even', 'expected {actual} to be odd'],
                    (act) => act % 2 === 0),
                compare = matcher.toBeEven({}, {}).compare;

            it('gives first message if check fails', () => {
                expect(compare(3)).toEqual(jasmine.objectContaining({
                    message: 'expected 3 to be even'
                }));
            });

            it('gives second message if check passes', () => {
                expect(compare(4)).toEqual(jasmine.objectContaining({
                    message: 'expected 4 to be odd'
                }));
            });
        });

        describe('formats values', () => {

            it('with jasmine.pp by default', () => {
                let matcher = sut.matcher('toEq', 'expected {actual} to be {expected}', () => false),
                    compare = matcher.toEq({}, {}).compare,
                    res = compare({a: 1}, {b: 2});

                expect(res).toEqual(jasmine.objectContaining({
                    pass: false,
                    message: 'expected Object({ a: 1 }) to be Object({ b: 2 })'
                }));
            });

            it('with custom formatter if given', () => {
                let matcher = sut.matcher('toEq','expected {actual} to be {expected}', () => false, JSON.stringify),
                    compare = matcher.toEq({}, {}).compare,
                    res = compare({a: 1}, {b: 2});

                expect(res).toEqual(jasmine.objectContaining({
                    pass: false,
                    message: 'expected {"a":1} to be {"b":2}'
                }));
            });

        });
    });

    describe('called by Jasmine', () => {
        it('uses the given check function', () => {
            class Methods {
                static isEven (actual) {
                    return actual % 2 === 0;
                }
                static fmt (val) {
                    return JSON.stringify(val);
                }
            }
            let matcher = sut.matcher('toBeEven', 'to (not) be even', (...args) => Methods.isEven(...args));

            spyOn(Methods, 'isEven').and.callThrough();
            spyOn(matcher, 'toBeEven').and.callThrough();
            jasmine.addMatchers(matcher);

            expect(2).toBeEven();
            expect(Methods.isEven).toHaveBeenCalledWith(
                2, undefined, jasmine.any(Object), jasmine.any(Array)
            );
        });

        it('makes utils available to check function', () => {
            let matcher = sut.matcher('toEq', 'to eq', (actual, expected, util) => util.equals(actual, expected));
            jasmine.addMatchers(matcher);
            expect({a:1}).toEq({a:1});
            expect({a:2}).not.toEq({a:1});
        });

        it('makes custom equality testers available to check function', () => {
            // This is a pretty weak test; I don't even know what custom equality tester means
            let matcher = sut.matcher('toEq', 'to eq', (actual, expected, util, cet) => cet != null);
            jasmine.addMatchers(matcher);
            expect(1).toEq(1);
        });
    });

    describe('addMatcher', () => {
        it('creates a matcher and passes it to jasmine.addMatchers', () => {
            spyOn(jasmine, 'addMatchers');

            sut.addMatcher('xxx', 'yyy', () => true);
            expect(jasmine.addMatchers).toHaveBeenCalledWith(jasmine.objectContaining({
                xxx: jasmine.any(Function)
            }));
        });
    });
});
