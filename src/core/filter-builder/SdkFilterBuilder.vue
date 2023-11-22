<script setup lang="ts">
import {
	SdkElementColumnConfig,
	SdkFilterBuilderConfig,
	SdkQuery,
} from '@/shared/types/sdk.ts'
import { computed, ref } from 'vue'
import { ElButton, ElDialog } from 'element-plus'
import SdkFilterWrapper from '@/core/filter-builder/SdkFilterWrapper.vue'

const props = withDefaults(
	defineProps<{
		hideTrigger?: boolean
		isOpen?: boolean
		advance?: boolean
		filter: SdkQuery['filter']
		config: SdkFilterBuilderConfig
		columns: SdkElementColumnConfig[]
	}>(),
	{
		hideTrigger: false,
		isOpen: false,
	},
)
const emits = defineEmits<{
	(e: 'update:isOpen', isOpen: boolean): void
	(e: 'update:filter', filter: SdkQuery['filter']): void
}>()
const isOpen = computed({
	get: () => props.isOpen,
	set: (i: boolean) => emits('update:isOpen', i),
})
const wrapperRef = ref<InstanceType<typeof SdkFilterWrapper>>()

async function handleSave() {
	const result = await wrapperRef.value?.validateForm()
	if (!result?.isValid) return
	emits('update:isOpen', false)
	emits('update:filter', result.filter ?? { type: 'AND', conditions: [] })
}
</script>

<template>
	<div>
		<slot v-if="!hideTrigger" :is-open="isOpen">
			<el-button @click="isOpen = true"> Manage Columns </el-button>
		</slot>

		<el-dialog
			class="sdk-filter-builder-modal"
			v-model="isOpen"
			:class="{ '--advance': advance }"
			:show-close="false">
			<!-- Header -->
			<template #header>
				<div class="sdk-filter-builder-modal-header">
					<span class="el-dialog__header">{{
						advance ? 'Filter Builder' : 'Filters'
					}}</span>
				</div>
			</template>

			<!-- Content -->
			<div class="sdk-filter-tree">
				<sdk-filter-wrapper
					v-if="isOpen"
					ref="wrapperRef"
					:advance="advance"
					:filter="filter"
					:config="config"
					:columns="columns" />
			</div>

			<!-- Footer -->
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="isOpen = false">Cancel</el-button>
					<el-button type="primary" @click="handleSave()">
						Save
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped lang="scss">
:deep(.sdk-filter-builder-modal) {
	max-width: 300px;

	&.--advance {
		max-width: 1200px !important;
		width: 80vw;

		.sdk-filter-tree {
			padding-left: 30px;
			padding-right: 30px;
		}
	}

	&:not(.--advance) {
		span.el-dialog__header {
			padding-left: 0;
		}

		.el-dialog__body {
			padding-top: 0;
			padding-bottom: 0;
		}
	}
}

.sdk-filter-tree {
	.el-tree-node__content {
		--el-tree-node-content-height: auto;
	}

	:deep(.el-tree-node__expand-icon) {
		display: none !important;
	}

	:deep(.el-tree-node__content),
	:deep(.el-tree-node__children) {
		height: auto !important;
	}

	:deep(.el-tree-node__children) {
		&:not(:empty) > div:not(:first-child),
		&:empty > div:first-child {
			margin-top: 10px;
		}
	}
}
</style>
