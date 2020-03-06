import { Fixed } from '../core/fixed';
import { FixedPrecision } from '../core/fixed-precision';
import each from 'jest-each';
import { partialMock, mock } from 'frl-ts-mocking/lib/core/mock';
import { IMockedMethodInfo } from 'frl-ts-mocking/lib/core/mocked-method-info.interface';

const precisions = [...Array(15).keys()];

function forAllPrecisions(action: (p: FixedPrecision) => void): void
{
    for (const precision of precisions)
        action(precision as FixedPrecision);
}

test('ctor should create zeros with proper precision',
    () =>
    {
        forAllPrecisions(p =>
            {
                const fixed = new Fixed(p);
                expect(fixed.precision).toBe(p);
                expect(fixed.normalizedValue).toBe(0);
            });
    }
);

test('static GetEmpty should return zero with precision equal to 0',
    () =>
    {
        const fixed = Fixed.GetEmpty();
        expect(fixed.precision).toBe(0);
        expect(fixed.normalizedValue).toBe(0);
        expect(Fixed.GetEmpty()).not.toBe(fixed);
    }
);

each([
    [0, 9007199254740991],
    [1, 900719925474099],
    [2, 90071992547409],
    [3, 9007199254740],
    [4, 900719925474],
    [5, 90071992547],
    [6, 9007199254],
    [7, 900719925],
    [8, 90071992],
    [9, 9007199],
    [10, 900719],
    [11, 90071],
    [12, 9007],
    [13, 900],
    [14, 90],
    [15, 9]
])
.test('static GetMaxValue and GetMinValue should return correct results (%#): precision: %f, expected value: %f',
    (precision: FixedPrecision, value: number) =>
    {
        const max = Fixed.GetMaxValue(precision);
        const min = Fixed.GetMinValue(precision);
        expect(max).toBe(value);
        expect(min).toBe(-value);
    }
);

test('static GetEpsilon should return correct number',
    () =>
    {
        forAllPrecisions(p =>
            {
                const fixed = Fixed.GetEpsilon(p);
                expect(fixed.precision).toBe(p);
                expect(fixed.normalizedValue).toBe(1);
            });
    }
);

each([
    [0, 0],
    [-0, 0],
    [-1, -1],
    [1, 1],
    [1.5, 1],
    [-2.99, -2],
    [Fixed.GetMaxValue(0), Fixed.GetMaxValue(0)],
    [Fixed.GetMinValue(0), Fixed.GetMinValue(0)],
    [900719925.467, 900719925],
    [-633.00024, -633],
    [10.99, 10]
])
.test('static FromNormalized should return correct number (%#): value: %f, expected value: %f',
    (value: number, expectedValue: number) =>
    {
        forAllPrecisions(p =>
            {
                const fixed = Fixed.FromNormalized(value, p);
                expect(fixed.precision).toBe(p);
                expect(fixed.normalizedValue).toBe(expectedValue);
            });
    }
);

