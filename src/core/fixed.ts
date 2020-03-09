import { FixedPrecision } from './fixed-precision';

type FixedMetadata =
{
    readonly precision: FixedPrecision;
    readonly offset: number;
    readonly maxValue: number;
    readonly minValue: number;
};

function createFixedMetadata(): FixedMetadata[]
{
    const maxValue = Math.pow(2, 52) + (Math.pow(2, 52) - 1);
    const result: FixedMetadata[] = [];
    let offset = 1;

    for (let precision = 0; precision <= 15; ++precision)
    {
        result.push({
            precision: precision as FixedPrecision,
            offset: offset,
            maxValue: Math.trunc(maxValue / offset),
            minValue: -Math.trunc(maxValue / offset)
        });
        offset *= 10;
    }
    return result;
}

const FIXED_METADATA: FixedMetadata[] = createFixedMetadata();
const ZEROES: string = Array(16).join('0');

function incrPrecisionCast(value: number, current: FixedMetadata, target: FixedMetadata): number
{
    return value * (target.offset / current.offset);
}

function decrPrecisionCast(value: number, current: FixedMetadata, target: FixedMetadata): number
{
    return Math.round(value / (current.offset / target.offset));
}

function precisionCast(value: number, current: FixedMetadata, target: FixedMetadata): number
{
    return target.precision > current.precision ?
        incrPrecisionCast(value, current, target) :
        decrPrecisionCast(value, current, target);
}

function fixedCast(current: Readonly<Fixed>, target: Readonly<Fixed>): number
{
    return current.precision === target.precision ?
        current.normalizedValue :
        precisionCast(current.normalizedValue, FIXED_METADATA[current.precision], FIXED_METADATA[target.precision]);
}

function numberCast(value: number, target: FixedMetadata): number
{
    return Math.round(value * target.offset);
}

/** Represents a fixed-point number. */
export class Fixed
{
    /**
     * Returns max safe value representable by a fixed-point number with the provided `precision`.
     * @param precision precision of the max value
     * @returns max safe value
     */
    public static GetMaxValue(precision: FixedPrecision): number
    {
        return FIXED_METADATA[precision].maxValue;
    }

    /**
     * Returns min safe value representable by a fixed-point number with the provided `precision`.
     * @param precision precision of the min value
     * @returns min safe value
     */
    public static GetMinValue(precision: FixedPrecision): number
    {
        return FIXED_METADATA[precision].minValue;
    }

    /**
     * Returns the smallest possible fixed-point number with the provided `precision`.
     * @param precision precision of the smallest number
     * @returns smallest number
     */
    public static GetEpsilon(precision: FixedPrecision): Fixed
    {
        const result = new Fixed(precision);
        result._normalizedValue = 1;
        return result;
    }

    /**
     * Creates a fixed-point number with both precision and value equal to `0`.
     * @returns new empty fixed-point number
     */
    public static GetEmpty(): Fixed
    {
        return new Fixed(0);
    }

    /**
     * Creates a fixed-point number from the provided `normalizedValue` and with the provided `precision`.
     * @param normalizedValue number's normalized value
     * @param precision number's precision
     * @returns new fixed-point number
     */
    public static FromNormalized(normalizedValue: number, precision: FixedPrecision): Fixed
    {
        return new Fixed(precision)
            .assignNormalized(normalizedValue);
    }

    /**
     * Creates a fixed-point number from the provided `value` and with the provided `precision`.
     * @param value number's value
     * @param precision number's precision
     * @returns new fixed-point number
     */
    public static FromNumber(value: number, precision: FixedPrecision): Fixed
    {
        return new Fixed(precision)
            .assignNumber(value);
    }

    /**
     * Creates a fixed-point number from the provided `fixed` object and with the provided `precision`.
     * @param fixed fixed-point number to copy
     * @param precision optional number's precision - if not provided, then the precision of the `fixed` object will be used
     * @returns new fixed-point number
     */
    public static FromFixed(fixed: Readonly<Fixed>, precision?: FixedPrecision): Fixed
    {
        return new Fixed(precision !== void(0) ? precision : fixed.precision)
            .assign(fixed);
    }

