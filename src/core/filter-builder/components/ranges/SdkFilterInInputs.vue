<script setup lang="ts">
import { ElSelect } from 'element-plus'
import { computed } from 'vue'
import {
	BaseInputEmits,
	BaseInputProps,
} from '@/core/filter-builder/components/base.ts'
import { useCollapseSelect } from '@/core/filter-builder/composables/collapseSelect.ts'
import { ColumnTypeEnum } from '@/shared/types/sdk.ts'
import { isNumber } from '@/shared/helpers/validate.ts'

const props = defineProps<BaseInputProps<string[] | number[]>>()
const emits = defineEmits<BaseInputEmits<string[] | number[]>>()

const isNumberColumn = computed(
	() => props.column.type === ColumnTypeEnum.Number,
)
const value = computed({
	get: () =>
		props.modelValue.map((v) =>
			isNumberColumn.value
				? isNumber(v)
					? `${v}`
					: `Invalid`
				: (v as string),
		),
	set: (value) =>
		emits(
			'update:modelValue',
			isNumberColumn.value ? value.map((v) => Number(v)) : value,
		),
})
const { selectRef, collapsed, max } = useCollapseSelect(value)
</script>

<template>
	<el-select
		class="no-suffix"
		popper-class="d-none"
		ref="selectRef"
		v-model="value"
		multiple
		filterable
		allow-create
		default-first-option
		placeholder="Press enter to add value"
		:suffix-icon="undefined"
		:collapse-tags="collapsed"
		:collapse-tags-tooltip="collapsed"
		:max-collapse-tags="max"
		:reserve-keyword="false">
	</el-select>
</template>

<style scoped>
.no-suffix :deep(.el-input__suffix) {
	display: none;
}
</style>
