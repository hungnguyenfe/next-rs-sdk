import {
	endOfDay,
	endOfMonth,
	endOfYear,
	formatISO,
	startOfDay,
	startOfMonth,
	startOfYear,
	subDays,
	subMonths,
	subYears,
} from 'date-fns'

type Expression = {
	text: string
	rawValue: [string, string]
	value: () => void
	parseValues: () => [string, string]
}

export const expressions = (
	onClick: (e: [string, string]) => void,
): Expression[] => [
	{
		text: 'Today',
		parseValues: () => [
			formatISO(startOfDay(new Date())),
			formatISO(endOfDay(new Date())),
		],
		rawValue: ['start_today', 'end_today'],
		value: () => {
			onClick(['start_today', 'end_today'])
		},
	},
	{
		text: 'Yesterday',
		parseValues: () => [
			formatISO(startOfDay(subDays(new Date(), 1))),
			formatISO(endOfDay(subDays(new Date(), 1))),
		],
		rawValue: ['start_yesterday', 'end_yesterday'],
		value: () => {
			onClick(['start_yesterday', 'end_yesterday'])
		},
	},
	{
		text: 'Last 7 Days',
		parseValues: () => [
			formatISO(startOfDay(subDays(new Date(), 7))),
			formatISO(endOfDay(subDays(new Date(), 1))),
		],
		rawValue: ['start_last_7_days', 'end_last_7_days'],
		value: () => {
			onClick(['start_last_7_days', 'end_last_7_days'])
		},
	},
	{
		text: 'This month',
		parseValues: () => [
			formatISO(startOfMonth(new Date())),
			formatISO(endOfMonth(new Date())),
		],
		rawValue: ['start_this_month', 'end_this_month'],
		value: () => {
			onClick(['start_this_month', 'end_this_month'])
		},
	},
	{
		text: 'Last month',
		parseValues: () => [
			formatISO(startOfMonth(subMonths(new Date(), 1))),
			formatISO(endOfMonth(subMonths(new Date(), 1))),
		],
		rawValue: ['start_last_month', 'end_last_month'],
		value: () => {
			onClick(['start_last_month', 'end_last_month'])
		},
	},
	{
		text: 'This year',
		parseValues: () => [
			formatISO(startOfYear(new Date())),
			formatISO(endOfYear(new Date())),
		],
		rawValue: ['start_this_year', 'end_this_year'],
		value: () => {
			onClick(['start_this_year', 'end_this_year'])
		},
	},
	{
		text: 'Last year',
		parseValues: () => [
			formatISO(startOfYear(subYears(new Date(), 1))),
			formatISO(endOfYear(subYears(new Date(), 1))),
		],
		rawValue: ['start_last_year', 'end_last_year'],
		value: () => {
			onClick(['start_last_year', 'end_last_year'])
		},
	},
]

export const getExpression = (value: [string, string]) => {
	return expressions(() => {}).find(
		(e) => e.rawValue.toString() === value.toString(),
	)
}
