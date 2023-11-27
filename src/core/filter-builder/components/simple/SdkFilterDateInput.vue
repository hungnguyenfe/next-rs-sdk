<script setup lang="ts">
import { ElDatePicker } from 'element-plus'
import { computed, nextTick, ref, watch } from 'vue'
import {
	BaseInputEmits,
	BaseInputProps,
} from '@/core/filter-builder/components/base.ts'
import { ColumnTypeEnum, SdkOperator } from '@/shared/types/sdk.ts'
import { isArray } from 'lodash'
import {
	expressions as expressionList,
	getExpression,
} from '@/shared/helpers/expression.ts'

const props = defineProps<BaseInputProps<string | [string, string]>>()
const emits = defineEmits<BaseInputEmits<string | [string, string]>>()

const defaultTime = [
	new Date(2000, 1, 1, 0, 0, 0),
	new Date(2000, 2, 1, 23, 59, 59),
] as [Date, Date]
const expressions = expressionList((e) => (expression.value = e))

const expression = ref<[string, string]>()
const isRangeOperator = computed(() => props.operator === SdkOperator.InRange)
const isExpression = computed(
	() => isArray(props.modelValue) && !!getExpression(props.modelValue),
)
const value = computed({
	get: () => {
		if (!isArray(props.modelValue)) return props.modelValue
		const expression = getExpression(props.modelValue)
		return expression ? expression!.parseValues() : props.modelValue
	},
	set: (v) => emits('update:modelValue', v),
})

const type = computed(() => {
	if (isRangeOperator.value)
		return ColumnTypeEnum.Date ? 'daterange' : 'datetimerange'
	return props.column.type === ColumnTypeEnum.Date ? 'date' : 'datetime'
})

const format = computed(() =>
	props.column.type === ColumnTypeEnum.DateTime
		? 'MM/DD/YYYY - HH:mm:ss'
		: 'MM/DD/YYYY',
)

const valueFormat = computed(() =>
	props.column.type === ColumnTypeEnum.DateTime || isRangeOperator
		? 'YYYY-MM-DDTHH:mm:ss'
		: 'YYYY-MM-DD',
)

/**
 * NOTE: Element plus datepickers always parse value into date so we need to check if expression is click and set value again
 * **/
watch(expression, (e) => {
	e &&
		nextTick(() => {
			value.value = e
		})
})
</script>

<template>
	<div class="sdk-date-input">
		<el-date-picker
			:shortcuts="isRangeOperator ? (expressions as unknown[]) : []"
			:default-time="isRangeOperator ? defaultTime : undefined"
			:disabled="disable"
			:type="type"
			:format="format"
			:value-format="valueFormat"
			v-model="value as string"
			start-placeholder="Start date"
			end-placeholder="End date"
			placeholder="Pick a day">
		</el-date-picker>
		<small class="helper" v-if="isExpression"
			>Static Expression is selected</small
		>
	</div>
</template>

<style scoped lang="scss">
.sdk-date-input {
	display: flex;
	gap: 10px;
	position: relative;

	:deep(.el-input) {
		--el-date-editor-width: 100%;
	}

	.helper {
		position: absolute;
		font-size: 0.7rem;
		bottom: -25px;
		right: 0;
		left: 0;
		text-align: right;
		text-overflow: ellipsis;
		color: var(--el-color-primary);
	}
}
</style>
