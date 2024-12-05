import { getInput, print } from 'utils'
const input = await getInput('2024/d3')

function answer() {
	let total = 0

	const regex = /(?:mul\((\d{1,3}),(\d{1,3})\))/gm
	for (const m of input.matchAll(regex)) {
		total += +m[1] * +m[2]
	}

	return total
}

function friend() {
	return input
		.matchAll(/mul\((\d+),(\d+)\)/g)
		.map(([, a, b]) => Number.parseInt(a) * Number.parseInt(b))
		.reduce((a, x) => a + x, 0)
}

export const solutions = { answer, friend }

if (import.meta.main) print(solutions)
