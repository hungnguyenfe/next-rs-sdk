import { ColumnTypeEnum, SdkOperator } from '@/shared/types/sdk.ts'
import { isArray } from 'lodash'
import { isDateString, isNumber, isString } from '@/shared/helpers/validate.ts'
import { getExpression } from '@/shared/helpers/expression.ts'

export interface OperatorOption {
	label: string
	value: SdkOperator
	validate?: (value: unknown, columnType: ColumnTypeEnum) => boolean
}

export const equalOperator: OperatorOption = {
	label: 'Equal',
	value: SdkOperator.Equal,
}

export const notEqualOperator: OperatorOption = {
	label: 'Not equal',
	value: SdkOperator.NotEqual,
}

export const greaterOperator: OperatorOption = {
	label: 'Greater than',
	value: SdkOperator.Greater,
}

export const greaterOrEqualOperator: OperatorOption = {
	label: 'Greater or equal',
	value: SdkOperator.GreaterEqual,
}

export const lessOperator: OperatorOption = {
	label: 'Lower than',
	value: SdkOperator.Less,
}

export const lessOrEqualOperator: OperatorOption = {
	label: 'Lower or equal',
	value: SdkOperator.LessEqual,
}

export const isTrueOperator: OperatorOption = {
	label: 'Is True',
	value: SdkOperator.IsTrue,
}

export const isFalseOperator: OperatorOption = {
	label: 'Is False',
	value: SdkOperator.IsFalse,
}

export const isEmptyOperator: OperatorOption = {
	label: 'Is empty',
	value: SdkOperator.IsEmpty,
}

export const isNotEmptyOperator: OperatorOption = {
	label: 'Is not empty',
	value: SdkOperator.IsNotEmpty,
}

export const isNullOperator: OperatorOption = {
	label: 'Is null',
	value: SdkOperator.IsNull,
}

export const isNotNullOperator: OperatorOption = {
	label: 'Is not null',
	value: SdkOperator.IsNotNull,
}

export const containsOperator: OperatorOption = {
	label: 'Contains',
	value: SdkOperator.Contains,
}

export const notContainsOperator: OperatorOption = {
	label: 'Not contain',
	value: SdkOperator.NotContains,
}

export const startsWithOperator: OperatorOption = {
	label: 'Starts with',
	value: SdkOperator.StartsWith,
}

export const notStartWithOperator: OperatorOption = {
	label: 'Not start with',
	value: SdkOperator.NotStartWidth,
}

export const endsWithOperator: OperatorOption = {
	label: 'Ends with',
	value: SdkOperator.EndsWith,
}

export const notEndWithOperator: OperatorOption = {
	label: 'Not end with',
	value: SdkOperator.NotEndWidth,
}

export const inRangeOperator: OperatorOption = {
	label: 'In range',
	value: SdkOperator.InRange,
	validate: (value, columnType) => {
		if (!isArray(value) || value.length !== 2) return false
		switch (columnType) {
			case ColumnTypeEnum.Number:
				return value.every((v) => isNumber(v))
			case ColumnTypeEnum.Date:
			case ColumnTypeEnum.DateTime:
				return (
					value.every((v) => isDateString(v)) ||
					!!getExpression(value as [string, string])
				)
			default:
				return false
		}
	},
}

export const inOperator: OperatorOption = {
	label: 'In',
	value: SdkOperator.In,
	validate: (value, columnType) => {
		if (!isArray(value)) return false
		switch (columnType) {
			case ColumnTypeEnum.Number:
				return value.every((v) => isNumber(v))
			case ColumnTypeEnum.Text:
				return value.every((v) => isString(v))
			default:
				return false
		}
	},
}

export const notInOperator: OperatorOption = {
	label: 'Not in',
	value: SdkOperator.NotIn,
	validate: (value, columnType) => {
		if (!isArray(value)) return false
		switch (columnType) {
			case ColumnTypeEnum.Number:
				return value.every((v) => isNumber(v))
			case ColumnTypeEnum.Text:
				return value.every((v) => isString(v))
			default:
				return false
		}
	},
}