each([
    [0, 0, 0],
    [0, -0, 0],
    [0, 17, 17],
    [0, 11.99112, 12],
    [0, 9.013673, 9],
    [0, 0.5, 1],
    [0, -5, -5],
    [0, -7.5, -7],
    [0, -12.987, -13],
    [0, -1.1, -1],
    [1, 0, 0],
    [1, -0, 0],
    [1, 17, 170],
    [1, 11.94112, 119],
    [1, 9.05, 91],
    [1, 0.5, 5],
    [1, -5, -50],
    [1, -7.5, -75],
    [1, -12.987, -130],
    [1, -1.1, -11],
    [2, 0, 0],
    [2, -0, 0],
    [2, 17.01, 1701],
    [2, 11.94112, 1194],
    [2, 9.05, 905],
    [2, 0.555, 56],
    [2, -5, -500],
    [2, -7.519, -752],
    [2, -12.987, -1299],
    [2, -1.1, -110],
    [3, 0, 0],
    [3, -0, 0],
    [3, 17.0005, 17001],
    [3, 11.94112, 11941],
    [3, 9.0501, 9050],
    [3, 0.555, 555],
    [3, -5, -5000],
    [3, -7.5199, -7520],
    [3, -12.9871, -12987],
    [3, -1.1567, -1157],
    [8, 0.0004000231, 40002],
    [8, 8, 800000000],
    [8, 17.012345678, 1701234568],
    [8, 11.941122145, 1194112215],
    [8, 9.0000000049, 900000000],
    [8, 0.555000099, 55500010],
    [8, -5, -500000000],
    [8, -7.519901239, -751990124],
    [8, -12.987101201, -1298710120],
    [8, -1.156789056, -115678906],
    [15, 0.0000040002310124, 4000231012],
    [15, 8, 8000000000000000],
    [15, 7.012345678912345, 7012345678912345],
    [15, 0.9411221458912399, 941122145891240],
    [15, 9.000000000000046, 9000000000000046],
    [15, 0.5550000000100005, 555000000010001],
    [15, -5, -5000000000000000],
    [15, -7.519901239451877, -7519901239451877],
    [15, -2.987101201010152, -2987101201010152],
    [15, -1.156789056789, -1156789056789000]
])
.test('static FromNumber should return correct number (%#): precision: %f, value: %f, expected norm. value: %f',
    (precision: FixedPrecision, value: number, expectedNormValue: number) =>
    {
        const fixed = Fixed.FromNumber(value, precision);
        expect(fixed.precision).toBe(precision);
        expect(fixed.normalizedValue).toBe(expectedNormValue);
    }
);

