import {
	ColumnTypeEnum,
	SdkElementColumnConfig,
	SdkFilterBuilderConfig,
	SdkOperator,
} from '@/shared/types/sdk.ts'
import { computed, Ref } from 'vue'
import { TreeItem } from '@/core/filter-builder/SdkFilterWrapper.vue'
import {
	containsOperator,
	endsWithOperator,
	equalOperator,
	greaterOperator,
	greaterOrEqualOperator,
	inOperator,
	inRangeOperator,
	isEmptyOperator,
	isFalseOperator,
	isNotEmptyOperator,
	isNotNullOperator,
	isNullOperator,
	isTrueOperator,
	lessOperator,
	lessOrEqualOperator,
	notContainsOperator,
	notEndWithOperator,
	notEqualOperator,
	notInOperator,
	notStartWithOperator,
	startsWithOperator,
} from '@/core/filter-builder/helpers/operators.ts'
import SdkFilterNoValueInput from '@/core/filter-builder/components/specials/SdkFilterNoValueInput.vue'
import SdkFilterNumberInput from '@/core/filter-builder/components/simple/SdkFilterNumberInput.vue'
import SdkFilterTextInput from '@/core/filter-builder/components/simple/SdkFilterTextInput.vue'
import SdkFilterDateInput from '@/core/filter-builder/components/simple/SdkFilterDateInput.vue'
import SdkFilterSelectInput from '@/core/filter-builder/components/simple/SdkFilterSelectInput.vue'
import SdkFilterInInputs from '@/core/filter-builder/components/ranges/SdkFilterInInputs.vue'

export const useFilters = (
	node: Ref<TreeItem>,
	columns: Ref<SdkElementColumnConfig[]>,
	config: Ref<SdkFilterBuilderConfig>,
) => {
	// selected column
	const column = computed(() =>
		columns.value.find((col) => col.name === node.value.data.column),
	)
	// selected operator
	const operator = computed(() =>
		operators.value.find((o) => o.value === node.value.data.operator),
	)
	// list operator depend on select column
	const operators = computed(() => {
		switch (column.value?.type) {
			case ColumnTypeEnum.Boolean:
				return [
					isTrueOperator,
					isFalseOperator,
					isNullOperator,
					isNotNullOperator,
				]
			case ColumnTypeEnum.Number:
				return [
					equalOperator,
					notEqualOperator,
					greaterOperator,
					greaterOrEqualOperator,
					lessOperator,
					lessOrEqualOperator,
					inOperator,
					notInOperator,
					inRangeOperator,
					isNullOperator,
					isNotNullOperator,
				]
			case ColumnTypeEnum.Date:
			case ColumnTypeEnum.DateTime:
				return [
					equalOperator,
					notEqualOperator,
					greaterOperator,
					greaterOrEqualOperator,
					lessOperator,
					lessOrEqualOperator,
					inRangeOperator,
					isNullOperator,
					isNotNullOperator,
				]
			default:
				return [
					equalOperator,
					notEqualOperator,
					isEmptyOperator,
					isNotEmptyOperator,
					containsOperator,
					notContainsOperator,
					startsWithOperator,
					notStartWithOperator,
					endsWithOperator,
					notEndWithOperator,
					isNullOperator,
					isNotNullOperator,
					inOperator,
					notInOperator,
				]
		}
	})
	const requireValue = computed(
		() =>
			![
				SdkOperator.IsTrue,
				SdkOperator.IsFalse,
				SdkOperator.IsNull,
				SdkOperator.IsNotNull,
				SdkOperator.IsEmpty,
				SdkOperator.IsNotEmpty,
			].includes(operator.value?.value as SdkOperator),
	)
	// get validate rule
	const valueRule = computed(() => {
		if (!requireValue.value || !operator.value) return []
		const requiredRule = {
			required: true,
			message: 'Required value',
			trigger: ['change', 'blur'],
		}
		return column.value && operator.value?.validate
			? [
					requiredRule,
					{
						validator: (_: unknown, value: unknown) =>
							operator.value?.validate!(
								value,
								column.value!.type,
							),
						message: 'Value is not match with current operator',
						trigger: ['change', 'blur'],
					},
			  ]
			: [requiredRule]
	})
	const inputConfig = computed(() =>
		column.value ? config.value[column.value?.name] : undefined,
	)
	const inputValueComponent = computed(() => {
		// No operator selected
		if (!operator.value?.value) return SdkFilterTextInput
		// Special Case for no value input
		if (!requireValue.value) return SdkFilterNoValueInput
		// Special Case for case select - option
		if (inputConfig.value?.type === 'select') return SdkFilterSelectInput
		// In Operator for number and text column
		if (
			operator.value?.value === SdkOperator.In ||
			operator.value?.value === SdkOperator.NotIn
		) {
			return SdkFilterInInputs
		}
		// Simple case input type
		switch (column.value?.type) {
			case ColumnTypeEnum.Text:
				return SdkFilterTextInput
			case ColumnTypeEnum.Number:
				return SdkFilterNumberInput
			case ColumnTypeEnum.Date:
			case ColumnTypeEnum.DateTime:
				return SdkFilterDateInput
			default:
				return SdkFilterNoValueInput
		}
	})

	return {
		column,
		valueRule,
		operators,
		requireValue,
		inputValueComponent,
		inputConfig,
	}
}
