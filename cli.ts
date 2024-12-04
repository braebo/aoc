import { select, isCancel, cancel, intro } from 'npm:@clack/prompts'
import { l, o, d, bold, g, c } from './utils.ts'

interface Problem {
	value: string
	label: string
	hint?: string
}

let last_selected = '2024/d1/p1'

const problems: Problem[] = [{ value: 'all', label: 'All' }]

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

const nl = `\n${d('|')}`
l('')
intro(`🎄${nl + nl} Pick a problem to run 🎅`)

async function prompt() {
	const problem = (await select({
		message: '',
		options: problems.sort((a, b) => a.value.localeCompare(b.value)),
		initialValue: last_selected,
	})) as Problem['value']

	if (isCancel(problem)) {
		cancel()
		Deno.exit(0)
	}

	last_selected = problems.find(p => p.value === problem)!.value

	if (problem === 'all') {
		for (const problem of problems) {
			if (problem.value === 'all') continue

			logDay(problem.value)

			await runProblemModule(problems.findIndex(p => p.value === problem.value))
		}
	} else {
		await runProblemModule(problems.findIndex(p => p.value === problem))
	}

	await prompt()
}

async function runProblemModule(index: number) {
	const problem = problems[index]

	const m = await import(`./${problem.value}/index.ts`)
	const a = { result: await m.main(), time: await bench(m.main) }
	const p = { result: await m.pookie?.(), time: await bench(m.pookie) }

	const al = [d('│  answer'), '·', o(a.result), '·', c((a.time / 1000).toFixed(2)) + d('s')]

	let pr = d('null')
	let pt = d('null')

	if (p.result) {
		pr = o(p.result)
		pt = c((p.time / 1000).toFixed(2)) + d('s')
	}
	const pl = [d('│  pookie'), '·', pr, '·', pt]

	const fastest = a.time < p!.time ? 'answer' : 'pookie'

	if (fastest === 'answer') {
		const ratio = p.time / a.time
		if (!isNaN(ratio)) {
			al.push('·', g(`${ratio.toFixed(2)}${d('x')} faster`))
		}
	} else {
		const ratio = a.time / p.time
		if (!isNaN(ratio) && ratio !== Infinity) {
			pl.push('·', g(`${ratio.toFixed(2)}${d('x')} faster`))
		}
	}

	l(...al)
	l(...pl)
}

// Not used anymore, but was annoying to figure out... so I'm leaving it for reference.
// deno-lint-ignore no-unused-vars
async function runProblemCmd(index: number) {
	const problem = problems[index]

	const command = new Deno.Command('deno', {
		args: ['run', '--allow-read', '--allow-run', problem.value + '/index.ts'],
	})

	const { code, stdout, stderr } = await command.output()

	const out = new TextDecoder().decode(stdout)
	const err = new TextDecoder().decode(stderr)

	if (code !== 0) {
		console.error('Error:', err)
	} else {
		try {
			const answer = out.match(/answer\s*:\s*(\d+)/)?.[1]
			const pookie = out.match(/pookie\s*:\s*(\d+)/)?.[1]
			l(d('│   answer'), '·', o(answer))
			l(d('│   pookie'), '·', o(pookie))
		} catch {
			l(out)
		}
	}
}

await prompt()

async function bench(fn: () => Promise<number> | null) {
	if (!fn) return null as unknown as number // lol

	const start = performance.now()
	for (let i = 0; i < 2000; i++) await fn()
	const end = performance.now()

	return end - start
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
