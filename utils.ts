import { join } from 'jsr:@std/path'

export async function getInput(relative_path: string) {
	return await Deno.readTextFile(
		join(import.meta.dirname!, 'problems', relative_path, 'input.txt'),
	)
}

export const CONSOLE_COLOR_CODES = {
	reset: '\x1b[0m',
	// Foreground colors
	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	gray: '\x1b[90m',
	// Background colors
	bgBlack: '\x1b[40m',
	bgRed: '\x1b[41m',
	bgGreen: '\x1b[42m',
	bgYellow: '\x1b[43m',
	bgBlue: '\x1b[44m',
	bgMagenta: '\x1b[45m',
	bgCyan: '\x1b[46m',
	bgWhite: '\x1b[47m',
	// Styles
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	italic: '\x1b[3m',
	underline: '\x1b[4m',
} as const

// Simple hex to RGB conversion
const hexToRgb = (hex: string): [number, number, number] | null => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result
		? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
		: null
}

// Function to create hex color
export const hex =
	(hexColor: string) =>
	(str: unknown): string => {
		const rgb = hexToRgb(hexColor)
		if (!rgb) return str as string
		return `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m${str}\x1b[0m`
	}

export const color = (colorName: keyof typeof CONSOLE_COLOR_CODES) => (str: unknown) =>
	`${CONSOLE_COLOR_CODES[colorName]}${str}${CONSOLE_COLOR_CODES.reset}`

export const reset = color('reset')
export const black = color('black')
export const red = color('red')
export const green = color('green')
export const yellow = color('yellow')
export const blue = color('blue')
export const magenta = color('magenta')
export const cyan = color('cyan')
export const white = color('white')
export const gray = color('gray')
export const bgBlack = color('bgBlack')
export const bgRed = color('bgRed')
export const bgGreen = color('bgGreen')
export const bgYellow = color('bgYellow')
export const bgBlue = color('bgBlue')
export const bgMagenta = color('bgMagenta')
export const bgCyan = color('bgCyan')
export const bgWhite = color('bgWhite')
export const bold = color('bold')
export const dim = color('dim')
export const italic = color('italic')
export const underline = color('underline')

/** Shorthand for `console.log`. */
export const l = console.log
export const n = () => console.log('')

/** Shorthand for `red`. */
export const r = color('red')
/** Shorthand for `green`. */
export const g = color('green')
/** Shorthand for `yellow`. */
export const y = color('yellow')
/** Shorthand for `blue`. */
export const b = color('blue')
/** Shorthand for `magenta`. */
export const m = color('magenta')
/** Shorthand for `cyan`. */
export const c = color('cyan')
/** Shorthand for `dim`. */
export const d = color('dim')
/** Shorthand for `orange`. */
export const o = hex('#ff7f50')
/** Shorthand for `purple`. */
export const p = hex('#800080')

export const print = (solutions: Record<string, () => unknown>) =>
	Object.fromEntries(Object.entries(solutions).map(([key, fn]) => [key, fn()]))

export function start(decimals = 1) {
	const start = performance.now()

	return () => {
		const number = performance.now() - start
		const string = fmtTime(number, { decimals })
		return { number, string }
	}
}

export function fmtTime(n: number, options?: { decimals?: number }): string {
	const { decimals = n > 1 ? 1 : 2 } = options ?? {}

	if (n < 10) {
		return removeTrailingZeroes(getBestPrecision(n)) + dim('ms')
	} else {
		return removeTrailingZeroes((n / 1000).toFixed(decimals)) + dim('s')
	}

	function removeTrailingZeroes(str: string): string {
		return str.replace(/\.?0+$/, '')
	}

	function getBestPrecision(ms: number) {
		for (let decimals = 1; decimals <= 10; decimals++) {
			const value = ms.toFixed(decimals)
			if (value.at(-1) !== '0') {
				return value
			}
		}
		return ms.toString() // Just in case...
	}
}

/**
 * Prints a nice output where each cell's brightness is increased based on the number of
 * matches it's included in.  Only called when running this script directly.
 */
export function visualize(mat: string[][], words: [number, number][][], found: number) {
	const brightness: number[][] = Array(mat.length)
		.fill(0)
		.map(() => Array(mat[0].length).fill(0))

	for (const word of words) {
		for (const [x, y] of word) {
			brightness[x][y]++
		}
	}

	for (let x = 0; x < mat.length; x++) {
		for (let y = 0; y < mat[0].length; y++) {
			const b = brightness[x][y]
			const colorCode = b === 0 ? 235 : Math.min(245 + b * 5, 255)
			mat[x][y] = `\x1b[38;5;18${colorCode}m${mat[x][y]}\x1b[0m`
			// Brightest are bold.
			if (b >= 3) mat[x][y] = `\x1b[1m${mat[x][y]}\x1b[0m`
		}
	}

	console.log(mat.map(r => r.join('')).join('\n'))
	console.log(found, 'XMAS found')
}