each([
    [Fixed.FromNormalized(0, 0), void(0), 0, 0],
    [Fixed.FromNormalized(1, 0), void(0), 0, 1],
    [Fixed.FromNormalized(-1, 0), void(0), 0, -1],
    [Fixed.FromNormalized(5, 0), 0, 0, 5],
    [Fixed.FromNormalized(5, 0), 2, 2, 500],
    [Fixed.FromNormalized(15, 1), void(0), 1, 15],
    [Fixed.FromNormalized(22, 1), 1, 1, 22],
    [Fixed.FromNormalized(5, 1), 0, 0, 1],
    [Fixed.FromNormalized(4, 1), 0, 0, 0],
    [Fixed.FromNormalized(19, 1), 0, 0, 2],
    [Fixed.FromNormalized(-5, 1), 0, 0, 0],
    [Fixed.FromNormalized(-6, 1), 0, 0, -1],
    [Fixed.FromNormalized(26, 1), 5, 5, 260000],
    [Fixed.FromNormalized(157, 2), void(0), 2, 157],
    [Fixed.FromNormalized(226743, 2), 2, 2, 226743],
    [Fixed.FromNormalized(550, 2), 0, 0, 6],
    [Fixed.FromNormalized(149, 2), 0, 0, 1],
    [Fixed.FromNormalized(199, 2), 1, 1, 20],
    [Fixed.FromNormalized(-6, 2), 1, 1, -1],
    [Fixed.FromNormalized(-4, 2), 0, 0, 0],
    [Fixed.FromNormalized(26884, 2), 7, 7, 2688400000],
    [Fixed.FromNormalized(1578, 3), void(0), 3, 1578],
    [Fixed.FromNormalized(2267432, 3), 3, 3, 2267432],
    [Fixed.FromNormalized(5500, 3), 0, 0, 6],
    [Fixed.FromNormalized(1499, 3), 1, 1, 15],
    [Fixed.FromNormalized(1989, 3), 2, 2, 199],
    [Fixed.FromNormalized(-6, 3), 2, 2, -1],
    [Fixed.FromNormalized(-6, 3), 1, 1, 0],
    [Fixed.FromNormalized(-4, 3), 0, 0, 0],
    [Fixed.FromNormalized(26884, 3), 4, 4, 268840],
    [Fixed.FromNormalized(157812349, 8), void(0), 8, 157812349],
    [Fixed.FromNormalized(226743255123, 8), 8, 8, 226743255123],
    [Fixed.FromNormalized(550000000, 8), 0, 0, 6],
    [Fixed.FromNormalized(149999999, 8), 1, 1, 15],
    [Fixed.FromNormalized(198999999, 8), 2, 2, 199],
    [Fixed.FromNormalized(109999999, 8), 3, 3, 1100],
    [Fixed.FromNormalized(198099999, 8), 4, 4, 19810],
    [Fixed.FromNormalized(149990999, 8), 5, 5, 149991],
    [Fixed.FromNormalized(1, 8), 6, 6, 0],
    [Fixed.FromNormalized(123, 8), 7, 7, 12],
    [Fixed.FromNormalized(-6, 8), 7, 7, -1],
    [Fixed.FromNormalized(-49, 8), 6, 6, 0],
    [Fixed.FromNormalized(-501, 8), 5, 5, -1],
    [Fixed.FromNormalized(-5005, 8), 4, 4, -1],
    [Fixed.FromNormalized(-490021, 8), 3, 3, -5],
    [Fixed.FromNormalized(-5000009, 8), 2, 2, -5],
    [Fixed.FromNormalized(-4900005, 8), 1, 1, 0],
    [Fixed.FromNormalized(-50000000, 8), 0, 0, 0],
    [Fixed.FromNormalized(2688412397, 8), 13, 13, 268841239700000],
    [Fixed.FromNormalized(157812349887, 15), void(0), 15, 157812349887],
    [Fixed.FromNormalized(226743255123125, 15), 15, 15, 226743255123125],
    [Fixed.FromNormalized(5500000000000000, 15), 0, 0, 6],
    [Fixed.FromNormalized(1499999999999999, 15), 1, 1, 15],
    [Fixed.FromNormalized(1989999999999999, 15), 2, 2, 199],
    [Fixed.FromNormalized(1099999999999999, 15), 3, 3, 1100],
    [Fixed.FromNormalized(1980999999999999, 15), 4, 4, 19810],
    [Fixed.FromNormalized(1499909999999999, 15), 5, 5, 149991],
    [Fixed.FromNormalized(1000000999999999, 15), 6, 6, 1000001],
    [Fixed.FromNormalized(1000000199999999, 15), 7, 7, 10000002],
    [Fixed.FromNormalized(1000000004999999, 15), 8, 8, 100000000],
    [Fixed.FromNormalized(1000000004999999, 15), 9, 9, 1000000005],
    [Fixed.FromNormalized(1000000000999999, 15), 10, 10, 10000000010],
    [Fixed.FromNormalized(1000000000499999, 15), 11, 11, 100000000050],
    [Fixed.FromNormalized(1000000000004999, 15), 12, 12, 1000000000005],
    [Fixed.FromNormalized(1000000000000999, 15), 13, 13, 10000000000010],
    [Fixed.FromNormalized(1000000000000004, 15), 14, 14, 100000000000000],
    [Fixed.FromNormalized(-6, 15), 14, 14, -1],
    [Fixed.FromNormalized(-49, 15), 12, 12, 0],
    [Fixed.FromNormalized(-501, 15), 10, 10, 0],
    [Fixed.FromNormalized(-500000005, 15), 9, 9, -500],
    [Fixed.FromNormalized(-4900009021, 15), 7, 7, -49],
    [Fixed.FromNormalized(-5000009, 15), 3, 3, 0],
    [Fixed.FromNormalized(-5000009, 15), 2, 2, 0],
    [Fixed.FromNormalized(-4900005, 15), 1, 1, 0],
    [Fixed.FromNormalized(-50000000, 15), 0, 0, 0]
])
.test('static FromFixed should return correct number (%#): source: %o, precision: %f, expected precision: %f, expected norm. value: %f',
    (source: Fixed, precision: FixedPrecision | undefined, expectedPrecision: FixedPrecision, expectedNormValue: number) =>
    {
        const fixed = Fixed.FromFixed(source, precision);
        expect(fixed).not.toBe(source);
        expect(fixed.precision).toBe(expectedPrecision);
        expect(fixed.normalizedValue).toBe(expectedNormValue);
    }
);

