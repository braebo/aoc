import { getInput } from 'utils'
export const input = (await getInput('2024/d2'))
	.split('\n')
	.map(line => line.split(' ').map(Number))

export function main(reports = input) {
	let total = 0

	for (const report of reports) {
		if (isSafe(report)) total++
	}

	return total
}

/**
 * Checks if a report is safe.
 * @param report - The report to check.
 * @param damp - Whether the dampener has already been used once on the report.
 * @returns Whether the report is safe with one level removed (at most).
 */
export function isSafe(report: number[], damp = false): boolean {
	const direction = getDirection(report)

	for (let i = 0; i < report.length - 1; i++) {
		const diff = (report[i + 1] - report[i]) * -direction

		if (diff < 1 || diff > 3) {
			// If the dampener has already been used, it's a wrap.
			if (damp) return false

			// If it's the last level and we haven't dampened yet, we're all good.
			if (typeof report[i + 1] === 'undefined') return true

			// Re-test with the current or next levels removed.
			if (isSafe(report.toSpliced(i, 1), true)) return true
			if (isSafe(report.toSpliced(i + 1, 1), true)) return true

			return false
		}
	}

	return true
}

/**
 * Get's the cumulative array direction in order to handle cases where a removed level results
 * in a different direction, i.e. `5 1 7 9`, where 5 -> 1 decends, but removing 1 results in an
 * ascending array.
 */
function getDirection(arr: number[]) {
	let change = 0
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i + 1] === 'undefined') break
		change += arr[i] - arr[i + 1]
	}
	return Math.sign(change) as 1 | -1
}

if (import.meta.main) console.log({ answer: main(), pookie: null })
