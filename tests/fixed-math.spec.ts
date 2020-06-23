import { Fixed, FixedMath } from '../src/fixed';
import { FixedPrecision } from '../src/fixed-precision';
import each from 'jest-each';

const precisions = [...Array(Fixed.MAX_PRECISION + 1).keys()];

function forAllPrecisions(action: (p: FixedPrecision) => void): void
{
    for (const precision of precisions)
        action(precision as FixedPrecision);
}

each([
    [Fixed.FromNormalized(0, 0), Fixed.FromNormalized(0, 0), false],
    [Fixed.FromNormalized(1, 0), Fixed.FromNormalized(0, 0), false],
    [Fixed.FromNormalized(-1, 0), Fixed.FromNormalized(0, 0), true],
    [Fixed.FromNormalized(100, 0), Fixed.FromNormalized(99, 0), false],
    [Fixed.FromNormalized(-100, 0), Fixed.FromNormalized(-99, 0), true],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123, 0), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123, 0), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(-123, 0), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(123, 0), true],
    [Fixed.FromNormalized(0, 0), Fixed.FromNormalized(0, 1), false],
    [Fixed.FromNormalized(1, 0), Fixed.FromNormalized(9, 1), false],
    [Fixed.FromNormalized(-1, 0), Fixed.FromNormalized(-9, 1), true],
    [Fixed.FromNormalized(100, 0), Fixed.FromNormalized(999, 1), false],
    [Fixed.FromNormalized(-100, 0), Fixed.FromNormalized(-999, 1), true],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(1230, 1), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-1230, 1), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123, 1), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123, 1), true],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(-1230, 1), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(1230, 1), true],
    [Fixed.FromNormalized(0, 0), Fixed.FromNormalized(0, 3), false],
    [Fixed.FromNormalized(1, 0), Fixed.FromNormalized(999, 3), false],
    [Fixed.FromNormalized(-1, 0), Fixed.FromNormalized(-999, 3), true],
    [Fixed.FromNormalized(100, 0), Fixed.FromNormalized(99999, 3), false],
    [Fixed.FromNormalized(-100, 0), Fixed.FromNormalized(-99999, 3), true],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123000, 3), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123000, 3), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123, 3), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123, 3), true],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(-123000, 3), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(123000, 3), true],
    [Fixed.FromNormalized(0, 0), Fixed.FromNormalized(0, 7), false],
    [Fixed.FromNormalized(1, 0), Fixed.FromNormalized(9999999, 7), false],
    [Fixed.FromNormalized(-1, 0), Fixed.FromNormalized(-9999999, 7), true],
    [Fixed.FromNormalized(100, 0), Fixed.FromNormalized(999999999, 7), false],
    [Fixed.FromNormalized(-100, 0), Fixed.FromNormalized(-999999999, 7), true],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(1230000000, 7), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-1230000000, 7), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123, 7), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123, 7), true],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(-1230000000, 7), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(1230000000, 7), true],
    [Fixed.FromNormalized(0, 0), Fixed.FromNormalized(0, 15), false],
    [Fixed.FromNormalized(1, 0), Fixed.FromNormalized(999999999999999, 15), false],
    [Fixed.FromNormalized(-1, 0), Fixed.FromNormalized(-999999999999999, 15), true],
    [Fixed.FromNormalized(3, 0), Fixed.FromNormalized(2999999999999999, 15), false],
    [Fixed.FromNormalized(-3, 0), Fixed.FromNormalized(-2999999999999999, 15), true],
    [Fixed.FromNormalized(5, 0), Fixed.FromNormalized(5000000000000000, 15), false],
    [Fixed.FromNormalized(-5, 0), Fixed.FromNormalized(-5000000000000000, 15), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123, 15), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123, 15), true],
    [Fixed.FromNormalized(5000000000000000, 0), Fixed.FromNormalized(-5000000000000000, 15), false],
    [Fixed.FromNormalized(-5000000000000000, 0), Fixed.FromNormalized(5000000000000000, 15), true],
    [Fixed.FromNormalized(0, 2), Fixed.FromNormalized(0, 2), false],
    [Fixed.FromNormalized(1, 2), Fixed.FromNormalized(0, 2), false],
    [Fixed.FromNormalized(-1, 2), Fixed.FromNormalized(0, 2), true],
    [Fixed.FromNormalized(100, 2), Fixed.FromNormalized(99, 2), false],
    [Fixed.FromNormalized(-100, 2), Fixed.FromNormalized(-99, 2), true],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(123, 2), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-123, 2), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(-123, 2), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(123, 2), true],
    [Fixed.FromNormalized(0, 2), Fixed.FromNormalized(0, 1), false],
    [Fixed.FromNormalized(9, 2), Fixed.FromNormalized(1, 1), true],
    [Fixed.FromNormalized(-9, 2), Fixed.FromNormalized(-1, 1), false],
    [Fixed.FromNormalized(100, 2), Fixed.FromNormalized(9, 1), false],
    [Fixed.FromNormalized(-100, 2), Fixed.FromNormalized(-9, 1), true],
    [Fixed.FromNormalized(1230, 2), Fixed.FromNormalized(123, 1), false],
    [Fixed.FromNormalized(-1230, 2), Fixed.FromNormalized(-123, 1), false],
    [Fixed.FromNormalized(1230, 2), Fixed.FromNormalized(-123, 1), false],
    [Fixed.FromNormalized(-1230, 2), Fixed.FromNormalized(123, 1), true],
    [Fixed.FromNormalized(1231, 2), Fixed.FromNormalized(123, 1), false],
    [Fixed.FromNormalized(-1231, 2), Fixed.FromNormalized(-123, 1), true],
    [Fixed.FromNormalized(0, 2), Fixed.FromNormalized(0, 3), false],
    [Fixed.FromNormalized(1, 2), Fixed.FromNormalized(9, 3), false],
    [Fixed.FromNormalized(-1, 2), Fixed.FromNormalized(-9, 3), true],
    [Fixed.FromNormalized(100, 2), Fixed.FromNormalized(999, 3), false],
    [Fixed.FromNormalized(-100, 2), Fixed.FromNormalized(-999, 3), true],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(1230, 3), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-1230, 3), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(123, 3), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-123, 3), true],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(-1230, 3), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(1230, 3), true],
    [Fixed.FromNormalized(0, 2), Fixed.FromNormalized(0, 7), false],
    [Fixed.FromNormalized(1, 2), Fixed.FromNormalized(99999, 7), false],
    [Fixed.FromNormalized(-1, 2), Fixed.FromNormalized(-99999, 7), true],
    [Fixed.FromNormalized(100, 2), Fixed.FromNormalized(9999999, 7), false],
    [Fixed.FromNormalized(-100, 2), Fixed.FromNormalized(-9999999, 7), true],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(12300000, 7), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-12300000, 7), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(123, 7), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-123, 7), true],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(-12300000, 7), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(12300000, 7), true],
    [Fixed.FromNormalized(0, 2), Fixed.FromNormalized(0, 15), false],
    [Fixed.FromNormalized(1, 2), Fixed.FromNormalized(9999999999999, 15), false],
    [Fixed.FromNormalized(-1, 2), Fixed.FromNormalized(-9999999999999, 15), true],
    [Fixed.FromNormalized(3, 2), Fixed.FromNormalized(29999999999999, 15), false],
    [Fixed.FromNormalized(-3, 2), Fixed.FromNormalized(-29999999999999, 15), true],
    [Fixed.FromNormalized(5, 2), Fixed.FromNormalized(50000000000000, 15), false],
    [Fixed.FromNormalized(-5, 2), Fixed.FromNormalized(-50000000000000, 15), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(123, 15), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-123, 15), true],
    [Fixed.FromNormalized(5000000000000000, 2), Fixed.FromNormalized(-5000000000000000, 15), false],
    [Fixed.FromNormalized(-5000000000000000, 2), Fixed.FromNormalized(5000000000000000, 15), true],
    [Fixed.FromNormalized(0, 8), Fixed.FromNormalized(0, 8), false],
    [Fixed.FromNormalized(1, 8), Fixed.FromNormalized(0, 8), false],
    [Fixed.FromNormalized(-1, 8), Fixed.FromNormalized(0, 8), true],
    [Fixed.FromNormalized(100, 8), Fixed.FromNormalized(99, 8), false],
    [Fixed.FromNormalized(-100, 8), Fixed.FromNormalized(-99, 8), true],
    [Fixed.FromNormalized(123, 8), Fixed.FromNormalized(123, 8), false],
    [Fixed.FromNormalized(-123, 8), Fixed.FromNormalized(-123, 8), false],
    [Fixed.FromNormalized(123, 8), Fixed.FromNormalized(-123, 8), false],
    [Fixed.FromNormalized(-123, 8), Fixed.FromNormalized(123, 8), true],
    [Fixed.FromNormalized(0, 8), Fixed.FromNormalized(0, 1), false],
    [Fixed.FromNormalized(9, 8), Fixed.FromNormalized(1, 1), true],
    [Fixed.FromNormalized(-9, 8), Fixed.FromNormalized(-1, 1), false],
    [Fixed.FromNormalized(100000000, 8), Fixed.FromNormalized(9, 1), false],
    [Fixed.FromNormalized(-100000000, 8), Fixed.FromNormalized(-9, 1), true],
    [Fixed.FromNormalized(1230000000, 8), Fixed.FromNormalized(123, 1), false],
    [Fixed.FromNormalized(-1230000000, 8), Fixed.FromNormalized(-123, 1), false],
    [Fixed.FromNormalized(1230000000, 8), Fixed.FromNormalized(-123, 1), false],
    [Fixed.FromNormalized(-1230000000, 8), Fixed.FromNormalized(123, 1), true],
    [Fixed.FromNormalized(1230000001, 8), Fixed.FromNormalized(123, 1), false],
    [Fixed.FromNormalized(-1230000001, 8), Fixed.FromNormalized(-123, 1), true],
    [Fixed.FromNormalized(0, 8), Fixed.FromNormalized(0, 3), false],
    [Fixed.FromNormalized(9, 8), Fixed.FromNormalized(1, 3), true],
    [Fixed.FromNormalized(-9, 8), Fixed.FromNormalized(-1, 3), false],
    [Fixed.FromNormalized(1000000, 8), Fixed.FromNormalized(9, 3), false],
    [Fixed.FromNormalized(-1000000, 8), Fixed.FromNormalized(-9, 3), true],
    [Fixed.FromNormalized(12300000, 8), Fixed.FromNormalized(123, 3), false],
    [Fixed.FromNormalized(-12300000, 8), Fixed.FromNormalized(-123, 3), false],
    [Fixed.FromNormalized(123, 8), Fixed.FromNormalized(123, 3), true],
    [Fixed.FromNormalized(-123, 8), Fixed.FromNormalized(-123, 3), false],
    [Fixed.FromNormalized(12300001, 8), Fixed.FromNormalized(-123, 3), false],
    [Fixed.FromNormalized(-12300001, 8), Fixed.FromNormalized(123, 3), true],
    [Fixed.FromNormalized(0, 8), Fixed.FromNormalized(0, 7), false],
    [Fixed.FromNormalized(9, 8), Fixed.FromNormalized(1, 7), true],
    [Fixed.FromNormalized(-9, 8), Fixed.FromNormalized(-1, 7), false],
    [Fixed.FromNormalized(100, 8), Fixed.FromNormalized(9, 7), false],
    [Fixed.FromNormalized(-100, 8), Fixed.FromNormalized(-9, 7), true],
    [Fixed.FromNormalized(1230, 8), Fixed.FromNormalized(123, 7), false],
    [Fixed.FromNormalized(-1230, 8), Fixed.FromNormalized(-123, 7), false],
    [Fixed.FromNormalized(123, 8), Fixed.FromNormalized(123, 7), true],
    [Fixed.FromNormalized(-123, 8), Fixed.FromNormalized(-123, 7), false],
    [Fixed.FromNormalized(1231, 8), Fixed.FromNormalized(-123, 7), false],
    [Fixed.FromNormalized(-1231, 8), Fixed.FromNormalized(123, 7), true],
    [Fixed.FromNormalized(0, 8), Fixed.FromNormalized(0, 15), false],
    [Fixed.FromNormalized(1, 8), Fixed.FromNormalized(9999999, 15), false],
    [Fixed.FromNormalized(-1, 8), Fixed.FromNormalized(-9999999, 15), true],
    [Fixed.FromNormalized(3, 8), Fixed.FromNormalized(29999999, 15), false],
    [Fixed.FromNormalized(-3, 8), Fixed.FromNormalized(-29999999, 15), true],
    [Fixed.FromNormalized(5, 8), Fixed.FromNormalized(50000000, 15), false],
    [Fixed.FromNormalized(-5, 8), Fixed.FromNormalized(-50000000, 15), false],
    [Fixed.FromNormalized(123, 8), Fixed.FromNormalized(123, 15), false],
    [Fixed.FromNormalized(-123, 8), Fixed.FromNormalized(-123, 15), true],
    [Fixed.FromNormalized(5000000000000000, 8), Fixed.FromNormalized(-5000000000000000, 15), false],
    [Fixed.FromNormalized(-5000000000000000, 8), Fixed.FromNormalized(5000000000000000, 15), true]
])
.test('static Min should return correct result (%#): source: %o, other: %o, is source returned: %s',
    (source: Fixed, other: Fixed, isSourceReturned: boolean) =>
    {
        const expected = isSourceReturned ? source : other;
        const result = FixedMath.Min(source, other);
        expect(result).not.toBe(source);
        expect(result).not.toBe(other);
        expect(result.precision).toBe(expected.precision);
        expect(result.normalizedValue).toBe(expected.normalizedValue);
    }
);

