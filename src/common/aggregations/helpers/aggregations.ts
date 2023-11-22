import {
	ColumnTypeEnum,
	SdkAggregationType,
	SdkElementColumnConfig,
} from '@/shared/types/sdk.ts'

const CountAggregation = { label: 'Count', value: SdkAggregationType.COUNT }
const MinAggregation = { label: 'Min', value: SdkAggregationType.MIN }
const MaxAggregation = { label: 'Max', value: SdkAggregationType.MAX }
const SummaryAggregation = { label: 'Summary', value: SdkAggregationType.SUM }
const ConcatAggregation = { label: 'Concat', value: SdkAggregationType.CONCAT }
const DistinctAggregation = {
	label: 'Distinct',
	value: SdkAggregationType.DISTINCT,
}
const AverageAggregation = {
	label: 'Average',
	value: SdkAggregationType.AVERAGE,
}

export const TextAggregations = [
	DistinctAggregation,
	CountAggregation,
	MinAggregation,
	MaxAggregation,
	ConcatAggregation,
]

export const NumberAggregations = [
	DistinctAggregation,
	CountAggregation,
	SummaryAggregation,
	AverageAggregation,
	MinAggregation,
	MaxAggregation,
]

export const DateAggregations = [
	DistinctAggregation,
	CountAggregation,
	MinAggregation,
	MaxAggregation,
]

export const BooleanAggregations = [DistinctAggregation, CountAggregation]

export const getListAggregations = (column: SdkElementColumnConfig) => {
	switch (column.type) {
		case ColumnTypeEnum.Number:
			return NumberAggregations
		case ColumnTypeEnum.Boolean:
			return BooleanAggregations
		case ColumnTypeEnum.Date:
			return DateAggregations
		default:
			return TextAggregations
	}
}

export const getDefaultAggregation = (
	column: SdkElementColumnConfig,
	aggregation?: SdkAggregationType,
) => {
	const list = getListAggregations(column)
	const aggr = list.find((a) => a.value === aggregation)
	return aggr && aggregation ? aggregation : list[0].value
}