test('static Negate should clone and negate',
    () =>
    {
        const value = 100;
        forAllPrecisions(p =>
            {
                const clone = mock<Fixed>({
                    negate() { return this as Fixed; }
                });
                const source = partialMock(Fixed.FromNormalized(value, p), {
                    clone() { return clone.subject; }
                });
                const result = Fixed.Negate(source.subject);

                const cloneMethod = source.getMemberInfo('clone') as IMockedMethodInfo;
                const negateMethod = clone.getMemberInfo('negate') as IMockedMethodInfo;

                expect(result).toBe(clone.subject);
                expect(source.subject.normalizedValue).toBe(value);
                expect(cloneMethod.count).toBe(1);
                expect(negateMethod.count).toBe(1);
            });
    }
);

function assertStaticBinaryOperator<T>(
    methodName: keyof Fixed,
    paramProvider: (p: FixedPrecision) => T,
    invoker: (first: Readonly<Fixed>, second: T) => Fixed):
    void
{
    const value = 100;
    forAllPrecisions(p =>
        {
            const setup: { [k: string]: any } = {};
            setup[methodName] = function(_: T) { return this as Fixed; };

            const clone = mock(setup as Partial<Fixed>);
            const source = partialMock(Fixed.FromNormalized(value, p), {
                clone() { return clone.subject; }
            });
            const param = paramProvider(p);
            const result = invoker(source.subject, param);

            const cloneMethod = source.getMemberInfo('clone') as IMockedMethodInfo;
            const addNumberMethod = clone.getMemberInfo(methodName) as IMockedMethodInfo;

            expect(result).toBe(clone.subject);
            expect(source.subject.normalizedValue).toBe(value);
            expect(cloneMethod.count).toBe(1);
            expect(addNumberMethod.count).toBe(1);
            expect(addNumberMethod.getData(0)!.arguments[0]).toBe(param);
        });
}

test('static Add should clone and add',
    () => assertStaticBinaryOperator('add', p => Fixed.GetEpsilon(p), (a, b) => Fixed.Add(a, b))
);

test('static AddNumber should clone and add',
    () => assertStaticBinaryOperator('addNumber', () => 1, (a, b) => Fixed.AddNumber(a, b))
);

test('static AddNormalized should clone and add',
    () => assertStaticBinaryOperator('addNormalized', () => 1, (a, b) => Fixed.AddNormalized(a, b))
);

test('static Subtract should clone and subtract',
    () => assertStaticBinaryOperator('subtract', p => Fixed.GetEpsilon(p), (a, b) => Fixed.Subtract(a, b))
);

test('static SubtractNumber should clone and subtract',
    () => assertStaticBinaryOperator('subtractNumber', () => 1, (a, b) => Fixed.SubtractNumber(a, b))
);

test('static SubtractNormalized should clone and subtract',
    () => assertStaticBinaryOperator('subtractNormalized', () => 1, (a, b) => Fixed.SubtractNormalized(a, b))
);

test('static Multiply should clone and multiply',
    () => assertStaticBinaryOperator('multiply', p => Fixed.GetEpsilon(p), (a, b) => Fixed.Multiply(a, b))
);

test('static MultiplyByNumber should clone and multiply',
    () => assertStaticBinaryOperator('multiplyByNumber', () => 1, (a, b) => Fixed.MultiplyByNumber(a, b))
);

test('static MultiplyByNormalized should clone and multiply',
    () => assertStaticBinaryOperator('multiplyByNormalized', () => 1, (a, b) => Fixed.MultiplyByNormalized(a, b))
);

test('static Divide should clone and divide',
    () => assertStaticBinaryOperator('divide', p => Fixed.GetEpsilon(p), (a, b) => Fixed.Divide(a, b))
);

test('static DivideByNumber should clone and divide',
    () => assertStaticBinaryOperator('divideByNumber', () => 1, (a, b) => Fixed.DivideByNumber(a, b))
);

test('static DivideByNormalized should clone and divide',
    () => assertStaticBinaryOperator('divideByNormalized', () => 1, (a, b) => Fixed.DivideByNormalized(a, b))
);

