# FRL TypeScript arithmetic

[![Build Status](https://travis-ci.com/CalionVarduk/ts-arithmetic.png?branch=master)](https://travis-ci.com/CalionVarduk/ts-arithmetic)
[![Coverage Status](https://coveralls.io/repos/github/CalionVarduk/ts-arithmetic/badge.svg)](https://coveralls.io/github/CalionVarduk/ts-arithmetic)
[![npm version](https://badge.fury.io/js/frl-ts-arithmetic.svg)](https://www.npmjs.com/package/frl-ts-arithmetic)
[![Dependency status](https://david-dm.org/CalionVarduk/ts-arithmetic/status.svg)](https://david-dm.org/CalionVarduk/ts-arithmetic)
[![Dev Dependency Status](https://david-dm.org/CalionVarduk/ts-arithmetic/dev-status.svg)](https://david-dm.org/CalionVarduk/ts-arithmetic?type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/CalionVarduk/ts-arithmetic/blob/master/LICENSE)

This project contains a lightweight fixed-point number arithmetic.

## A. Installation

If you are using `npm`, then simply run the `npm install frl-ts-arithmetic` CLI command to get the latest version.

If you are using `yarn`, then go with the `yarn add frl-ts-arithmetic` command.

## B. Fixed-point numbers

[Fixed](https://github.com/CalionVarduk/ts-arithmetic/blob/develop/src/fixed.ts#L63) class represents a [fixed-point number](https://en.wikipedia.org/wiki/Fixed-point_arithmetic). It allows to perform calculations in a fixed-point arithmetic.

The `Fixed` class contains all basic mathematical operations, such as `add`, `subtract`, `multiply`, `divide` and `modulo`. Let's check out a few examples:
```typescript
// creates a new fixed-point number with a precision of 2 fractional, decimal digits
// equal to 0
const fixed = new Fixed(2);

// adds another fixed-point number that represents
// a value of 3.4, with a precision of 4 fractional, decimal digits
// after this operation, our 'fixed' variable will be equal to 3.4
// or, to be a bit closer to how the number is actually stored, 340/100
fixed.add(Fixed.FromNumber(3.4, 4));

// subtracts another fixed-point number
// after this operation, 'fixed' variable will be equal to 1.15
// or 115/100
fixed.subtract(Fixed.FromNumber(2.25, 2));

// multiplies by another fixed-point number
// after this operation, 'fixed' variable will be equal to 13.23
// or 1323/100
// note, that the real result is actually 1.15 * 11.5 = 13.225
// however, since 'fixed' has a precision of 2, it has to round the result
fixed.multiply(Fixed.FromNumber(11.5, 1));

// divides by another fixed-point number
// after this operation, 'fixed' variable will be equal to 26.46
// or 2646/100
fixed.divide(Fixed.FromNumber(0.5, 1));

// calculates a remainder from a division by another fixed-point number
// after this operation, 'fixed' variable will be equal to 1.46
// or 146/100
fixed.modulo(Fixed.FromNumer(2.5, 2));
```

As you can see, fixed-point arithmetic doesn't save you from rounding errors (which will become very apparent after using multiplication, division and modulo operations a few times), however it behaves as if it actually performs calculations in base 10 arithmetic, which can save you quite a few headaches, when dealing with stuff like that:
```typescript
// floating-point arithmeric
let value = 0.1;
value += 0.2;

// returns false
const result = value === 0.3;

// fixed-point arithmetic
let fixedValue = Fixed.FromNumber(0.1, 1).addNumber(0.2);

// returns true
const fixedResult = fixedValue.equals(Fixed.FromNumber(0.3, 1));
```

This is one of the biggest advantages of the fixed-point arithmetic performed by the `Fixed` class over the floating-point arithmetic performed by the `number` type. It can be very useful, when dealing with e.g. currencies.

As hinted by the previous example, most operations have their `[x]Number` (e.g. `addNumber`) versions, which allow to pass a `number` as a parameter, instead of another `Fixed`-type object. Additionally, most operations have `[x]Normalized` (e.g. `addNormalized`) versions, which allow to pass a normalized `number` value as a parameter. In the case of the `Fixed` class, normalized means a raw value, which won't be converted because of the fixed-point number's precision. For example:
```typescript
// represents a 1.23 value
// or, more specifically, 12300/10000
const fixed = Fixed.FromNumber(1.23, 4);

// returns 12300
const norm = fixed.normalizedValue;

// adds 7 as a normalized value
// since 'fixed' variable's precision is 4
// then that 7 will actually represent a number equal to 0.0007
// after this operation, 'fixed' variable will be equal to 1.2307
// or 12307/10000
fixed.addNormalized(7);
```

`Fixed` also contains methods, that allow to compare values, like `equals` (which simply returns a `boolean` result) or `compareTo` (which returns a `number` result, `< 0` means, that the number is less than the parameter, `> 0` means, that the number is greater than the parameter and `=== 0` means, that the number is equal to the parameter).

It's also possible to convert a `Fixed` object to `number`, by simply calling the `toNumber` method. You can also perform a precision-cast by calling the `toPrecision` method, with a precision parameter of your choice, however, if you always need a new object, then call the static `Fixed.FromFixed` method instead, since `toPrecision` returns `this`, if the precision parameter is equal to the callee's precision.

Also, keep in mind, that `Fixed` object's have a limited range of safe values. Unlike `number`, which is implemented as a double precision floating-point number and has a max value equal to about `10^308`, the `Fixed` has a max safe value of `10^53 / 10^precision`, where allowed `precision` is in range `[0, 15]`. `Fixed` doesn't validate any overflow for the sake of efficiency, so it's up to you to decide when and how to check the value's correctness - `isSafe` property can help with that.

## C. Fixed-point math helpers

[FixedMath](https://github.com/CalionVarduk/ts-arithmetic/blob/develop/src/fixed.ts#L756) namespace contains a few helpful fixed-point arithmetic functions, such as:

- `Min` - returns the lowest value out of the two provided fixed-point numbers.
- `Max` - returns the highest value out of the two provided fixed-point numbers.
- `Abs` - returns an absolute value of the provided fixed-point number.
- `Truncate` - returns an integral part of the provided fixed-point number.
- `Fractional` - returns a fractional part of the provided fixed-point number.
- `Round` - rounds a fixed-point number to the provided precision.
- `Ceil` - returns a ceiling function result.
- `Floor` - returns a floor function result.
- `Sign` - returns `1`, if the provided fixed-point number is greater than 0, `-1`, if the provided number is less than 0, or `0`, if the provided number is equal to 0.
- `Random` - generates a random fixed-point number with the provided precision.
- `Sum` - performs a sum operation on the provided fixed-point numbers collection.