each([
    [Fixed.FromNormalized(0, 0), Fixed.FromNormalized(0, 0), false],
    [Fixed.FromNormalized(1, 0), Fixed.FromNormalized(0, 0), true],
    [Fixed.FromNormalized(-1, 0), Fixed.FromNormalized(0, 0), false],
    [Fixed.FromNormalized(100, 0), Fixed.FromNormalized(99, 0), true],
    [Fixed.FromNormalized(-100, 0), Fixed.FromNormalized(-99, 0), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123, 0), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123, 0), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(-123, 0), true],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(123, 0), false],
    [Fixed.FromNormalized(0, 0), Fixed.FromNormalized(0, 1), false],
    [Fixed.FromNormalized(1, 0), Fixed.FromNormalized(9, 1), true],
    [Fixed.FromNormalized(-1, 0), Fixed.FromNormalized(-9, 1), false],
    [Fixed.FromNormalized(100, 0), Fixed.FromNormalized(999, 1), true],
    [Fixed.FromNormalized(-100, 0), Fixed.FromNormalized(-999, 1), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(1230, 1), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-1230, 1), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123, 1), true],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123, 1), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(-1230, 1), true],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(1230, 1), false],
    [Fixed.FromNormalized(0, 0), Fixed.FromNormalized(0, 3), false],
    [Fixed.FromNormalized(1, 0), Fixed.FromNormalized(999, 3), true],
    [Fixed.FromNormalized(-1, 0), Fixed.FromNormalized(-999, 3), false],
    [Fixed.FromNormalized(100, 0), Fixed.FromNormalized(99999, 3), true],
    [Fixed.FromNormalized(-100, 0), Fixed.FromNormalized(-99999, 3), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123000, 3), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123000, 3), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123, 3), true],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123, 3), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(-123000, 3), true],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(123000, 3), false],
    [Fixed.FromNormalized(0, 0), Fixed.FromNormalized(0, 7), false],
    [Fixed.FromNormalized(1, 0), Fixed.FromNormalized(9999999, 7), true],
    [Fixed.FromNormalized(-1, 0), Fixed.FromNormalized(-9999999, 7), false],
    [Fixed.FromNormalized(100, 0), Fixed.FromNormalized(999999999, 7), true],
    [Fixed.FromNormalized(-100, 0), Fixed.FromNormalized(-999999999, 7), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(1230000000, 7), false],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-1230000000, 7), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123, 7), true],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123, 7), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(-1230000000, 7), true],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(1230000000, 7), false],
    [Fixed.FromNormalized(0, 0), Fixed.FromNormalized(0, 15), false],
    [Fixed.FromNormalized(1, 0), Fixed.FromNormalized(999999999999999, 15), true],
    [Fixed.FromNormalized(-1, 0), Fixed.FromNormalized(-999999999999999, 15), false],
    [Fixed.FromNormalized(3, 0), Fixed.FromNormalized(2999999999999999, 15), true],
    [Fixed.FromNormalized(-3, 0), Fixed.FromNormalized(-2999999999999999, 15), false],
    [Fixed.FromNormalized(5, 0), Fixed.FromNormalized(5000000000000000, 15), false],
    [Fixed.FromNormalized(-5, 0), Fixed.FromNormalized(-5000000000000000, 15), false],
    [Fixed.FromNormalized(123, 0), Fixed.FromNormalized(123, 15), true],
    [Fixed.FromNormalized(-123, 0), Fixed.FromNormalized(-123, 15), false],
    [Fixed.FromNormalized(5000000000000000, 0), Fixed.FromNormalized(-5000000000000000, 15), true],
    [Fixed.FromNormalized(-5000000000000000, 0), Fixed.FromNormalized(5000000000000000, 15), false],
    [Fixed.FromNormalized(0, 2), Fixed.FromNormalized(0, 2), false],
    [Fixed.FromNormalized(1, 2), Fixed.FromNormalized(0, 2), true],
    [Fixed.FromNormalized(-1, 2), Fixed.FromNormalized(0, 2), false],
    [Fixed.FromNormalized(100, 2), Fixed.FromNormalized(99, 2), true],
    [Fixed.FromNormalized(-100, 2), Fixed.FromNormalized(-99, 2), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(123, 2), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-123, 2), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(-123, 2), true],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(123, 2), false],
    [Fixed.FromNormalized(0, 2), Fixed.FromNormalized(0, 1), false],
    [Fixed.FromNormalized(9, 2), Fixed.FromNormalized(1, 1), false],
    [Fixed.FromNormalized(-9, 2), Fixed.FromNormalized(-1, 1), true],
    [Fixed.FromNormalized(100, 2), Fixed.FromNormalized(9, 1), true],
    [Fixed.FromNormalized(-100, 2), Fixed.FromNormalized(-9, 1), false],
    [Fixed.FromNormalized(1230, 2), Fixed.FromNormalized(123, 1), false],
    [Fixed.FromNormalized(-1230, 2), Fixed.FromNormalized(-123, 1), false],
    [Fixed.FromNormalized(1230, 2), Fixed.FromNormalized(-123, 1), true],
    [Fixed.FromNormalized(-1230, 2), Fixed.FromNormalized(123, 1), false],
    [Fixed.FromNormalized(1231, 2), Fixed.FromNormalized(123, 1), true],
    [Fixed.FromNormalized(-1231, 2), Fixed.FromNormalized(-123, 1), false],
    [Fixed.FromNormalized(0, 2), Fixed.FromNormalized(0, 3), false],
    [Fixed.FromNormalized(1, 2), Fixed.FromNormalized(9, 3), true],
    [Fixed.FromNormalized(-1, 2), Fixed.FromNormalized(-9, 3), false],
    [Fixed.FromNormalized(100, 2), Fixed.FromNormalized(999, 3), true],
    [Fixed.FromNormalized(-100, 2), Fixed.FromNormalized(-999, 3), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(1230, 3), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-1230, 3), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(123, 3), true],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-123, 3), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(-1230, 3), true],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(1230, 3), false],
    [Fixed.FromNormalized(0, 2), Fixed.FromNormalized(0, 7), false],
    [Fixed.FromNormalized(1, 2), Fixed.FromNormalized(99999, 7), true],
    [Fixed.FromNormalized(-1, 2), Fixed.FromNormalized(-99999, 7), false],
    [Fixed.FromNormalized(100, 2), Fixed.FromNormalized(9999999, 7), true],
    [Fixed.FromNormalized(-100, 2), Fixed.FromNormalized(-9999999, 7), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(12300000, 7), false],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-12300000, 7), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(123, 7), true],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-123, 7), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(-12300000, 7), true],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(12300000, 7), false],
    [Fixed.FromNormalized(0, 2), Fixed.FromNormalized(0, 15), false],
    [Fixed.FromNormalized(1, 2), Fixed.FromNormalized(9999999999999, 15), true],
    [Fixed.FromNormalized(-1, 2), Fixed.FromNormalized(-9999999999999, 15), false],
    [Fixed.FromNormalized(3, 2), Fixed.FromNormalized(29999999999999, 15), true],
    [Fixed.FromNormalized(-3, 2), Fixed.FromNormalized(-29999999999999, 15), false],
    [Fixed.FromNormalized(5, 2), Fixed.FromNormalized(50000000000000, 15), false],
    [Fixed.FromNormalized(-5, 2), Fixed.FromNormalized(-50000000000000, 15), false],
    [Fixed.FromNormalized(123, 2), Fixed.FromNormalized(123, 15), true],
    [Fixed.FromNormalized(-123, 2), Fixed.FromNormalized(-123, 15), false],
    [Fixed.FromNormalized(5000000000000000, 2), Fixed.FromNormalized(-5000000000000000, 15), true],
    [Fixed.FromNormalized(-5000000000000000, 2), Fixed.FromNormalized(5000000000000000, 15), false],
    [Fixed.FromNormalized(0, 8), Fixed.FromNormalized(0, 8), false],
    [Fixed.FromNormalized(1, 8), Fixed.FromNormalized(0, 8), true],
    [Fixed.FromNormalized(-1, 8), Fixed.FromNormalized(0, 8), false],
    [Fixed.FromNormalized(100, 8), Fixed.FromNormalized(99, 8), true],
    [Fixed.FromNormalized(-100, 8), Fixed.FromNormalized(-99, 8), false],
    [Fixed.FromNormalized(123, 8), Fixed.FromNormalized(123, 8), false],
    [Fixed.FromNormalized(-123, 8), Fixed.FromNormalized(-123, 8), false],
    [Fixed.FromNormalized(123, 8), Fixed.FromNormalized(-123, 8), true],
    [Fixed.FromNormalized(-123, 8), Fixed.FromNormalized(123, 8), false],
    [Fixed.FromNormalized(0, 8), Fixed.FromNormalized(0, 1), false],
    [Fixed.FromNormalized(9, 8), Fixed.FromNormalized(1, 1), false],
    [Fixed.FromNormalized(-9, 8), Fixed.FromNormalized(-1, 1), true],
    [Fixed.FromNormalized(100000000, 8), Fixed.FromNormalized(9, 1), true],
    [Fixed.FromNormalized(-100000000, 8), Fixed.FromNormalized(-9, 1), false],
    [Fixed.FromNormalized(1230000000, 8), Fixed.FromNormalized(123, 1), false],
    [Fixed.FromNormalized(-1230000000, 8), Fixed.FromNormalized(-123, 1), false],
    [Fixed.FromNormalized(1230000000, 8), Fixed.FromNormalized(-123, 1), true],
    [Fixed.FromNormalized(-1230000000, 8), Fixed.FromNormalized(123, 1), false],
    [Fixed.FromNormalized(1230000001, 8), Fixed.FromNormalized(123, 1), true],
    [Fixed.FromNormalized(-1230000001, 8), Fixed.FromNormalized(-123, 1), false],
    [Fixed.FromNormalized(0, 8), Fixed.FromNormalized(0, 3), false],
    [Fixed.FromNormalized(9, 8), Fixed.FromNormalized(1, 3), false],
    [Fixed.FromNormalized(-9, 8), Fixed.FromNormalized(-1, 3), true],
    [Fixed.FromNormalized(1000000, 8), Fixed.FromNormalized(9, 3), true],
    [Fixed.FromNormalized(-1000000, 8), Fixed.FromNormalized(-9, 3), false],
    [Fixed.FromNormalized(12300000, 8), Fixed.FromNormalized(123, 3), false],
    [Fixed.FromNormalized(-12300000, 8), Fixed.FromNormalized(-123, 3), false],
    [Fixed.FromNormalized(123, 8), Fixed.FromNormalized(123, 3), false],
    [Fixed.FromNormalized(-123, 8), Fixed.FromNormalized(-123, 3), true],
    [Fixed.FromNormalized(12300001, 8), Fixed.FromNormalized(-123, 3), true],
    [Fixed.FromNormalized(-12300001, 8), Fixed.FromNormalized(123, 3), false],
    [Fixed.FromNormalized(0, 8), Fixed.FromNormalized(0, 7), false],
    [Fixed.FromNormalized(9, 8), Fixed.FromNormalized(1, 7), false],
    [Fixed.FromNormalized(-9, 8), Fixed.FromNormalized(-1, 7), true],
    [Fixed.FromNormalized(100, 8), Fixed.FromNormalized(9, 7), true],
    [Fixed.FromNormalized(-100, 8), Fixed.FromNormalized(-9, 7), false],
    [Fixed.FromNormalized(1230, 8), Fixed.FromNormalized(123, 7), false],
    [Fixed.FromNormalized(-1230, 8), Fixed.FromNormalized(-123, 7), false],
    [Fixed.FromNormalized(123, 8), Fixed.FromNormalized(123, 7), false],
    [Fixed.FromNormalized(-123, 8), Fixed.FromNormalized(-123, 7), true],
    [Fixed.FromNormalized(1231, 8), Fixed.FromNormalized(-123, 7), true],
    [Fixed.FromNormalized(-1231, 8), Fixed.FromNormalized(123, 7), false],
    [Fixed.FromNormalized(0, 8), Fixed.FromNormalized(0, 15), false],
    [Fixed.FromNormalized(1, 8), Fixed.FromNormalized(9999999, 15), true],
    [Fixed.FromNormalized(-1, 8), Fixed.FromNormalized(-9999999, 15), false],
    [Fixed.FromNormalized(3, 8), Fixed.FromNormalized(29999999, 15), true],
    [Fixed.FromNormalized(-3, 8), Fixed.FromNormalized(-29999999, 15), false],
    [Fixed.FromNormalized(5, 8), Fixed.FromNormalized(50000000, 15), false],
    [Fixed.FromNormalized(-5, 8), Fixed.FromNormalized(-50000000, 15), false],
    [Fixed.FromNormalized(123, 8), Fixed.FromNormalized(123, 15), true],
    [Fixed.FromNormalized(-123, 8), Fixed.FromNormalized(-123, 15), false],
    [Fixed.FromNormalized(5000000000000000, 8), Fixed.FromNormalized(-5000000000000000, 15), true],
    [Fixed.FromNormalized(-5000000000000000, 8), Fixed.FromNormalized(5000000000000000, 15), false]
])
.test('static Max should return correct result (%#): source: %o, other: %o, is source returned: %s',
    (source: Fixed, other: Fixed, isSourceReturned: boolean) =>
    {
        const expected = isSourceReturned ? source : other;
        const result = FixedMath.Max(source, other);
        expect(result).not.toBe(source);
        expect(result).not.toBe(other);
        expect(result.precision).toBe(expected.precision);
        expect(result.normalizedValue).toBe(expected.normalizedValue);
    }
);

