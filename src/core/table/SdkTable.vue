<script setup lang="ts">
import SdkFeatureDropdown from '@/common/features/SdkFeatureDropdown.vue'
import { computed, nextTick, onMounted, ref, toRefs, watch } from 'vue'
import {
	SdkElementProps,
	useElementContext,
	useElementDataSource,
} from '@/shared/composables/element.ts'
import { useDataTable } from '@/core/table/composables/datatable.ts'
import { onResizeEvent } from '@/core/table/events/resize.event.ts'
import {
	SdkElementColumnConfig,
	SdkFilterBuilderConfig,
	SdkFilterGroupType,
	SdkQuery,
} from '@/shared/types/sdk.ts'
import {
	ElAutoResizer,
	ElEmpty,
	ElIcon,
	ElPagination,
	TableV2 as ElTable,
	vLoading,
} from 'element-plus'
import { SdkFeatureDropdownListEnum } from '@/common/features/type.ts'
import { Sort, SortDown, SortUp, View } from '@element-plus/icons-vue'
import SdkGroupTable from '@/core/table/SdkGroupTable.vue'
import SdkAggregations from '@/common/aggregations/SdkAggregations.vue'

export interface SdkTableProps extends SdkElementProps {
	columns: SdkElementColumnConfig[]
	query: SdkQuery
	filterConfig?: SdkFilterBuilderConfig
	features?: SdkFeatureDropdownListEnum[]
	height?: number | 'auto'
	minHeight?: number
	showPagination?: boolean
	rowCellClass?: string
	colCellClass?: string
	title?: string
}

const TABLE_ROW_HEIGHT = 50
const TABLE_COLUMN_MIN_WIDTH = 100
const TABLE_MIN_HEIGHT = 300
const props = withDefaults(defineProps<SdkTableProps>(), {
	features: () => [],
	filterConfig: () => ({}),
	height: 'auto',
	minHeight: 300,
	showPagination: true,
	rowCellClass: '',
	colCellClass: '',
})
const emits = defineEmits<{
	(e: 'update:columns', columns: SdkElementColumnConfig[]): void
	(e: 'update:query', query: SdkQuery): void
	(e: 'update:filter', filter: SdkQuery['filter']): void
	(e: 'update:sort', sort: SdkQuery['sort']): void
	(e: 'update:pagination', pagination: SdkQuery['pagination']): void
	(e: 'update:grouping', pagination: SdkQuery['group']): void
}>()

const context = useElementContext(props)

// Binding Data Props
const { columns, query, dataSource } = toRefs(props)

// Query data
const { data, isLoading } = useElementDataSource(
	context,
	dataSource,
	query,
	computed(
		() =>
			!props.features.includes(
				SdkFeatureDropdownListEnum.FilterBuilderAdvance,
			),
	),
)
const { dataColumns, dataRows, count } = useDataTable(data, columns, query)

// Binding UI config
const selectedRow = ref<string>()
const tableRef = ref<HTMLDivElement>()
const paginationRef = ref<HTMLDivElement>()
const columnRefs = ref<HTMLDivElement[]>()
const tableCellRef = ref<HTMLElement[]>()
const removeListeners = ref<Array<() => void>>([])
const hasGroupColumn = computed(() => props.query.group.columns.length)
const showFeatures = computed(() => props.features.length)
const visibleColumns = computed(() => columns.value.map((c) => c.name))
const aggregationIndex = computed(() =>
	props.query.group.aggregations.reduce(
		(mapIndex, aggr, index) => {
			return { ...mapIndex, [aggr.column]: index }
		},
		{} as Record<string, number>,
	),
)
const tableHeight = computed<number>(() => {
	const paginationValue =
		paginationRef.value?.getBoundingClientRect().height || 0
	const heightValue = parseFloat(props.height as string) || 0
	const height =
		props.height === 'auto'
			? (dataRows.value.length + 1) * TABLE_ROW_HEIGHT
			: Math.max(heightValue - paginationValue - 2, 0) // 2 for border top and border bottom
	return Math.max(TABLE_MIN_HEIGHT, height)
})

onMounted(() => calcColumnWidth())

/**
 * Calc width for column table when first time init
 * **/
function calcColumnWidth() {
	if (!tableRef.value) return
	const tableWidth = tableRef.value.getBoundingClientRect().width
	const autoColumns = columns.value.filter((c) => c.visible && c.autoWidth)
	const calcColumns = columns.value.filter((c) => c.visible && !c.autoWidth)
	const totalCalcWidth = calcColumns.reduce(
		(t, c) => t + c.width || TABLE_COLUMN_MIN_WIDTH,
		0,
	)
	if (totalCalcWidth >= tableWidth) return

	const averageWidth =
		(tableWidth - totalCalcWidth) / (autoColumns.length || 1)
	autoColumns.forEach((col) => {
		col.width = parseFloat(
			Math.max(TABLE_COLUMN_MIN_WIDTH, averageWidth).toFixed(2),
		)
	})
}

/**
 * Update page change
 * **/
function changePageIndex(index: number) {
	query.value.pagination.index = index
	emits('update:pagination', query.value.pagination)
	emits('update:query', query.value)
}

/**
 * Update filter
 * **/
function updateFilter(filter: SdkFilterGroupType) {
	query.value.filter = filter
	emits('update:filter', query.value.filter)
	emits('update:query', query.value)
}

/**
 * Update filter
 * **/
function updateSort(columnName: string) {
	let sort = query.value.sort ? { ...query.value.sort } : undefined
	if (sort) {
		sort =
			sort.direction === 'desc'
				? undefined
				: { ...sort, direction: 'desc' }
	} else {
		sort = { column: columnName, direction: 'asc' }
	}
	query.value.sort = sort
	emits('update:filter', query.value.filter)
	emits('update:query', query.value)
}