test('static Modulo should clone and modulo',
    () => assertStaticBinaryOperator('modulo', p => Fixed.GetEpsilon(p), (a, b) => Fixed.Modulo(a, b))
);

test('static ModuloByNumber should clone and modulo',
    () => assertStaticBinaryOperator('moduloByNumber', () => 1, (a, b) => Fixed.ModuloByNumber(a, b))
);

test('static ModuloByNormalized should clone and modulo',
    () => assertStaticBinaryOperator('moduloByNormalized', () => 1, (a, b) => Fixed.ModuloByNormalized(a, b))
);

each([
    [Fixed.GetMaxValue(0) - 1, true],
    [Fixed.GetMaxValue(0), true],
    [Fixed.GetMaxValue(0) + 1, false],
    [Fixed.GetMinValue(0) + 1, true],
    [Fixed.GetMinValue(0), true],
    [Fixed.GetMinValue(0) - 1, false]
])
.test('isSafe should return correct result (%#): normalized value: %f, expected result: %s',
    (value: number, expected: boolean) =>
    {
        forAllPrecisions(p =>
            {
                const fixed = Fixed.FromNormalized(value, p);
                expect(fixed.isSafe).toBe(expected);
            });
    }
);

each([
    [1, false],
    [0, true],
    [-1, false]
])
.test('isZero should return correct result (%#): normalized value: %f, expected result: %s',
    (value: number, expected: boolean) =>
    {
        forAllPrecisions(p =>
            {
                const fixed = Fixed.FromNormalized(value, p);
                expect(fixed.isZero).toBe(expected);
            });
    }
);

each([
    [1, true],
    [0, false],
    [-1, false]
])
.test('isPositive should return correct result (%#): normalized value: %f, expected result: %s',
    (value: number, expected: boolean) =>
    {
        forAllPrecisions(p =>
            {
                const fixed = Fixed.FromNormalized(value, p);
                expect(fixed.isPositive).toBe(expected);
            });
    }
);

each([
    [1, false],
    [0, false],
    [-1, true]
])
.test('isNegative should return correct result (%#): normalized value: %f, expected result: %s',
    (value: number, expected: boolean) =>
    {
        forAllPrecisions(p =>
            {
                const fixed = Fixed.FromNormalized(value, p);
                expect(fixed.isNegative).toBe(expected);
            });
    }
);

each([
    [0, true],
    [1, true],
    [-1, true],
    [2, true],
    [-2, true],
    [3, true],
    [-3, true],
    [5, true],
    [-5, true],
    [7, true],
    [-7, true],
    [8, true],
    [-8, true],
    [9, true],
    [-9, true],
    [1.1, false],
    [-1.2, false],
    [2.3, false],
    [-2.4, false],
    [3.5, false],
    [-3.6, false],
    [5.7, false],
    [-5.8, false],
    [7.9, false],
    [-7.1, false],
    [8.2, false],
    [-8.3, false]
])
.test('isInteger should return correct result (%#): number: %f, expected result (for precision > 0): %s',
    (value: number, expected: boolean) =>
    {
        forAllPrecisions(p =>
            {
                const fixed = Fixed.FromNumber(value, p);
                expect(fixed.isInteger).toBe(p === 0 || expected);
            });
    }
);

each([
    [0, 0, 0],
    [0, 1, 1],
    [0, -1, -1],
    [0, 123, 123],
    [1, 0, 0],
    [1, 1, 0.1],
    [1, -1, -0.1],
    [1, 10, 1],
    [1, -10, -1],
    [1, 12345, 1234.5],
    [2, 0, 0],
    [2, 1, 0.01],
    [2, -1, -0.01],
    [2, 100, 1],
    [2, -100, -1],
    [2, 12345, 123.45],
    [3, 0, 0],
    [3, 1, 0.001],
    [3, -1, -0.001],
    [3, 1000, 1],
    [3, -1000, -1],
    [3, 12345, 12.345],
    [8, 0, 0],
    [8, 1, 0.00000001],
    [8, -1, -0.00000001],
    [8, 100000000, 1],
    [8, -100000000, -1],
    [8, 123456789, 1.23456789],
    [15, 0, 0],
    [15, 1, 0.000000000000001],
    [15, -1, -0.000000000000001],
    [15, 1000000000000000, 1],
    [15, -1000000000000000, -1],
    [15, 1234567890123456, 1.234567890123456]
])
.test('toNumber should return correct result (%#): precision: %f, norm. value: %f, expected result: %f',
    (precision: FixedPrecision, value: number, expected: number) =>
    {
        const fixed = Fixed.FromNormalized(value, precision);
        const result = fixed.toNumber();
        expect(result).toBeCloseTo(expected, precision);
    }
);