    /**
     * Swaps a fixed-point number's sign.
     * @param fixed fixed-point number to swap sign for
     * @returns new fixed-point number
     */
    public static Negate(fixed: Readonly<Fixed>): Fixed
    {
        return fixed.clone().negate();
    }

    /**
     * Adds a fixed-point number to another fixed-point number.
     * @param first fixed-point number to add to
     * @param second fixed-point number to add
     * @returns new fixed-point number with the `first` parameter's precision
     */
    public static Add(first: Readonly<Fixed>, second: Readonly<Fixed>): Fixed
    {
        return first.clone().add(second);
    }

    /**
     * Adds a floating-point number to a fixed-point number.
     * @param first fixed-point number to add to
     * @param second floating-point number to add
     * @returns new fixed-point number
     */
    public static AddNumber(first: Readonly<Fixed>, second: number): Fixed
    {
        return first.clone().addNumber(second);
    }

    /**
     * Adds a normalized value to a fixed-point number.
     * @param first fixed-point number to add to
     * @param second normalized value to add
     * @returns new fixed-point number
     */
    public static AddNormalized(first: Readonly<Fixed>, second: number): Fixed
    {
        return first.clone().addNormalized(second);
    }

    /**
     * Subtracts a fixed-point number from another fixed-point number.
     * @param first fixed-point number to subtract from
     * @param second fixed-point number to subtract
     * @returns new fixed-point number with the `first` parameter's precision
     */
    public static Subtract(first: Readonly<Fixed>, second: Readonly<Fixed>): Fixed
    {
        return first.clone().subtract(second);
    }

    /**
     * Subtracts a floating-point number from a fixed-point number.
     * @param first fixed-point number to subtract from
     * @param second floating-point number to subtract
     * @returns new fixed-point number
     */
    public static SubtractNumber(first: Readonly<Fixed>, second: number): Fixed
    {
        return first.clone().subtractNumber(second);
    }

    /**
     * Subtracts a normalized value from a fixed-point number.
     * @param first fixed-point number to subtract from
     * @param second normalized value to subtract
     * @returns new fixed-point number
     */
    public static SubtractNormalized(first: Readonly<Fixed>, second: number): Fixed
    {
        return first.clone().subtractNormalized(second);
    }

    /**
     * Multiplies a fixed-point number by another fixed-point number.
     * @param first fixed-point number to multiply
     * @param second fixed-point number to multiply by
     * @returns new fixed-point number with the `first` parameter's precision
     */
    public static Multiply(first: Readonly<Fixed>, second: Readonly<Fixed>): Fixed
    {
        return first.clone().multiply(second);
    }

    /**
     * Multiplies a fixed-point number by a floating-point number.
     * @param first fixed-point number to multiply
     * @param second floating-point number to multiply by
     * @returns new fixed-point number
     */
    public static MultiplyByNumber(first: Readonly<Fixed>, second: number): Fixed
    {
        return first.clone().multiplyByNumber(second);
    }

    /**
     * Multiplies a fixed-point number by a normalized value.
     * @param first fixed-point number to multiply
     * @param second normalized value to multiply by
     * @returns new fixed-point number
     */
    public static MultiplyByNormalized(first: Readonly<Fixed>, second: number): Fixed
    {
        return first.clone().multiplyByNormalized(second);
    }

    /**
     * Divides a fixed-point number by another fixed-point number.
     * @param first fixed-point number to divide
     * @param second fixed-point number to divide by
     * @returns new fixed-point number with the `first` parameter's precision
     */
    public static Divide(first: Readonly<Fixed>, second: Readonly<Fixed>): Fixed
    {
        return first.clone().divide(second);
    }

