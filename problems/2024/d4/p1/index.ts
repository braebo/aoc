import { getInput, print } from 'utils'
export const input = await getInput('2024/d4')

type Point = [x: number, y: number]
type Direction = [x: number, y: number]

function answer() {
	const mat = input.split('\n').map(line => [...line]) as string[][]

	const sequence = ['X', 'M', 'A', 'S']
	const directions: Point[] = [
		[-1, 0], // ↑
		[1, 0], // ↓
		[0, -1], // ←
		[0, 1], // →
		[-1, -1], // ↖️
		[-1, 1], // ↗️
		[1, -1], // ↙️
		[1, 1], // ↘
	]
	const rows = mat.length
	const cols = mat[0].length

	let found = 0
	const words: Point[][] = []

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			const pos: Point = [x, y]
			const char = mat[x][y]

			if (char === 'X') {
				check(pos)
			}
		}
	}

	prettyPrint(mat, words, found)

	function check(cell: Point) {
		for (let i = 0; i < directions.length; i++) {
			const dir = directions[i]
			const [success, cells] = test(cell, dir, 1)
			if (success) {
				found++
				if (import.meta.main) words.push(cells)
			}
		}

		function test(p: Point, d: Direction, i: number, cells: Point[] = [p]): [boolean, Point[]] {
			if (i >= sequence.length) return [true, cells]

			const x = p[0] + d[0]
			const y = p[1] + d[1]

			if (mat[x]?.[y] === sequence[i]) {
				if (import.meta.main) cells.push([x, y])
				return test([x, y], d, i + 1, cells)
			}

			return [false, cells]
		}
	}

	return 0
}

/**
 * Prints a nice output where each cell's brightness is increased based on the number of
 * matches it's included in.  Only called when running this script directly.
 */
function prettyPrint(mat: string[][], words: Point[][], found: number) {
	const brightness: number[][] = Array(mat.length)
		.fill(0)
		.map(() => Array(mat[0].length).fill(0))

	for (const word of words) {
		for (const [x, y] of word) {
			brightness[x][y]++
		}
	}

	for (let x = 0; x < mat.length; x++) {
		for (let y = 0; y < mat[0].length; y++) {
			const b = brightness[x][y]
			const colorCode = b === 0 ? 235 : Math.min(240 + b * 5, 255)
			mat[x][y] = `\x1b[38;5;${colorCode}m${mat[x][y]}\x1b[0m`
			// Brightest are bold.
			if (b >= 3) mat[x][y] = `\x1b[1m${mat[x][y]}\x1b[0m`
		}
	}

	console.log(mat.map(r => r.join('')).join('\n'))
	console.log(found, 'XMAS found')
}

export const solutions = { answer }

if (import.meta.main) print(solutions)