each([
    [0],
    [1],
    [-1],
    [10],
    [-10],
    [101],
    [-101],
    [123456789],
    [-987654321]
])
.test('static Abs should return correct result (%#): norm. value: %f',
    (value: number) =>
    {
        forAllPrecisions(p =>
            {
                const fixed = Fixed.FromNormalized(value, p);
                const result = FixedMath.Abs(fixed);
                expect(result).not.toBe(fixed);
                expect(result.precision).toBe(fixed.precision);
                expect(result.normalizedValue).toBe(Math.abs(fixed.normalizedValue));
            });
    }
);

each([
    [Fixed.FromNormalized(0, 0), 0],
    [Fixed.FromNormalized(1, 0), 1],
    [Fixed.FromNormalized(-1, 0), -1],
    [Fixed.FromNormalized(123456789, 0), 123456789],
    [Fixed.FromNormalized(-123456789, 0), -123456789],
    [Fixed.FromNormalized(0, 1), 0],
    [Fixed.FromNormalized(1, 1), 0],
    [Fixed.FromNormalized(-1, 1), 0],
    [Fixed.FromNormalized(10, 1), 10],
    [Fixed.FromNormalized(-10, 1), -10],
    [Fixed.FromNormalized(123456789, 1), 123456780],
    [Fixed.FromNormalized(-123456789, 1), -123456780],
    [Fixed.FromNormalized(0, 2), 0],
    [Fixed.FromNormalized(1, 2), 0],
    [Fixed.FromNormalized(-1, 2), 0],
    [Fixed.FromNormalized(100, 2), 100],
    [Fixed.FromNormalized(-100, 2), -100],
    [Fixed.FromNormalized(123456789, 2), 123456700],
    [Fixed.FromNormalized(-123456789, 2), -123456700],
    [Fixed.FromNormalized(0, 8), 0],
    [Fixed.FromNormalized(1, 8), 0],
    [Fixed.FromNormalized(-1, 8), 0],
    [Fixed.FromNormalized(100000000, 8), 100000000],
    [Fixed.FromNormalized(-100000000, 8), -100000000],
    [Fixed.FromNormalized(12345678901, 8), 12300000000],
    [Fixed.FromNormalized(-12345678901, 8), -12300000000],
    [Fixed.FromNormalized(0, 15), 0],
    [Fixed.FromNormalized(1, 15), 0],
    [Fixed.FromNormalized(-1, 15), 0],
    [Fixed.FromNormalized(1000000000000000, 15), 1000000000000000],
    [Fixed.FromNormalized(-1000000000000000, 15), -1000000000000000],
    [Fixed.FromNormalized(6234567890123456, 15), 6000000000000000],
    [Fixed.FromNormalized(-6234567890123456, 15), -6000000000000000]
])
.test('static Truncate should return correct result (%#): source: %o, expected norm. value: %f',
    (source: Fixed, expectedValue: number) =>
    {
        const result = FixedMath.Truncate(source);
        expect(result).not.toBe(source);
        expect(result.precision).toBe(source.precision);
        expect(result.normalizedValue).toBe(expectedValue);
    }
);