    /**
     * Divides a fixed-point number by a floating-point number.
     * @param first fixed-point number to divide
     * @param second floating-point number to divide by
     * @returns new fixed-point number
     */
    public static DivideByNumber(first: Readonly<Fixed>, second: number): Fixed
    {
        return first.clone().divideByNumber(second);
    }

    /**
     * Divides a fixed-point number by a normalized value.
     * @param first fixed-point number to divide
     * @param second normalized value to divide by
     * @returns new fixed-point number
     */
    public static DivideByNormalized(first: Readonly<Fixed>, second: number): Fixed
    {
        return first.clone().divideByNormalized(second);
    }

    /**
     * Calculates the remainder of a fixed-point number division by another fixed-point number.
     * @param first fixed-point number to modulo
     * @param second fixed-point number to modulo by
     * @returns new fixed-point number with the `first` parameter's precision
     */
    public static Modulo(first: Readonly<Fixed>, second: Readonly<Fixed>): Fixed
    {
        return first.clone().modulo(second);
    }

    /**
     * Calculates the remainder of a fixed-point number division by a floating-point number.
     * @param first fixed-point number to modulo
     * @param second floating-point number to modulo by
     * @returns new fixed-point number
     */
    public static ModuloByNumber(first: Readonly<Fixed>, second: number): Fixed
    {
        return first.clone().moduloByNumber(second);
    }

    /**
     * Calculates the remainder of a fixed-point number division by a normalized value.
     * @param first fixed-point number to modulo
     * @param second normalized value to modulo by
     * @returns new fixed-point number
     */
    public static ModuloByNormalized(first: Readonly<Fixed>, second: number): Fixed
    {
        return first.clone().moduloByNormalized(second);
    }

    /**
     * Specifies a fixed-point number's normalized value, that is an integer,
     * that, along with a number's precision, encodes its value.
     * Number's real value can be decoded by simply dividing its normalized value by `10^precision`.
     */
    public get normalizedValue(): number
    {
        return this._normalizedValue;
    }

    /**
     * Specifies whether or not a fixed-point number is considered safe.
     * The number is considered safe only if its value isn't greater than the max safe value
     * and isn't less than the min safe value for its precision.
     */
    public get isSafe(): boolean
    {
        return this._normalizedValue >= FIXED_METADATA[0].minValue && this._normalizedValue <= FIXED_METADATA[0].maxValue;
    }

    /**
     * Specifies whether or not a fixed-point number represents NaN (not a number).
     */
    public get isNaN(): boolean
    {
        return isNaN(this._normalizedValue);
    }

    /**
     * Specifies whether or not a fixed-point number represents an infinity.
     */
    public get isInfinity(): boolean
    {
        return !isFinite(this._normalizedValue) && !this.isNaN;
    }

    /**
     * Specifies whether or not a fixed-point number represents 0.
     */
    public get isZero(): boolean
    {
        return this._normalizedValue === 0;
    }

    /**
     * Specifies whether or not a fixed-point number represents a value greater than 0.
     */
    public get isPositive(): boolean
    {
        return this._normalizedValue > 0;
    }

    /**
     * Specifies whether or not a fixed-point number represents a value less than 0.
     */
    public get isNegative(): boolean
    {
        return this._normalizedValue < 0;
    }

    /**
     * Specifies whether or not a fixed-point number represents an integer.
     */
    public get isInteger(): boolean
    {
        return this.normalizedValue % this._metadata.offset === 0;
    }

    private get _metadata(): FixedMetadata
    {
        return FIXED_METADATA[this.precision];
    }

    /**
     * Represents fixed-point number's decimal precision.
     */
    public readonly precision: FixedPrecision;

    private _normalizedValue: number;

    /**
     * Creates a new fixed-point number representing 0.
     * @param precision number's precision
     */
    public constructor(precision: FixedPrecision)
    {
        this.precision = precision;
        this._normalizedValue = 0;
    }

