import { ElementDS } from '@/shared/composables/element.ts'
import { computed, Ref } from 'vue'
import { SdkChartOptions, SdkSeries } from '@/core/chart/SdkChart.vue'

const supportTypes = ['pie', 'line', 'bar']

export interface SdkChartData {
	xData?: unknown[]
	yData: unknown[]
}

export const useDataChart = (
	chart: Ref<SdkChartOptions>,
	datasource: Ref<ElementDS>,
) => {
	const findIndexXYColumn = (item: SdkSeries) => {
		const { x, y } = item.data
		return {
			xIndex: datasource.value.cols.findIndex(
				(c) => c.alias === x || c.name === x,
			),
			yIndex: datasource.value.cols.findIndex(
				(c) => c.alias === y || c.name === y,
			),
		}
	}

	const buildPieChartData = (item: SdkSeries): SdkChartData => {
		const { xIndex, yIndex } = findIndexXYColumn(item)
		return {
			xData: undefined,
			yData: datasource.value.rows.map((r) => ({
				name: r[xIndex],
				value: r[yIndex],
			})),
		}
	}

	const buildLineChartData = (item: SdkSeries): SdkChartData => {
		const { yIndex, xIndex } = findIndexXYColumn(item)
		return {
			xData: datasource.value.rows.map((r) => r[xIndex]),
			yData: datasource.value.rows.map((r) => r[yIndex]),
		}
	}

	return {
		seriesData: computed<SdkChartData[]>(() =>
			chart.value.series.map((s) => {
				switch (s.type) {
					case 'pie':
						return buildPieChartData(s)
					case 'line':
					case 'bar':
						return buildLineChartData(s)
					default:
						throw new Error(
							`Sdk does not support ${
								s.type
							} type. ${supportTypes.join(
								',',
							)} is supported for now`,
						)
				}
			}),
		),
	}
}