each([
    [Fixed.FromNormalized(0, 0), 0],
    [Fixed.FromNormalized(1, 0), 0],
    [Fixed.FromNormalized(-1, 0), 0],
    [Fixed.FromNormalized(123456789, 0), 0],
    [Fixed.FromNormalized(-123456789, 0), 0],
    [Fixed.FromNormalized(0, 1), 0],
    [Fixed.FromNormalized(1, 1), 1],
    [Fixed.FromNormalized(-1, 1), -1],
    [Fixed.FromNormalized(10, 1), 0],
    [Fixed.FromNormalized(-10, 1), 0],
    [Fixed.FromNormalized(123456789, 1), 9],
    [Fixed.FromNormalized(-123456789, 1), -9],
    [Fixed.FromNormalized(0, 2), 0],
    [Fixed.FromNormalized(1, 2), 1],
    [Fixed.FromNormalized(-1, 2), -1],
    [Fixed.FromNormalized(100, 2), 0],
    [Fixed.FromNormalized(-100, 2), 0],
    [Fixed.FromNormalized(123456789, 2), 89],
    [Fixed.FromNormalized(-123456789, 2), -89],
    [Fixed.FromNormalized(0, 8), 0],
    [Fixed.FromNormalized(1, 8), 1],
    [Fixed.FromNormalized(-1, 8), -1],
    [Fixed.FromNormalized(100000000, 8), 0],
    [Fixed.FromNormalized(-100000000, 8), 0],
    [Fixed.FromNormalized(12345678901, 8), 45678901],
    [Fixed.FromNormalized(-12345678901, 8), -45678901],
    [Fixed.FromNormalized(0, 15), 0],
    [Fixed.FromNormalized(1, 15), 1],
    [Fixed.FromNormalized(-1, 15), -1],
    [Fixed.FromNormalized(1000000000000000, 15), 0],
    [Fixed.FromNormalized(-1000000000000000, 15), 0],
    [Fixed.FromNormalized(6234567890123456, 15), 234567890123456],
    [Fixed.FromNormalized(-6234567890123456, 15), -234567890123456]
])
.test('static Fractional should return correct result (%#): source: %o, expected norm. value: %f',
    (source: Fixed, expectedValue: number) =>
    {
        const result = FixedMath.Fractional(source);
        expect(result).not.toBe(source);
        expect(result.precision).toBe(source.precision);
        expect(result.normalizedValue).toBe(expectedValue);
    }
);

