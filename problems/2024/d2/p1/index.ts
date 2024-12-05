import { getInput, print } from 'utils'
export const input = await getInput('2024/d2')

function answer() {
	const reports = input.split('\n').map(line => line.split(' ').map(Number))

	let safe = 0

	check: for (let i = 0; i < reports.length; i++) {
		const report = reports[i]
		const direction = Math.sign(report[1] - report[0])

		for (let j = 0; j < report.length; j++) {
			const next = +report[j + 1]
			if (isNaN(next)) continue
			const curr = report[j]

			const diff = (next - curr) * direction

			if (diff < 1) continue check
			if (diff > 3) continue check
		}

		safe++
	}

	return safe
}

function friend() {
	let safe = 0

	for (const line of input.split('\n')) {
		const report = line.split(' ').map(n => Number.parseInt(n))
		const type = Math.sign(report.at(0)! - report.at(-1)!)

		const is_safe = report.every(
			(n, i, a) =>
				i == 0 || (Math.sign(a[i - 1] - n) === type && Math.abs(a[i - 1] - n) <= 3),
		)

		if (is_safe) {
			safe++
		}
	}

	return safe
}

export const solutions = { answer, friend }

if (import.meta.main) print(solutions)
