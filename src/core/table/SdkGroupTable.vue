<script setup lang="ts">
import SdkTable from '@/core/table/SdkTable.vue'
import { ElDialog } from 'element-plus'
import { SdkElementColumnConfig, SdkOperator } from '@/shared/types/sdk.ts'
import { defaultSdkQuery } from '@/shared/helpers'
import { InjectionKey, ref } from 'vue'
import { useCloned } from '@vueuse/core'

const props = defineProps<{
	groupColumn: string
	groupValue: string
	columns: SdkElementColumnConfig[]
	dataSource: string
	namespace: InjectionKey<string>
}>()

const emits = defineEmits<{
	(e: 'closed'): void
}>()

const columns = ref(
	useCloned(props.columns)
		.cloned.value.filter((c) => c.name !== props.groupColumn)
		.map((c) => ({ ...c, autoWidth: true, width: 100, sortable: false })),
)

const query = ref(
	defaultSdkQuery({
		pagination: {
			limit: 5,
		},
		filter: {
			type: 'AND',
			conditions: [
				{
					column: props.groupColumn,
					operator: SdkOperator.Equal,
					value: props.groupValue,
				},
			],
		},
	}),
)
</script>

<template>
	<el-dialog
		:title="groupValue"
		:model-value="true"
		@closed="emits('closed')">
		<sdk-table
			:columns="columns"
			:query="query"
			:namespace="namespace"
			:data-source="dataSource"
			@update:query="query = $event"
			@update:columns="columns = $event" />
	</el-dialog>
</template>