each([
    [Fixed.FromNormalized(0, 0), 0, 0],
    [Fixed.FromNormalized(1, 0), 0, 1],
    [Fixed.FromNormalized(-1, 0), 0, -1],
    [Fixed.FromNormalized(123456789, 0), 0, 123456789],
    [Fixed.FromNormalized(-123456789, 0), 0, -123456789],
    [Fixed.FromNormalized(0, 0), 1, 0],
    [Fixed.FromNormalized(1, 0), 1, 1],
    [Fixed.FromNormalized(-1, 0), 1, -1],
    [Fixed.FromNormalized(123456789, 0), 1, 123456789],
    [Fixed.FromNormalized(-123456789, 0), 1, -123456789],
    [Fixed.FromNormalized(0, 0), 15, 0],
    [Fixed.FromNormalized(1, 0), 15, 1],
    [Fixed.FromNormalized(-1, 0), 15, -1],
    [Fixed.FromNormalized(123456789, 0), 15, 123456789],
    [Fixed.FromNormalized(-123456789, 0), 15, -123456789],
    [Fixed.FromNormalized(0, 1), 0, 0],
    [Fixed.FromNormalized(1, 1), 0, 0],
    [Fixed.FromNormalized(-1, 1), 0, 0],
    [Fixed.FromNormalized(5, 1), 0, 10],
    [Fixed.FromNormalized(-5, 1), 0, 0],
    [Fixed.FromNormalized(-6, 1), 0, -10],
    [Fixed.FromNormalized(10, 1), 0, 10],
    [Fixed.FromNormalized(-10, 1), 0, -10],
    [Fixed.FromNormalized(123456789, 1), 0, 123456790],
    [Fixed.FromNormalized(-123456789, 1), 0, -123456790],
    [Fixed.FromNormalized(0, 1), 1, 0],
    [Fixed.FromNormalized(1, 1), 1, 1],
    [Fixed.FromNormalized(-1, 1), 1, -1],
    [Fixed.FromNormalized(123456789, 1), 1, 123456789],
    [Fixed.FromNormalized(-123456789, 1), 1, -123456789],
    [Fixed.FromNormalized(0, 1), 2, 0],
    [Fixed.FromNormalized(1, 1), 2, 1],
    [Fixed.FromNormalized(-1, 1), 2, -1],
    [Fixed.FromNormalized(123456789, 1), 2, 123456789],
    [Fixed.FromNormalized(-123456789, 1), 2, -123456789],
    [Fixed.FromNormalized(0, 1), 15, 0],
    [Fixed.FromNormalized(1, 1), 15, 1],
    [Fixed.FromNormalized(-1, 1), 15, -1],
    [Fixed.FromNormalized(123456789, 1), 15, 123456789],
    [Fixed.FromNormalized(-123456789, 1), 15, -123456789],
    [Fixed.FromNormalized(0, 2), 0, 0],
    [Fixed.FromNormalized(1, 2), 0, 0],
    [Fixed.FromNormalized(-1, 2), 0, 0],
    [Fixed.FromNormalized(50, 2), 0, 100],
    [Fixed.FromNormalized(-50, 2), 0, 0],
    [Fixed.FromNormalized(-51, 2), 0, -100],
    [Fixed.FromNormalized(100, 2), 0, 100],
    [Fixed.FromNormalized(-100, 2), 0, -100],
    [Fixed.FromNormalized(123456789, 2), 0, 123456800],
    [Fixed.FromNormalized(-123456789, 2), 0, -123456800],
    [Fixed.FromNormalized(0, 2), 1, 0],
    [Fixed.FromNormalized(1, 2), 1, 0],
    [Fixed.FromNormalized(-1, 2), 1, 0],
    [Fixed.FromNormalized(5, 2), 1, 10],
    [Fixed.FromNormalized(-5, 2), 1, 0],
    [Fixed.FromNormalized(-6, 2), 1, -10],
    [Fixed.FromNormalized(105, 2), 1, 110],
    [Fixed.FromNormalized(-106, 2), 1, -110],
    [Fixed.FromNormalized(123456789, 2), 1, 123456790],
    [Fixed.FromNormalized(-123456789, 2), 1, -123456790],
    [Fixed.FromNormalized(0, 2), 2, 0],
    [Fixed.FromNormalized(1, 2), 2, 1],
    [Fixed.FromNormalized(-1, 2), 2, -1],
    [Fixed.FromNormalized(123456789, 2), 2, 123456789],
    [Fixed.FromNormalized(-123456789, 2), 2, -123456789],
    [Fixed.FromNormalized(0, 2), 3, 0],
    [Fixed.FromNormalized(1, 2), 3, 1],
    [Fixed.FromNormalized(-1, 2), 3, -1],
    [Fixed.FromNormalized(123456789, 2), 3, 123456789],
    [Fixed.FromNormalized(-123456789, 2), 3, -123456789],
    [Fixed.FromNormalized(0, 2), 15, 0],
    [Fixed.FromNormalized(1, 2), 15, 1],
    [Fixed.FromNormalized(-1, 2), 15, -1],
    [Fixed.FromNormalized(123456789, 2), 15, 123456789],
    [Fixed.FromNormalized(-123456789, 2), 15, -123456789],
    [Fixed.FromNormalized(0, 8), 0, 0],
    [Fixed.FromNormalized(1, 8), 0, 0],
    [Fixed.FromNormalized(-1, 8), 0, 0],
    [Fixed.FromNormalized(50000000, 8), 0, 100000000],
    [Fixed.FromNormalized(-50000000, 8), 0, 0],
    [Fixed.FromNormalized(-50000001, 8), 0, -100000000],
    [Fixed.FromNormalized(100000000, 8), 0, 100000000],
    [Fixed.FromNormalized(-100000000, 8), 0, -100000000],
    [Fixed.FromNormalized(623456789, 8), 0, 600000000],
    [Fixed.FromNormalized(-623456789, 8), 0, -600000000],
    [Fixed.FromNormalized(0, 8), 3, 0],
    [Fixed.FromNormalized(1, 8), 3, 0],
    [Fixed.FromNormalized(-1, 8), 3, 0],
    [Fixed.FromNormalized(50000, 8), 3, 100000],
    [Fixed.FromNormalized(-50000, 8), 3, 0],
    [Fixed.FromNormalized(-50001, 8), 3, -100000],
    [Fixed.FromNormalized(100000, 8), 3, 100000],
    [Fixed.FromNormalized(-100000, 8), 3, -100000],
    [Fixed.FromNormalized(623456789, 8), 3, 623500000],
    [Fixed.FromNormalized(-623456789, 8), 3, -623500000],
    [Fixed.FromNormalized(0, 8), 6, 0],
    [Fixed.FromNormalized(1, 8), 6, 0],
    [Fixed.FromNormalized(-1, 8), 6, 0],
    [Fixed.FromNormalized(50, 8), 6, 100],
    [Fixed.FromNormalized(-50, 8), 6, 0],
    [Fixed.FromNormalized(-51, 8), 6, -100],
    [Fixed.FromNormalized(100, 8), 6, 100],
    [Fixed.FromNormalized(-100, 8), 6, -100],
    [Fixed.FromNormalized(623456789, 8), 6, 623456800],
    [Fixed.FromNormalized(-623456789, 8), 6, -623456800],
    [Fixed.FromNormalized(0, 8), 8, 0],
    [Fixed.FromNormalized(1, 8), 8, 1],
    [Fixed.FromNormalized(-1, 8), 8, -1],
    [Fixed.FromNormalized(123456789, 8), 8, 123456789],
    [Fixed.FromNormalized(-123456789, 8), 8, -123456789],
    [Fixed.FromNormalized(0, 8), 9, 0],
    [Fixed.FromNormalized(1, 8), 9, 1],
    [Fixed.FromNormalized(-1, 8), 9, -1],
    [Fixed.FromNormalized(123456789, 8), 9, 123456789],
    [Fixed.FromNormalized(-123456789, 8), 9, -123456789],
    [Fixed.FromNormalized(0, 8), 15, 0],
    [Fixed.FromNormalized(1, 8), 15, 1],
    [Fixed.FromNormalized(-1, 8), 15, -1],
    [Fixed.FromNormalized(123456789, 8), 15, 123456789],
    [Fixed.FromNormalized(-123456789, 8), 15, -123456789],
    [Fixed.FromNormalized(0, 8), 0, 0],
    [Fixed.FromNormalized(1, 8), 0, 0],
    [Fixed.FromNormalized(-1, 8), 0, 0],
    [Fixed.FromNormalized(500000000000000, 15), 0, 1000000000000000],
    [Fixed.FromNormalized(-500000000000000, 15), 0, 0],
    [Fixed.FromNormalized(-500000000000001, 15), 0, -1000000000000000],
    [Fixed.FromNormalized(1000000000000000, 15), 0, 1000000000000000],
    [Fixed.FromNormalized(-1000000000000000, 15), 0, -1000000000000000],
    [Fixed.FromNormalized(6234567890123456, 15), 0, 6000000000000000],
    [Fixed.FromNormalized(-6234567890123456, 15), 0, -6000000000000000],
    [Fixed.FromNormalized(0, 15), 3, 0],
    [Fixed.FromNormalized(1, 15), 3, 0],
    [Fixed.FromNormalized(-1, 15), 3, 0],
    [Fixed.FromNormalized(500000000000, 15), 3, 1000000000000],
    [Fixed.FromNormalized(-500000000000, 15), 3, 0],
    [Fixed.FromNormalized(-500000000001, 15), 3, -1000000000000],
    [Fixed.FromNormalized(1000000000000, 15), 3, 1000000000000],
    [Fixed.FromNormalized(-1000000000000, 15), 3, -1000000000000],
    [Fixed.FromNormalized(6234567890123456, 15), 3, 6235000000000000],
    [Fixed.FromNormalized(-6234567890123456, 15), 3, -6235000000000000],
    [Fixed.FromNormalized(0, 15), 6, 0],
    [Fixed.FromNormalized(1, 15), 6, 0],
    [Fixed.FromNormalized(-1, 15), 6, 0],
    [Fixed.FromNormalized(500000000, 15), 6, 1000000000],
    [Fixed.FromNormalized(-500000000, 15), 6, 0],
    [Fixed.FromNormalized(-500000001, 15), 6, -1000000000],
    [Fixed.FromNormalized(1000000000, 15), 6, 1000000000],
    [Fixed.FromNormalized(-1000000000, 15), 6, -1000000000],
    [Fixed.FromNormalized(6234567890123456, 15), 6, 6234568000000000],
    [Fixed.FromNormalized(-6234567890123456, 15), 6, -6234568000000000],
    [Fixed.FromNormalized(0, 15), 14, 0],
    [Fixed.FromNormalized(1, 15), 14, 0],
    [Fixed.FromNormalized(-1, 15), 14, 0],
    [Fixed.FromNormalized(5, 15), 14, 10],
    [Fixed.FromNormalized(-5, 15), 14, 0],
    [Fixed.FromNormalized(-6, 15), 14, -10],
    [Fixed.FromNormalized(10, 15), 14, 10],
    [Fixed.FromNormalized(-10, 15), 14, -10],
    [Fixed.FromNormalized(6234567890123456, 15), 14, 6234567890123460],
    [Fixed.FromNormalized(-6234567890123456, 15), 14, -6234567890123460],
    [Fixed.FromNormalized(0, 15), 15, 0],
    [Fixed.FromNormalized(1, 15), 15, 1],
    [Fixed.FromNormalized(-1, 15), 15, -1],
    [Fixed.FromNormalized(123456789, 15), 15, 123456789],
    [Fixed.FromNormalized(-123456789, 15), 15, -123456789],
])
.test('static Round should return correct result (%#): source: %o, precision: %f, expected norm.value: %f',
    (source: Fixed, precision: FixedPrecision, expectedValue: number) =>
    {
        const result = FixedMath.Round(source, precision);
        expect(result).not.toBe(source);
        expect(result.precision).toBe(source.precision);
        expect(result.normalizedValue).toBe(expectedValue);
    }
);

