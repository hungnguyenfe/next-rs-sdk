<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { SdkElementColumnConfig } from '@/shared/types/sdk.ts'
import { ElButton, ElDialog, ElCheckbox, ElInput } from 'element-plus'
import { useCloned } from '@vueuse/core'
import SdkDraggableContainer from '@/common/smooth-dnd/SdkDraggableContainer.vue'
import SdkColumnItem from '@/core/column-manager/SdkColumnItem.vue'
import isNumber from 'lodash/isNumber'

const props = withDefaults(
	defineProps<{
		isLoading?: boolean
		hideTrigger?: boolean
		isOpen?: boolean
		columns: SdkElementColumnConfig[]
	}>(),
	{
		isLoading: false,
		hideTrigger: false,
		isOpen: false,
	},
)
const emits = defineEmits<{
	(e: 'update:isOpen', isOpen: boolean): void
	(e: 'update:columns', columns: SdkElementColumnConfig[]): void
}>()

const columns = ref<SdkElementColumnConfig[]>([])
const keyword = ref('')
const enabledSort = computed(() => !keyword.value)
const isOpen = computed({
	get: () => props.isOpen,
	set: (i) => emits('update:isOpen', i),
})
const filterColumns = computed({
	get: () =>
		keyword.value
			? columns.value.filter((c) =>
					[
						c.title
							?.toLowerCase()
							.includes(keyword.value.toLowerCase()),
						c.name
							.toLowerCase()
							.includes(keyword.value.toLowerCase()),
					].some((v) => !!v),
			  )
			: columns.value,
	set: (updatedColumns) => (columns.value = updatedColumns),
})
const isVisibleIndeterminate = computed(() => {
	const count = columns.value.filter((c) => c.visible).length
	return 0 < count && count < columns.value.length
})
const checkVisibleAll = computed({
	get: () => columns.value.every((c) => c.visible),
	set: (value: boolean) => columns.value.forEach((c) => (c.visible = value)),
})
const isSortIndeterminate = computed(() => {
	const count = columns.value.filter((c) => c.sortable).length
	return 0 < count && count < columns.value.length
})
const checkSortAll = computed({
	get: () => columns.value.every((c) => c.sortable),
	set: (value: boolean) => columns.value.forEach((c) => (c.sortable = value)),
})
const isAutoWidthIndeterminate = computed(() => {
	const count = columns.value.filter((c) => c.autoWidth).length
	return 0 < count && count < columns.value.length
})
const checkAutoWidthAll = computed({
	get: () => columns.value.every((c) => c.autoWidth),
	set: (value: boolean) =>
		columns.value.forEach((c) => (c.autoWidth = value)),
})
const getItem = computed(() => (index: number) => columns.value[index])

function handleMoveItem(
	from: number | null,
	to: number | null,
	item: SdkElementColumnConfig,
) {
	if (!isNumber(from) || !isNumber(to) || !item) return
	const array = [...columns.value]
	array.splice(from, 1)
	array.splice(to, 0, item)
	columns.value = array
}

function handleSave() {
	emits('update:isOpen', false)
	emits('update:columns', columns.value)
}

watch(isOpen, () => (columns.value = useCloned(props.columns).cloned.value), {
	immediate: true,
})
</script>

<template>
	<slot v-if="!hideTrigger" :is-open="isOpen" :loading="isLoading">
		<el-button :loading="isLoading" @click="isOpen = true">
			Manage Columns
		</el-button>
	</slot>

	<el-dialog
		class="sdk-column-modal"
		title="text"
		v-model="isOpen"
		:show-close="false">
		<!-- Header -->
		<template #header>
			<div class="sdk-column-modal-header">
				<span class="el-dialog__header">Column Management</span>
				<el-input
					v-model="keyword"
					class="sdk-search-column"
					placeholder="Search by name, title" />
			</div>
		</template>

		<!-- Content -->
		<div>
			<el-checkbox
				:indeterminate="isSortIndeterminate"
				v-model="checkSortAll"
				label="Sortable" />
			<el-checkbox
				v-model="checkVisibleAll"
				:indeterminate="isVisibleIndeterminate"
				label="Visible" />

			<el-checkbox
				v-model="checkAutoWidthAll"
				:indeterminate="isAutoWidthIndeterminate"
				label="Auto width" />
		</div>
		<div class="sdk-column-list">
			<sdk-draggable-container
				:get-item="getItem"
				drop-class="transition-100"
				drag-class="sdk-column-item-ghost transition-100"
				drag-handle-selector=".sdk-column-item-drag-icon"
				@drop="
					(params) =>
						handleMoveItem(
							params.removedIndex,
							params.addedIndex,
							params.payload,
						)
				"
				v-slot="{ wrapperClass }">
				<sdk-column-item
					v-for="column in columns"
					:class="wrapperClass"
					:key="column.name"
					:column="column"
					:allow-drag="enabledSort" />
			</sdk-draggable-container>

			<!-- Not found -->
			<div v-if="!filterColumns.length" class="sdk-column-not-found">
				<span v-if="keyword">Column not found</span>
				<span v-else>There is no column to manage</span>
			</div>
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
</template>

<style lang="scss" scoped>
:global(.sdk-column-modal) {
	max-width: 600px;
	width: 80vw;
}

.sdk-column-modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.sdk-search-column {
		width: 200px;
	}

	.el-dialog__header {
		padding: 0;
	}
}

.sdk-column-list {
	padding: 10px;
	background-color: var(--el-border-color);
	box-shadow: inset 0 0 0 4px var(--el-border-color);
	max-height: 300px;
	overflow: auto;

	.sdk-dragging-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.sdk-column-not-found {
		width: 100%;
		padding-top: 20px;
		padding-bottom: 20px;
		text-align: center;
	}

	:global(
			.sdk-dragging-container.dragging
				.sdk-column-item:not(.sdk-column-item-ghost)
				.sdk-column-item-drag-icon
		) {
		opacity: 0 !important;
	}

	:global(.sdk-column-item-ghost .sdk-column-item-drag-icon) {
		opacity: 1;
	}
}
</style>