    /**
     * Returns a number that is roughly equal to a fixed-point number.
     * @returns floating-point number roughly equal to this fixed-point number
     */
    public toNumber(): number
    {
        return this._normalizedValue / this._metadata.offset;
    }

    /**
     * Casts a fixed-point number to a different `precision`.
     * @param precision precision to cast to
     * @returns `this`, if the `precision` parameter is equal to this fixed-point number's precision, otherwise a new fixed-point number
     */
    public toPrecision(precision: FixedPrecision): Fixed
    {
        if (this.precision === precision)
            return this;

        const result = new Fixed(precision);
        return result._assign(precisionCast(this._normalizedValue, this._metadata, result._metadata));
    }

    /**
     * Returns a string representation of a fixed-point number.
     * @returns a string representation of this fixed-point number
     */
    public toString(): string
    {
        if (this.precision === 0)
            return this._normalizedValue.toString();

        const integer = Math.abs(Math.trunc(this._normalizedValue / this._metadata.offset)).toString();
        const fraction = Math.abs(this._normalizedValue % this._metadata.offset).toString();

        if (this.isNegative)
        {
            return fraction.length < this.precision ?
            `-${integer}.${ZEROES.substring(0, this.precision - fraction.length)}${fraction}` :
            `-${integer}.${fraction}`;
        }
        return fraction.length < this.precision ?
            `${integer}.${ZEROES.substring(0, this.precision - fraction.length)}${fraction}` :
            `${integer}.${fraction}`;
    }

    /**
     * Returns a clone of a fixed-point number.
     * @returns a new fixed-point number with the same value and precision
     */
    public clone(): Fixed
    {
        const result = new Fixed(this.precision);
        result._normalizedValue = this._normalizedValue;
        return result;
    }

    /**
     * Assigns a fixed-point number.
     * @param other fixed-point number to assign
     * @returns `this`
     */
    public assign(other: Readonly<Fixed>): this
    {
        return this._assign(fixedCast(other, this));
    }

    /**
     * Assigns a floating-point number.
     * @param value floating-point number to assign
     * @returns `this`
     */
    public assignNumber(value: number): this
    {
        return this._assign(numberCast(value, this._metadata));
    }

    /**
     * Assigns a normalized value.
     * @param value normalized value to assign
     * @returns `this`
     */
    public assignNormalized(value: number): this
    {
        return this._assign(Math.trunc(value));
    }

    /**
     * Swaps fixed-point number's sign.
     * @returns `this`
     */
    public negate(): this
    {
        return this._assign(-this._normalizedValue);
    }

    /**
     * Adds a fixed-point number.
     * @param other fixed-point number to add
     * @returns `this`
     */
    public add(other: Readonly<Fixed>): this
    {
        return this._add(fixedCast(other, this));
    }

    /**
     * Adds a floating-point number.
     * @param value floating-point number to add
     * @returns `this`
     */
    public addNumber(value: number): this
    {
        return this._add(numberCast(value, this._metadata));
    }

    /**
     * Adds a normalized value.
     * @param value normalized value to add
     * @returns `this`
     */
    public addNormalized(value: number): this
    {
        return this._add(Math.trunc(value));
    }

    /**
     * Subtracts a fixed-point number.
     * @param other fixed-point number to subtract
     * @returns `this`
     */
    public subtract(other: Readonly<Fixed>): this
    {
        return this._sub(fixedCast(other, this));
    }

    /**
     * Subtracts a floating-point number.
     * @param value floating-point number to subtract
     * @returns `this`
     */
    public subtractNumber(value: number): this
    {
        return this._sub(numberCast(value, this._metadata));
    }

    /**
     * Subtracts a normalized value.
     * @param value normalized value to subtract
     * @returns `this`
     */
    public subtractNormalized(value: number): this
    {
        return this._sub(Math.trunc(value));
    }

    /**
     * Multiplies by a fixed-point number.
     * @param other fixed-point number to multiply by
     * @returns `this`
     */
    public multiply(other: Readonly<Fixed>): this
    {
        return this._mul(other.normalizedValue, FIXED_METADATA[other.precision]);
    }

