import { isMatch, isValid } from 'date-fns'
import isArray from 'lodash/isArray'

export const isNumber = (value: unknown): value is number =>
	typeof value === 'number' && ![NaN].includes(value)

export const isString = (value: unknown): value is string =>
	typeof value === 'string'

export const isDateString = (
	value: unknown,
	format?: string | string[],
): value is string => {
	if (!isString(value)) return false
	if (!format) return isValid(new Date(value))
	return isArray(format)
		? format.some((f) => isMatch(value, f))
		: isMatch(value, format)
}

export const isEmpty = (value: unknown | unknown[]) =>
	isArray(value) ? value.every((v) => !v && v !== 0) : !value && value !== 0
