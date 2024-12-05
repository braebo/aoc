import { getInput, print } from 'utils'
const input = await getInput('2024/d3')

function answer() {
	let total = 0

	const valid = /(?:mul\((\d{1,3}),(\d{1,3})\))/gm
	const invalid = /don't\(\).*?do\(\)/gms

	for (const m of input.replace(invalid, '').matchAll(valid)) {
		total += +m[1] * +m[2]
	}

	return total
}

function friend() {
	return input
		.matchAll(/mul\((\d+),(\d+)\)/g)
		.filter(({ index }) => {
			const current = `do()${input.slice(0, index)}`
			return current.lastIndexOf("don't()") < current.lastIndexOf('do()')
		})
		.map(([, a, b]) => Number.parseInt(a) * Number.parseInt(b))
		.reduce((a, x) => a + x, 0)
}

function allInOne() {
	return input
		.matchAll(/(?<=(?:(?:do\(\))|^)(?:(?!don't\(\)).)*)mul\((\d+),(\d+)\)/gs)
		.map(([, a, b]) => Number.parseInt(a) * Number.parseInt(b))
		.reduce((a, x) => a + x, 0)
}

export const solutions = { answer, friend, allInOne }

if (import.meta.main) print(solutions)
