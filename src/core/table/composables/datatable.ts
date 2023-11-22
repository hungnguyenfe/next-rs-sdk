import { computed, ref, Ref } from 'vue'
import { Element } from '@/shared/composables/element.ts'
import { AnyColumn } from 'element-plus/es/components/table-v2/src/common'
import { SdkFormatFactory } from '@/services/format'
import { SdkElementColumnConfig, SdkQuery } from '@/shared/types/sdk.ts'
import { FixedDir } from 'element-plus/es/components/table-v2/src/constants'

type CustomAnyColumn = AnyColumn & {
	name: string
}

interface SdkDatatableRow {
	children?: never[]
	value: unknown
	formatValue: unknown
	column: CustomAnyColumn
}

export const useDataTable = (
	elementDataSource: Ref<Element>,
	columns: Ref<SdkElementColumnConfig[]>,
	query: Ref<SdkQuery>,
) => {
	const cache = ref<Record<number, CustomAnyColumn>>({})
	const count = computed(() => elementDataSource.value.count)
	const dataColumns = computed(() =>
		columns.value
			.filter((c) => c.visible)
			.map(
				(c) =>
					({
						...c,
						width: c.width,
						key: c.name,
						dataKey: `${c.name}.formatValue`,
						fixed:
							query.value.group.columns[0]?.name === c.name
								? FixedDir.LEFT
								: false,
					}) as CustomAnyColumn,
			),
	)
	const dataRows = computed(() => {
		cache.value = {}
		return elementDataSource.value.rows.map((row: any[]) => {
			return row.reduce(
				(
					mapRow: Record<string, SdkDatatableRow>,
					value: unknown,
					index: number,
				) => {
					const columnConfig = getColumnConfigFromColumnData(index)
					if (!columnConfig?.visible) return mapRow
					const formatValue = SdkFormatFactory.formatValue(
						columnConfig.format,
						value as string,
					)
					return {
						...mapRow,
						[columnConfig.name]: {
							value,
							formatValue,
							column: columnConfig,
						},
					}
				},
				{},
			)
		})
	})

	function getColumnConfigFromColumnData(index: number) {
		if (!cache.value[index] && elementDataSource.value.cols.length) {
			const dataCol = elementDataSource.value.cols[index]
			const columnConfig = dataColumns.value.find(
				(c) => c.name === dataCol?.name,
			)
			cache.value = { ...cache.value, [index]: columnConfig! }
		}
		return cache.value[index]
	}

	return {
		dataColumns,
		dataRows,
		count,
	}
}
