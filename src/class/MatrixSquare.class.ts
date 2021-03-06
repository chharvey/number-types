import * as xjs from 'extrajs'

import Vector from './Vector.class'
import Matrix from './Matrix.class'


/**
 * A MatrixSquare, a Square Matrix, is a {@link Matrix} whose rows and columns are equal in number.
 *
 * A **Square Matrix Space** is a matrix space whose row dimension and column dimension are equal.
 *
 * - Matrices in a Square Matrix Space are closed under multiplication:
 * 	For matrices `a` and `b` of dimension *N×N*,
 * 	the expression `ab` is guaranteed to also be a matrix of dimension *N×N*.
 * - A Square Matrix Space has a (unique) multiplicative identity:
 * 	There exists a matrix `1` such that for every matrix `a`,
 * 	`a1`, and `1a` are guaranteed to equal `a`, and
 * 	`1` is the only matrix with this property.
 * - Matrices in a Square Matrix Space have a (unique) multiplicative absorber:
 * 	A unique matrix `0` is guaranteed such that for every matrix `a`, `a0 === 0a === 0`.
 * 	(In a Square Matrix Space, the multiplicative absorber and the additive identity are one in the same.)
 * - Non-zero Matrices in a Square Matrix Space have (unique) multiplicative inverses:
 * 	For every matrix `a !== 0` (where `0` is the multiplicative absorber),
 * 	a unique matrix `a^` is guaranteed such that `aa^ === a^a === 1`
 * 	(where `1` is the multiplicative identity).
 */
export default class MatrixSquare extends Matrix {
	/**
	 * Return a new multiplicative identity Matrix object by specifying its size.
	 *
	 * The returned matrix’s cells will all be 0,
	 * except for the cells in the main diagonal, which will all be 1.
	 * @param   size the number of rows and columns in the Matrix (its size)
	 */
	static multIden(size: bigint = 0n): MatrixSquare {
		const nsize: number = Number(size);
		return new MatrixSquare(Array.from(new Array(nsize), (_row, i) => Array.from(new Array(nsize), (_cell, j) => (i === j) ? 1 : 0)));
	}


	/**
	 * Construct a new MatrixSquare object.
	 * @param   data a Matrix, an array of Vectors, or array of arrays of finite numbers
	 */
	constructor(data: Matrix|readonly (Vector|number[])[] = []) {
		let rawdata: readonly number[][] = (data instanceof Matrix) ?
			data.raw.map((row) => [...row]) : // each row must be a full Array
			data.map((row) => (row instanceof Vector) ? [...row.raw] : row) // each row must be a full Array
		rawdata.forEach((row) => {
			row.length = rawdata.length // add extra `undefined`s (if less) or removes extra entries (if more)
			row = xjs.Array.fillHoles(row, 0)
		})
		super(rawdata)
	}

	/**
	 * The transposition of a square matrix is always a square matrix.
	 * @override Matrix
	 */
	get transposition(): MatrixSquare {
		return super.transposition as MatrixSquare
	}

	/**
	 * Get this matrix’s size, the number of rows and columns in this matrix.
	 * @returns `this.height` or `this.width` — they are equal
	 */
	get size(): bigint {
		return this.height
	}

	/**
	 * Get the determinant of this MatrixSquare.
	 * @returns the determinant of this MatrixSquare
	 * @throws  {TypeError} if this MatrixSquare is empty
	 */
	get det(): number {
		if (this.size === 0n) {
			throw new TypeError('Determinant of an empty matrix is undefined.');
		};
		if (this.size === 1n) {
			return this.at(0n, 0n);
		};
		return this._DATA[0].map((cell, j) =>
			((j % 2 === 0) ? 1 : -1) * cell * this.minor(0n, BigInt(j)).det
		).reduce((a, b) => a + b)
	}

	/**
	 * Get the reciprocal of this MatrixSquare.
	 *
	 * The reciprocal of a MatrixSquare is its multiplicative inverse:
	 * the MatrixSquare that when multiplied to this, gives a product of 1 (the multiplicative identity).
	 * @returns a new MatrixSquare representing the multiplicative inverse
	 * @throws  {TypeError} if this MatrixSquare is empty
	 * @throws  {TypeError} if the determinant of this MatrixSquare is 0
	 */
	get reciprocal(): MatrixSquare {
		if (this.det === 0) throw new TypeError('A matrix whose determinant is 0 has no reciprocal.')
		return (
			(this.size === 0n) ? new MatrixSquare() :
			(this.size === 1n) ? new MatrixSquare([[1 / this.det]]) :
			new MatrixSquare(this._DATA.map((row, i) =>
				row.map((_cell, j) => (((i + j) % 2 === 0) ? 1 : -1) * this.transposition.minor(BigInt(i), BigInt(j)).det) // NB transposed on purpose; see <http://mathworld.wolfram.com/MatrixInverse.html>
			)).scale(1 / this.det)
		);
	}

	/**
	 * The minor of a square matrix is always a square matrix.
	 * @override Matrix
	 */
	minor(row: bigint, col: bigint): MatrixSquare {
		return new MatrixSquare(super.minor(row, col))
	}

	/**
	 * Scaling a square matrix always yields a square matrix.
	 * @override Matrix
	 */
	scale(scalar: number = 1): MatrixSquare {
		return new MatrixSquare(super.scale(scalar))
	}

	/**
	 * Multiplying two square matrices always yields a square matrix.
	 * @override Matrix
	 */
	times(multiplier: Matrix|number[][]): MatrixSquare {
		return new MatrixSquare(super.times(multiplier))
	}
}