each([
    [Fixed.FromNormalized(0, 0), 0],
    [Fixed.FromNormalized(1, 0), 1],
    [Fixed.FromNormalized(-1, 0), -1],
    [Fixed.FromNormalized(123456789, 0), 123456789],
    [Fixed.FromNormalized(-123456789, 0), -123456789],
    [Fixed.FromNormalized(0, 1), 0],
    [Fixed.FromNormalized(1, 1), 10],
    [Fixed.FromNormalized(-1, 1), 0],
    [Fixed.FromNormalized(10, 1), 10],
    [Fixed.FromNormalized(-10, 1), -10],
    [Fixed.FromNormalized(11, 1), 20],
    [Fixed.FromNormalized(-11, 1), -10],
    [Fixed.FromNormalized(123456789, 1), 123456790],
    [Fixed.FromNormalized(-123456789, 1), -123456780],
    [Fixed.FromNormalized(0, 2), 0],
    [Fixed.FromNormalized(1, 2), 100],
    [Fixed.FromNormalized(-1, 2), 0],
    [Fixed.FromNormalized(100, 2), 100],
    [Fixed.FromNormalized(-100, 2), -100],
    [Fixed.FromNormalized(101, 2), 200],
    [Fixed.FromNormalized(-101, 2), -100],
    [Fixed.FromNormalized(123456789, 2), 123456800],
    [Fixed.FromNormalized(-123456789, 2), -123456700],
    [Fixed.FromNormalized(0, 8), 0],
    [Fixed.FromNormalized(1, 8), 100000000],
    [Fixed.FromNormalized(-1, 8), 0],
    [Fixed.FromNormalized(100000000, 8), 100000000],
    [Fixed.FromNormalized(-100000000, 8), -100000000],
    [Fixed.FromNormalized(100000001, 8), 200000000],
    [Fixed.FromNormalized(-100000001, 8), -100000000],
    [Fixed.FromNormalized(12345678901, 8), 12400000000],
    [Fixed.FromNormalized(-12345678901, 8), -12300000000],
    [Fixed.FromNormalized(0, 15), 0],
    [Fixed.FromNormalized(1, 15), 1000000000000000],
    [Fixed.FromNormalized(-1, 15), 0],
    [Fixed.FromNormalized(1000000000000000, 15), 1000000000000000],
    [Fixed.FromNormalized(-1000000000000000, 15), -1000000000000000],
    [Fixed.FromNormalized(1000000000000001, 15), 2000000000000000],
    [Fixed.FromNormalized(-1000000000000001, 15), -1000000000000000],
    [Fixed.FromNormalized(6234567890123456, 15), 7000000000000000],
    [Fixed.FromNormalized(-6234567890123456, 15), -6000000000000000]
])
.test('static Ceil should return correct result (%#): source: %o, expected norm. value: %f',
    (source: Fixed, expectedValue: number) =>
    {
        const result = FixedMath.Ceil(source);
        expect(result).not.toBe(source);
        expect(result.precision).toBe(source.precision);
        expect(result.normalizedValue).toBe(expectedValue);
    }
);

