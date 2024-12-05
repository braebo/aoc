import { getInput, print, visualize } from 'utils'
const input = await getInput('2024/d4')

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
			if (mat[x][y] === 'X') {
				check([x, y])
			}
		}
	}

	function check(cell: Point) {
		for (let i = 0; i < directions.length; i++) {
			const dir = directions[i]
			const [success, cells] = test(cell, dir, 1)
			if (success) {
				found++
				if (import.meta.main) words.push(cells)
			}
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

	visualize(mat, words, found)

	return 0
}

export const solutions = { answer }

if (import.meta.main) print(solutions)
