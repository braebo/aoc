import { assertEquals } from 'jsr:@std/assert'
import { isSafe } from './index.ts'

const testCases: [report: number[], safe: boolean][] = [
	[[1, 2, 7, 8, 9], false],
	[[9, 7, 6, 2, 1], false],
	[[7, 6, 4, 2, 1], true],
	[[1, 3, 2, 4, 5], true],
	[[8, 6, 4, 4, 1], true],
	[[1, 3, 6, 7, 9], true],
	[[48, 46, 47, 49, 51, 54, 56], true],
	[[1, 1, 2, 3, 4, 5], true],
	[[1, 2, 3, 4, 5, 5], true],
	[[5, 1, 2, 3, 4, 5], true],
	[[1, 4, 3, 2, 1], true],
	[[1, 6, 7, 8, 9], true],
	[[1, 2, 3, 4, 3], true],
	[[9, 8, 7, 6, 7], true],
	[[7, 10, 8, 10, 11], true],
	[[29, 28, 27, 25, 26, 25, 22, 20], true],
]

let i = 0
for (const [report, expected] of testCases) {
	i++
	const res = isSafe(report)
	Deno.test(`isSafe(${i}): ${res}`, () => {
		assertEquals(res, expected)
	})
}
