<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'
import {
	SdkAggregationType,
	SdkElementColumnConfig,
} from '@/shared/types/sdk.ts'
import { computed } from 'vue'
import {
	getDefaultAggregation,
	getListAggregations,
} from '@/common/aggregations/helpers/aggregations.ts'

const props = defineProps<{
	column: SdkElementColumnConfig
	modelValue: SdkAggregationType
}>()

const emits = defineEmits<{
	(e: 'update:modelValue', value: SdkAggregationType): void
}>()

const listAggregations = computed(() => getListAggregations(props.column))
const aggregation = computed({
	get: () => getDefaultAggregation(props.column, props.modelValue),
	set: (v) => emits('update:modelValue', v),
})
</script>

<template>
	<el-select
		class="sdk-aggregation-select"
		v-model="aggregation"
		size="small"
		:clearable="false">
		<el-option
			v-for="aggr in listAggregations"
			:key="aggr.value"
			:label="aggr.label"
			:value="aggr.value" />
	</el-select>
</template>

<style scoped>
.sdk-aggregation-select {
	width: 100%;

	&:deep(.el-input--small) {
		--el-input-height: 14px;
	}
}
</style>
