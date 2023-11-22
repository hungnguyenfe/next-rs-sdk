<script setup lang="ts">
import { computed, ref } from 'vue'
import { SdkFeatureDropdownListEnum } from '@/common/features/type.ts'
import {
	ElDropdown,
	ElDropdownMenu,
	ElDropdownItem,
	ElButton,
} from 'element-plus'
import { Operation as OperationIcon } from '@element-plus/icons-vue'
import {
	SdkElementColumnConfig,
	SdkFilterBuilderConfig,
	SdkQuery,
} from '@/shared/types/sdk.ts'
import SdkColumnManager from '@/core/column-manager/SdkColumnManager.vue'
import SdkFilterBuilder from '@/core/filter-builder/SdkFilterBuilder.vue'

const props = defineProps<{
	features: Array<SdkFeatureDropdownListEnum>
	filter: SdkQuery['filter']
	filterConfig: SdkFilterBuilderConfig
	columns: SdkElementColumnConfig[]
}>()
const emits = defineEmits<{
	(e: 'update:columns', columns: Array<SdkElementColumnConfig>): void
	(e: 'update:filter', filter: SdkQuery['filter']): void
}>()
const isColumnManagerOpen = ref(false)
const isFilterBuilderOpen = ref(false)
const enabledColumnManager = computed(() =>
	props.features.includes(SdkFeatureDropdownListEnum.ColumnManager),
)
const enabledFilterBuilder = computed(
	() =>
		props.features.includes(SdkFeatureDropdownListEnum.FilterBuilder) ||
		isAdvanceFilter.value,
)
const isAdvanceFilter = computed(() =>
	props.features.includes(SdkFeatureDropdownListEnum.FilterBuilderAdvance),
)
</script>

<template>
	<el-dropdown>
		<el-button type="primary" :icon="OperationIcon" />
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item
					v-if="enabledColumnManager"
					@click="isColumnManagerOpen = true">
					Column Manager
				</el-dropdown-item>
				<el-dropdown-item
					v-if="enabledFilterBuilder"
					@click="isFilterBuilderOpen = true">
					Query Builder
				</el-dropdown-item>
				<el-dropdown-item
					v-if="!enabledColumnManager && !enabledFilterBuilder">
					No actions found
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>

	<sdk-column-manager
		:columns="columns"
		v-if="enabledColumnManager"
		v-model:is-open="isColumnManagerOpen"
		@update:columns="emits('update:columns', $event)"
		hide-trigger />

	<sdk-filter-builder
		:filter="filter"
		:columns="columns"
		:config="filterConfig"
		:advance="isAdvanceFilter"
		v-if="enabledFilterBuilder"
		v-model:is-open="isFilterBuilderOpen"
		@update:filter="emits('update:filter', $event)"
		hide-trigger />
</template>