test('toPrecision should return this for the same precision',
    () =>
    {
        forAllPrecisions(p =>
            {
                const fixed = new Fixed(p);
                const result = fixed.toPrecision(p);
                expect(result).toBe(fixed);
            });
    }
);

each([
    [Fixed.FromNormalized(5, 0), 2, 500],
    [Fixed.FromNormalized(5, 1), 0, 1],
    [Fixed.FromNormalized(4, 1), 0, 0],
    [Fixed.FromNormalized(19, 1), 0, 2],
    [Fixed.FromNormalized(-5, 1), 0, 0],
    [Fixed.FromNormalized(-6, 1), 0, -1],
    [Fixed.FromNormalized(26, 1), 5, 260000],
    [Fixed.FromNormalized(550, 2), 0, 6],
    [Fixed.FromNormalized(149, 2), 0, 1],
    [Fixed.FromNormalized(199, 2), 1, 20],
    [Fixed.FromNormalized(-6, 2), 1, -1],
    [Fixed.FromNormalized(-4, 2), 0, 0],
    [Fixed.FromNormalized(26884, 2), 7, 2688400000],
    [Fixed.FromNormalized(5500, 3), 0, 6],
    [Fixed.FromNormalized(1499, 3), 1, 15],
    [Fixed.FromNormalized(1989, 3), 2, 199],
    [Fixed.FromNormalized(-6, 3), 2, -1],
    [Fixed.FromNormalized(-6, 3), 1, 0],
    [Fixed.FromNormalized(-4, 3), 0, 0],
    [Fixed.FromNormalized(26884, 3), 4, 268840],
    [Fixed.FromNormalized(550000000, 8), 0, 6],
    [Fixed.FromNormalized(149999999, 8), 1, 15],
    [Fixed.FromNormalized(198999999, 8), 2, 199],
    [Fixed.FromNormalized(109999999, 8), 3, 1100],
    [Fixed.FromNormalized(198099999, 8), 4, 19810],
    [Fixed.FromNormalized(149990999, 8), 5, 149991],
    [Fixed.FromNormalized(1, 8), 6, 0],
    [Fixed.FromNormalized(123, 8), 7, 12],
    [Fixed.FromNormalized(-6, 8), 7, -1],
    [Fixed.FromNormalized(-49, 8), 6, 0],
    [Fixed.FromNormalized(-501, 8), 5, -1],
    [Fixed.FromNormalized(-5005, 8), 4, -1],
    [Fixed.FromNormalized(-490021, 8), 3, -5],
    [Fixed.FromNormalized(-5000009, 8), 2, -5],
    [Fixed.FromNormalized(-4900005, 8), 1, 0],
    [Fixed.FromNormalized(-50000000, 8), 0, 0],
    [Fixed.FromNormalized(2688412397, 8), 13, 268841239700000],
    [Fixed.FromNormalized(5500000000000000, 15), 0, 6],
    [Fixed.FromNormalized(1499999999999999, 15), 1, 15],
    [Fixed.FromNormalized(1989999999999999, 15), 2, 199],
    [Fixed.FromNormalized(1099999999999999, 15), 3, 1100],
    [Fixed.FromNormalized(1980999999999999, 15), 4, 19810],
    [Fixed.FromNormalized(1499909999999999, 15), 5, 149991],
    [Fixed.FromNormalized(1000000999999999, 15), 6, 1000001],
    [Fixed.FromNormalized(1000000199999999, 15), 7, 10000002],
    [Fixed.FromNormalized(1000000004999999, 15), 8, 100000000],
    [Fixed.FromNormalized(1000000004999999, 15), 9, 1000000005],
    [Fixed.FromNormalized(1000000000999999, 15), 10, 10000000010],
    [Fixed.FromNormalized(1000000000499999, 15), 11, 100000000050],
    [Fixed.FromNormalized(1000000000004999, 15), 12, 1000000000005],
    [Fixed.FromNormalized(1000000000000999, 15), 13, 10000000000010],
    [Fixed.FromNormalized(1000000000000004, 15), 14, 100000000000000],
    [Fixed.FromNormalized(-6, 15), 14, -1],
    [Fixed.FromNormalized(-49, 15), 12, 0],
    [Fixed.FromNormalized(-501, 15), 10, 0],
    [Fixed.FromNormalized(-500000005, 15), 9, -500],
    [Fixed.FromNormalized(-4900009021, 15), 7, -49],
    [Fixed.FromNormalized(-5000009, 15), 3, 0],
    [Fixed.FromNormalized(-5000009, 15), 2, 0],
    [Fixed.FromNormalized(-4900005, 15), 1, 0],
    [Fixed.FromNormalized(-50000000, 15), 0, 0]
])
.test('toPrecision should return correct number (%#): source: %o, precision: %f, expected norm. value: %f',
    (source: Fixed, precision: FixedPrecision, expectedNormValue: number) =>
    {
        const fixed = source.toPrecision(precision);
        expect(fixed).not.toBe(source);
        expect(fixed.precision).toBe(precision);
        expect(fixed.normalizedValue).toBe(expectedNormValue);
    }
);