    /**
     * Multiplies by a floating-point number.
     * @param value floating-point number to multiply by
     * @returns `this`
     */
    public multiplyByNumber(value: number): this
    {
        return this._mulN(value);
    }

    /**
     * Multiplies by a normalized value.
     * @param value normalized value to multiply by
     * @returns `this`
     */
    public multiplyByNormalized(value: number): this
    {
        return this._mul(Math.trunc(value), this._metadata);
    }

    /**
     * Divides by a fixed-point number.
     * @param other fixed-point number to divide by
     * @returns `this`
     */
    public divide(other: Readonly<Fixed>): this
    {
        return this._div(other.normalizedValue, FIXED_METADATA[other.precision]);
    }

    /**
     * Divides by a floating-point number.
     * @param value floating-point number to divide by
     * @returns `this`
     */
    public divideByNumber(value: number): this
    {
        return this._divN(value);
    }

    /**
     * Divides by a normalized value.
     * @param value normalized value to divide by
     * @returns `this`
     */
    public divideByNormalized(value: number): this
    {
        return this._div(Math.trunc(value), this._metadata);
    }

    /**
     * Calculates a division by a fixed-point number remainder.
     * @param other fixed-point number to modulo by
     * @returns `this`
     */
    public modulo(other: Readonly<Fixed>): this
    {
        return this.precision === other.precision ?
            this._mod(other.normalizedValue) :
            this._modN(other.normalizedValue / FIXED_METADATA[other.precision].offset);
    }

    /**
     * Calculates a division by a floating-point number remainder.
     * @param value floating-point number to modulo by
     * @returns `this`
     */
    public moduloByNumber(value: number): this
    {
        return this._modN(value);
    }

    /**
     * Calculates a division by a normalized value remainder.
     * @param value normalized value to modulo by
     * @returns `this`
     */
    public moduloByNormalized(value: number): this
    {
        return this._mod(Math.trunc(value));
    }

    /**
     * Checks whether or not `other` is considered equal to `this`.
     * @param other fixed-point number to check for equality
     * @returns `true`, if both numbers are considered equal, otherwise `false`
     */
    public equals(other: Readonly<Fixed>): boolean
    {
        if (this.precision === other.precision)
            return this._normalizedValue === other.normalizedValue;

        return this.precision > other.precision ?
            this._normalizedValue === incrPrecisionCast(other.normalizedValue, FIXED_METADATA[other.precision], this._metadata) :
            incrPrecisionCast(this._normalizedValue, this._metadata, FIXED_METADATA[other.precision]) === other.normalizedValue;
    }

    /**
     * Compares `other` to `this`.
     * @param other fixed-point number to compare to
     * @returns `0`, if both numbers are considered equal,
     * `> 0`, if `this` is considered greater than `other`
     * and `< 0`, if `this` is considered less than `other`
     */
    public compareTo(other: Readonly<Fixed>): number
    {
        if (this.precision === other.precision)
            return this._normalizedValue - other.normalizedValue;

        return this.precision > other.precision ?
            this._normalizedValue - incrPrecisionCast(other.normalizedValue, FIXED_METADATA[other.precision], this._metadata) :
            incrPrecisionCast(this._normalizedValue, this._metadata, FIXED_METADATA[other.precision]) - other.normalizedValue;
    }

    private _assign(normalized: number): this
    {
        this._normalizedValue = normalized === -0 ? 0 : normalized;
        return this;
    }

    private _add(normalized: number): this
    {
        const result = this._normalizedValue + normalized;
        return this._assign(result);
    }

    private _sub(normalized: number): this
    {
        const result = this._normalizedValue - normalized;
        return this._assign(result);
    }

    private _mul(normalized: number, metadata: FixedMetadata): this
    {
        const result = Math.round((this._normalizedValue * normalized) / metadata.offset);
        return this._assign(result);
    }

