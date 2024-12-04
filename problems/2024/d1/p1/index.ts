import { getInput } from 'utils'
export const input = await getInput('2024/d1')

export function main() {
	let answer = 0

	const rows = input.split('\n')
	const count = rows.length

	const left_arr: number[] = []
	const right_arr: number[] = []

	for (let i = 0; i < count; i++) {
		const [left, right] = rows[i].split('   ')
		left_arr.push(+left)
		right_arr.push(+right)
	}

	const left = left_arr.sort((a, b) => a - b)
	const right = right_arr.sort((a, b) => a - b)

	for (let i = 0; i < count; i++) {
		answer += Math.abs(left[i] - right[i])
	}

	return answer
}

export function pookie() {
	function getColumn(input: string, regex: RegExp) {
		return input
			.match(regex)!
			.map(n => Number.parseInt(n))
			.sort((a, b) => b - a)
	}

	const left = getColumn(input, /^\d+/gm)
	const right = getColumn(input, /\d+$/gm)

	let total = 0

	for (let i = 0; i < left.length; i++) {
		total += Math.abs(left[i] - right[i])
	}

	return total
}

if (import.meta.main) console.log({ answer: main(), pookie: pookie() })
