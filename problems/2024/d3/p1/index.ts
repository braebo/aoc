import { getInput } from 'utils'
export const input = await getInput('2024/d3')

export function main() {
	let total = 0

	const regex = /(?:mul\((\d{1,3}),(\d{1,3})\))/gm
	for (const m of input.matchAll(regex)) {
		total += +m[1] * +m[2]
	}

	return total
}

if (import.meta.main) console.log({ answer: main(), pookie: null })