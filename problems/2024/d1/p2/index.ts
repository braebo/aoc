import { getInput, print } from 'utils'
export const input = await getInput('2024/d1')

function answer() {
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

	for (let i = 0; i < count; i++) {
		const found = right_arr.filter(arr => arr === left_arr[i]).length
		answer += found * left_arr[i]
	}

	return answer
}

function friend() {
	const left = getColumn(input, /^\d+/gm)
	const right = getColumn(input, /\d+$/gm)

	let similarity = 0

	for (const number of left) {
		similarity += number * right.filter(n => n == number).length
	}

	return similarity
}

function getColumn(input: string, regex: RegExp) {
	return input.match(regex)!.map(n => Number.parseInt(n))
}

export const solutions = { answer, friend }

if (import.meta.main) print(solutions)