    private _mulN(value: number): this
    {
        const result = Math.round(this._normalizedValue * value);
        return this._assign(result);
    }

    private _div(normalized: number, metadata: FixedMetadata): this
    {
        const result = numberCast(this._normalizedValue / normalized, metadata);
        return this._assign(result);
    }

    private _divN(value: number): this
    {
        const result = Math.round(this._normalizedValue / value);
        return this._assign(result);
    }

    private _mod(normalized: number): this
    {
        const result = this._normalizedValue % normalized;
        return this._assign(result);
    }

    private _modN(value: number): this
    {
        const result = Math.round(((this._normalizedValue / value) % this._metadata.offset) * value);
        return this._assign(result);
    }
}

export namespace FixedMath
{
    export function Min(first: Readonly<Fixed>, second: Readonly<Fixed>): Fixed
    {
        return (first.compareTo(second) < 0 ? first : second).clone();
    }

    export function Max(first: Readonly<Fixed>, second: Readonly<Fixed>): Fixed
    {
        return (first.compareTo(second) > 0 ? first : second).clone();
    }

    export function Abs(fixed: Readonly<Fixed>): Fixed
    {
        return fixed.normalizedValue >= 0 ? fixed.clone() : Fixed.Negate(fixed);
    }

    export function Truncate(fixed: Readonly<Fixed>): Fixed
    {
        const remainder = fixed.normalizedValue % FIXED_METADATA[fixed.precision].offset;
        return Fixed.FromNormalized(fixed.normalizedValue - remainder, fixed.precision);
    }

    export function Fractional(fixed: Readonly<Fixed>): Fixed
    {
        return Fixed.ModuloByNormalized(fixed, FIXED_METADATA[fixed.precision].offset);
    }

    export function Round(fixed: Readonly<Fixed>, precision: FixedPrecision): Fixed
    {
        if (precision >= fixed.precision)
            return fixed.clone();

        const metadata = FIXED_METADATA[fixed.precision - precision];
        const remainder = fixed.normalizedValue % metadata.offset;
        let midpointOffset: number = 0;
        if (remainder < 0)
        {
            if (remainder <= -(metadata.offset / 2))
                midpointOffset = -1 * metadata.offset;
        }
        else if (remainder >= (metadata.offset / 2))
            midpointOffset = 1 * metadata.offset;

        return Fixed.FromNormalized(fixed.normalizedValue - remainder + midpointOffset, fixed.precision);
    }

    export function Ceil(fixed: Readonly<Fixed>): Fixed
    {
        const remainder = fixed.normalizedValue % FIXED_METADATA[fixed.precision].offset;
        if (remainder === 0)
            return fixed.clone();

        const result = Fixed.FromNormalized(fixed.normalizedValue - remainder, fixed.precision);
        return fixed.isPositive ? result.addNumber(1) : result;
    }

    export function Floor(fixed: Readonly<Fixed>): Fixed
    {
        const remainder = fixed.normalizedValue % FIXED_METADATA[fixed.precision].offset;
        if (remainder === 0)
            return fixed.clone();

        const result = Fixed.FromNormalized(fixed.normalizedValue - remainder, fixed.precision);
        return fixed.isPositive ? result : result.subtractNumber(1);
    }

    export function Sign(fixed: Readonly<Fixed>): number
    {
        return Math.sign(fixed.normalizedValue);
    }

    export function Random(precision: FixedPrecision): Fixed
    {
        return Fixed.FromNormalized(Math.random() * FIXED_METADATA[precision].maxValue, precision);
    }

    export function Sum(collection: ReadonlyArray<Readonly<Fixed>>, precision?: FixedPrecision): Fixed
    {
        if (collection.length === 0)
            return Fixed.FromNormalized(0, precision || 0);

        const result = Fixed.FromFixed(collection[0], precision);
        for (let i = 1; i < collection.length; ++i)
            result.add(collection[i]);

        return result;
    }
}
