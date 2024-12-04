import { getInput } from 'utils'
export const input = await getInput('2024/d2')

const reports = input.split('\n').map(line => line.split(' ').map(Number))

export function main() {
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

if (import.meta.main) console.log({ answer: main(), pookie: null })
