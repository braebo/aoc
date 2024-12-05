import { getInput, print, visualize } from 'utils'
const input = await getInput('2024/d4')

type Point = [x: number, y: number]

function answer() {
	let found = 0

	const matrix = input.split('\n').map(line => [...line])
	const directions = [
		[
			[-1, -1],
			[1, 1],
		],
		[
			[-1, 1],
			[1, -1],
		],
	] // [↖️, ↘, ↗️, ↙️]
	const rows = matrix.length
	const cols = matrix[0].length
	const cells: Point[][] = [] // for visualizer only

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			check: if (matrix[x][y] === 'A') {
				for (const corner of directions) {
					const [x1, y1] = corner[0]
					const corner1 = matrix[x + x1]?.[y + y1]

					if (!corner1 || !['M', 'S'].includes(corner1)) break check

					const opposite = corner1 === 'M' ? 'S' : 'M'
					if (!opposite) break check

					const [x2, y2] = corner[1]
					if (matrix[x + x2]?.[y + y2] !== opposite) break check

					// save cells for the visualizer
					if (import.meta.main) {
						const [[x1, y1], [x2, y2]] = [corner[0], corner[1]]
						cells.push([
							[x, y],
							[x + x1, y + y1],
							[x + x2, y + y2],
						])
					}
				}

				found++
			}
		}
	}

	if (import.meta.main) visualize(matrix, cells, found)

	return found
}

export const solutions = { answer }

if (import.meta.main) print(solutions)
