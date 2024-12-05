import { select, isCancel, cancel, intro } from 'npm:@clack/prompts'
import { l, o, d, bold, g, start } from 'utils'

interface Solution {
	name: string
	result: unknown
	time: { number: number; string: string }
}

interface Option {
	value: string
	label: string
	hint?: string
}

let last_selected = '2024/d1/p1'
let bench_runs = 2000

const problems: Option[] = [{ value: 'all', label: 'Run All' }]

for await (const day of Deno.readDir('problems/2024')) {
	if (!day.isDirectory || !day.name.startsWith('d')) continue

	for await (const part of Deno.readDir(`problems/2024/${day.name}`)) {
		if (!part.isDirectory || !part.name.startsWith('p')) continue

		problems.push({
			value: `problems/2024/${day.name}/${part.name}`,
			label: `2024 Day ${day.name.slice(1)} Part ${part.name.slice(1)}`,
		})
	}
}

problems.push({ value: 'options', label: 'Options' })

const nl = `\n${d('|')}`
l('')
intro(`🎄${nl + nl} Pick a problem to run 🎅`)

await optionsPrompt()

async function optionsPrompt() {
	bench_runs = (await select({
		message: 'Benchmark runs?',
		initialValue: 2000,
		options: [
			{ value: 1, label: '1' },
			{ value: 200, label: '200' },
			{ value: 2000, label: '2,000' },
			{ value: 20000, label: '20,000' },
		],
	})) as number

	if (isCancel(bench_runs)) {
		cancel()
		Deno.exit(0)
	}

	await mainPrompt()
}

async function mainPrompt() {
	const problem = (await select({
		message: '',
		options: problems.sort((a, b) => a.value.localeCompare(b.value)),
		initialValue: last_selected,
	})) as Option['value']

	if (isCancel(problem)) {
		cancel()
		Deno.exit(0)
	}

	if (problem === 'options') {
		await optionsPrompt()
		return
	}

	last_selected = problems.find(p => p.value === problem)!.value

	if (problem === 'all') {
		for (const problem of problems) {
			if (['all', 'options'].includes(problem.value)) continue

			logDay(problem.value)

			await runProblemModule(problems.findIndex(p => p.value === problem.value))
		}
	} else {
		await runProblemModule(problems.findIndex(p => p.value === problem))
	}

	await mainPrompt()
}

async function runProblemModule(index: number) {
	const problem = problems[index]
	const solutions = (await import(`./${problem.value}/index.ts`)).solutions

	// Get results and timings for all solutions sequentially
	const results = [] as Solution[]
	for (const [name, fn] of Object.entries(solutions)) {
		results.push({
			name,
			result: await (fn as () => Promise<unknown>)(),
			time: await bench(fn as () => Promise<number>),
		})
	}

	const slowest = results.reduce((a, b) => (a.time.number > b.time.number ? a : b))

	for (const { name, result, time } of results) {
		const log = [d(`│  ${name}`), '·', o(result), '·', time.string]

		if (name !== slowest.name && results.length > 1) {
			const ratio = slowest.time.number / time.number

			if (!isNaN(ratio) && ratio !== Infinity) {
				const t = ratio.toFixed(2)
				if (t === '1.00') return
				log.push(g(d(t + 'x')))
			}
		}

		l(...log)
	}
}

async function bench(fn: () => Promise<number>) {
	if (!fn) return { number: NaN, string: '' }

	const end = start(2)
	for (let i = 0; i < bench_runs; i++) await fn()

	return end()
}

function logDay(str: string) {
	l(d('|'))
	const [day, part] = str.match(/d(\d+)\/p(\d+)/)!.slice(1)
	// prettier-ignore
	l(
		d('│'),
		`D` + bold(day),
		part === '1'
			? `P` + bold(part)
			: `P` + bold(part),
	)
}