/**
 * Resize Column event
 * **/
watch([columnRefs, visibleColumns], async ([columnRefs]) => {
	if (!columnRefs) return
	// remove current listener
	removeListeners.value.forEach((removeEvent) => removeEvent?.())
	removeListeners.value = []
	// assign new listener
	await nextTick()
	columnRefs.forEach((columnEl) => {
		const name = columnEl.getAttribute('data-col-name')
		const resizer = columnEl.querySelector('.resizer') as HTMLElement
		removeListeners.value = [
			...removeListeners.value,
			onResizeEvent(resizer, columnEl, ({ x, originWidth, originX }) => {
				const columnConfig = columns.value.find((c) => c.name === name)
				if (!columnConfig) return
				columnConfig.width =
					originWidth + (x - originX) >= TABLE_COLUMN_MIN_WIDTH
						? originWidth + (x - originX)
						: TABLE_COLUMN_MIN_WIDTH
				columnConfig.autoWidth = false
				emits('update:columns', columns.value)
			}),
		]
	})
})

/**
 * Re-calculate width when visible columns changes
 * **/
watch(visibleColumns, () => calcColumnWidth())
</script>

<template>
	<div v-loading="isLoading">
		<!-- Feature -->
		<div
			v-if="showFeatures || title"
			class="element-toolbar"
			:class="{ '--features': showFeatures }">
			<div class="element-title">
				<div>{{ title }}</div>
			</div>
			<div v-if="showFeatures" class="element-features">
				<sdk-feature-dropdown
					:features="features"
					:filter="query.filter"
					:filter-config="filterConfig"
					:columns="columns"
					@update:columns="emits('update:columns', $event)"
					@update:filter="updateFilter" />
			</div>
		</div>

		<!-- Table -->
		<div
			ref="tableRef"
			class="sdk-table-root"
			:style="{ height: `${tableHeight}px` }">
			<el-auto-resizer v-slot="{ width, height }">
				<el-table
					:columns="dataColumns"
					:data="dataRows"
					:width="width"
					:height="height"
					fixed>
					<template #header="{ columns }">
						<div
							ref="columnRefs"
							v-for="column in columns"
							class="sdk-table-header-col"
							:data-col-name="column.name"
							:class="{
								[colCellClass]: true,
								'--grouping':
									hasGroupColumn &&
									column.name ===
										query.group.columns[0]?.name,
								'--aggregation':
									hasGroupColumn &&
									column.name !==
										query.group.columns[0]?.name,
								'--sortable': column.sortable,
							}"
							:style="{ width: `${column.width}px` }">
							<div class="sdk-table-col-label">
								<slot :name="`${column.name}-header-cell`">
									<span>
										{{ column.title || column.name }}
									</span>
								</slot>
								<el-icon
									v-if="column.sortable"
									class="sdk-table-sort"
									:class="{ active: !!query.sort }">
									<Sort
										v-if="
											!query.sort ||
											query.sort.column !== column.name
										"
										@click="updateSort(column.name)" />
									<template v-else>
										<SortUp
											v-if="
												query.sort.direction === 'asc'
											"
											@click="updateSort(column.name)" />
										<SortDown
											v-else
											@click="updateSort(column.name)" />
									</template>
								</el-icon>
							</div>
							<div
								v-if="
									hasGroupColumn &&
									column.name !== query.group.columns[0]?.name
								"
								class="sdk-table-aggregation">
								<sdk-aggregations
									:column="column"
									v-model="
										query.group.aggregations[
											aggregationIndex[column.name]
										].aggregation
									" />
							</div>
							<div class="resizer"></div>
						</div>
					</template>

					<template #row="{ rowData, rowIndex, columns }">
						<div
							ref="tableCellRef"
							v-for="(column, colIndex) in columns"
							class="sdk-table-body-col"
							:key="`${rowIndex}-${colIndex}`"
							:style="{ width: `${column.width}px` }"
							:class="rowCellClass">
							<div
								v-if="rowData[column.name]"
								class="sdk-table-col-value">
								<div
									v-if="
										hasGroupColumn &&
										query.group.columns[0].name ===
											column.name
									"
									class="sdk-table-group-detail-view"
									@click="
										selectedRow =
											rowData[column.name].formatValue
									">
									<slot name="group-icon">
										<el-icon>
											<View />
										</el-icon>
									</slot>
								</div>
								<slot
									:name="`${column.name}-body-cell`"
									:row-data="rowData"
									:column-data="rowData[column.name]">
									<span :title="rowData[column.name].value">
										{{ rowData[column.name].formatValue }}
									</span>
								</slot>
							</div>
						</div>
					</template>

					<template #empty>
						<slot name="empty">
							<el-empty :image-size="50" description="No data" />
						</slot>
					</template>
				</el-table>
			</el-auto-resizer>
		</div>

		<!-- Pagination -->
		<div
			v-if="showPagination && count > 0"
			ref="paginationRef"
			class="sdk-pagination">
			<el-pagination
				:current-page="query.pagination.index"
				:default-page-size="query.pagination.limit"
				:total="count"
				:disabled="isLoading"
				layout="total, prev, pager, next, jumper"
				@update:current-page="changePageIndex($event)" />
		</div>

		<sdk-group-table
			v-if="hasGroupColumn && selectedRow"
			:columns="columns"
			:namespace="namespace"
			:group-value="selectedRow"
			:data-source="dataSource"
			:group-column="query.group.columns[0].name"
			@closed="selectedRow = undefined" />
	</div>
</template>

<style lang="scss" scoped>
@import 'SdkTable';
</style>