each([
    [Fixed.FromNormalized(0, 0), 0],
    [Fixed.FromNormalized(1, 0), 1],
    [Fixed.FromNormalized(-1, 0), -1],
    [Fixed.FromNormalized(123456789, 0), 123456789],
    [Fixed.FromNormalized(-123456789, 0), -123456789],
    [Fixed.FromNormalized(0, 1), 0],
    [Fixed.FromNormalized(1, 1), 0],
    [Fixed.FromNormalized(-1, 1), -10],
    [Fixed.FromNormalized(10, 1), 10],
    [Fixed.FromNormalized(-10, 1), -10],
    [Fixed.FromNormalized(11, 1), 10],
    [Fixed.FromNormalized(-11, 1), -20],
    [Fixed.FromNormalized(123456789, 1), 123456780],
    [Fixed.FromNormalized(-123456789, 1), -123456790],
    [Fixed.FromNormalized(0, 2), 0],
    [Fixed.FromNormalized(1, 2), 0],
    [Fixed.FromNormalized(-1, 2), -100],
    [Fixed.FromNormalized(100, 2), 100],
    [Fixed.FromNormalized(-100, 2), -100],
    [Fixed.FromNormalized(101, 2), 100],
    [Fixed.FromNormalized(-101, 2), -200],
    [Fixed.FromNormalized(123456789, 2), 123456700],
    [Fixed.FromNormalized(-123456789, 2), -123456800],
    [Fixed.FromNormalized(0, 8), 0],
    [Fixed.FromNormalized(1, 8), 0],
    [Fixed.FromNormalized(-1, 8), -100000000],
    [Fixed.FromNormalized(100000000, 8), 100000000],
    [Fixed.FromNormalized(-100000000, 8), -100000000],
    [Fixed.FromNormalized(100000001, 8), 100000000],
    [Fixed.FromNormalized(-100000001, 8), -200000000],
    [Fixed.FromNormalized(12345678901, 8), 12300000000],
    [Fixed.FromNormalized(-12345678901, 8), -12400000000],
    [Fixed.FromNormalized(0, 15), 0],
    [Fixed.FromNormalized(1, 15), 0],
    [Fixed.FromNormalized(-1, 15), -1000000000000000],
    [Fixed.FromNormalized(1000000000000000, 15), 1000000000000000],
    [Fixed.FromNormalized(-1000000000000000, 15), -1000000000000000],
    [Fixed.FromNormalized(1000000000000001, 15), 1000000000000000],
    [Fixed.FromNormalized(-1000000000000001, 15), -2000000000000000],
    [Fixed.FromNormalized(6234567890123456, 15), 6000000000000000],
    [Fixed.FromNormalized(-6234567890123456, 15), -7000000000000000]
])
.test('static Floor should return correct result (%#): source: %o, expected norm. value: %f',
    (source: Fixed, expectedValue: number) =>
    {
        const result = FixedMath.Floor(source);
        expect(result).not.toBe(source);
        expect(result.precision).toBe(source.precision);
        expect(result.normalizedValue).toBe(expectedValue);
    }
);