each([
    [0, 0, '0'],
    [0, 1, '1'],
    [0, -1, '-1'],
    [0, 123, '123'],
    [1, 0, '0.0'],
    [1, 1, '0.1'],
    [1, -1, '-0.1'],
    [1, 10, '1.0'],
    [1, -10, '-1.0'],
    [1, 12345, '1234.5'],
    [2, 0, '0.00'],
    [2, 1, '0.01'],
    [2, -1, '-0.01'],
    [2, 100, '1.00'],
    [2, -100, '-1.00'],
    [2, 12345, '123.45'],
    [3, 0, '0.000'],
    [3, 1, '0.001'],
    [3, -1, '-0.001'],
    [3, 1000, '1.000'],
    [3, -1000, '-1.000'],
    [3, 12345, '12.345'],
    [8, 0, '0.00000000'],
    [8, 1, '0.00000001'],
    [8, -1, '-0.00000001'],
    [8, 100000000, '1.00000000'],
    [8, -100000000, '-1.00000000'],
    [8, 123456789, '1.23456789'],
    [15, 0, '0.000000000000000'],
    [15, 1, '0.000000000000001'],
    [15, -1, '-0.000000000000001'],
    [15, 1000000000000000, '1.000000000000000'],
    [15, -1000000000000000, '-1.000000000000000'],
    [15, 1234567890123456, '1.234567890123456']
])
.test('toString should return correct result (%#): precision: %f, norm. value: %f, expected result: %s',
    (precision: FixedPrecision, value: number, expected: string) =>
    {
        const fixed = Fixed.FromNormalized(value, precision);
        const result = fixed.toString();
        expect(result).toBe(expected);
    }
);

each([
    [0],
    [1],
    [-1],
    [10],
    [123456],
    [-252124113],
    [12720761210243]
])
.test('clone should return correct result (%#): norm. value: %f',
    (value: number) =>
    {
        forAllPrecisions(p =>
            {
                const fixed = Fixed.FromNormalized(value, p);
                const result = fixed.clone();
                expect(result).not.toBe(fixed);
                expect(result.precision).toBe(fixed.precision);
                expect(result.normalizedValue).toBe(fixed.normalizedValue);
            });
    }
);

// assign

// add

// subtract

// multiply

// divide

// modulo

// equals

// compare to