each([
    [0],
    [1],
    [-1],
    [10],
    [-10],
    [101],
    [-101],
    [123456789],
    [-987654321]
])
.test('static Sign should return correct result (%#): norm. value: %f',
    (value: number) =>
    {
        forAllPrecisions(p =>
            {
                const fixed = Fixed.FromNormalized(value, p);
                const result = FixedMath.Sign(fixed);
                expect(result).toBe(fixed.isZero ? 0 : fixed.isPositive ? 1 : -1);
            });
    }
);

test('static Random should return correct result',
    () =>
    {
        forAllPrecisions(p =>
            {
                const result = FixedMath.Random(p);
                expect(result.precision).toBe(p);
                expect(result.normalizedValue).toBeGreaterThanOrEqual(0);
                expect(result.normalizedValue).toBeLessThanOrEqual(Fixed.GetMaxValue(0));
            });
    }
);

test('static Sum for empty collection should return zero',
    () =>
    {
        forAllPrecisions(p =>
            {
                const result = FixedMath.Sum([], p);
                expect(result.precision).toBe(p);
                expect(result.normalizedValue).toBe(0);
            });

        const result = FixedMath.Sum([]);
        expect(result.precision).toBe(0);
        expect(result.normalizedValue).toBe(0);
    }
);

each([
    [[0, 1, 2, 3], 6],
    [[0], 0],
    [[1], 1],
    [[1, -1], 0],
    [[0, 1, 0, 0, 1], 2],
    [[-1, -2, -3], -6],
    [[100, 245, -34567, 1234526, 11, -243, 77, -4], 1200145]
])
.test('static Sum should return correct result for the same precision (%#): norm. values: %o, expected norm. value: %f',
    (values: number[], expected: number) =>
    {
        forAllPrecisions(p =>
            {
                const params = values.map(v => Fixed.FromNormalized(v, p));
                const result = FixedMath.Sum(params);
                expect(params.some(f => f === result)).toBe(false);
                expect(result.precision).toBe(p);
                expect(result.normalizedValue).toBe(expected);
            }
        );
    }
);

each([
    [[Fixed.FromNormalized(0, 5),
        Fixed.FromNormalized(1, 4),
        Fixed.FromNormalized(2, 3),
        Fixed.FromNormalized(3, 1)],
        void(0), 30210],
    [[Fixed.FromNormalized(153, 3)],
        2, 15],
    [[Fixed.FromNormalized(1000, 3),
        Fixed.FromNormalized(-100, 2)],
        10, 0],
    [[Fixed.FromNormalized(-123, 3),
        Fixed.FromNormalized(-89, 2),
        Fixed.FromNormalized(-234567, 7)],
        void(0), -1036],
    [[Fixed.FromNormalized(100, 2),
        Fixed.FromNormalized(245678, 3),
        Fixed.FromNormalized(-123, 1),
        Fixed.FromNormalized(123456789, 8)],
        7, 2356125679]
])
.test('static Sum should return correct result for the same precision (%#): values: %o, precision: %f, expected norm. value: %f',
    (values: Fixed[], precision: FixedPrecision | undefined, expected: number) =>
    {
            const result = FixedMath.Sum(values, precision);
            expect(values.some(f => f === result)).toBe(false);
            expect(result.precision).toBe(precision || values[0].precision);
            expect(result.normalizedValue).toBe(expected);
    }
);
