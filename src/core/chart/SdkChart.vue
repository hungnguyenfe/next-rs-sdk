<script setup lang="ts">
import {
	ColumnTypeEnum,
	SdkElementColumnConfig,
	SdkFilterBuilderConfig,
	SdkQuery,
} from '@/shared/types/sdk.ts'
import { SdkFeatureDropdownListEnum } from '@/common/features/type.ts'
import {
	SdkElementProps,
	useElementContext,
	useElementDataSource,
} from '@/shared/composables/element.ts'
import {
	computed,
	markRaw,
	onMounted,
	ref,
	toRefs,
	watch,
	watchEffect,
} from 'vue'
import { vLoading } from 'element-plus'
import { EChartsOption, EChartsType, SeriesOption } from 'echarts'
import * as echarts from 'echarts'
import { isEqual, uniq, uniqBy, uniqWith } from 'lodash'
import { useDataChart } from '@/core/chart/composables/datachart.ts'
import { MergeDeep } from 'type-fest'
import { XAXisOption, YAXisOption } from 'echarts/types/dist/shared'
import { useResizeObserver } from '@vueuse/core'

export type SdkSeries = MergeDeep<
	SeriesOption,
	{
		data: {
			x: string // name column
			y: string // name column
		}
	}
>

export type SdkChartOptions = Omit<
	EChartsOption,
	'series' | 'xAxis' | 'yAxis'
> & {
	series: SdkSeries[]
	xAxis?: XAXisOption[]
	yAxis?: YAXisOption[]
}

export interface SdkChartProps extends SdkElementProps {
	columns: SdkElementColumnConfig[]
	query: SdkQuery
	filterConfig?: SdkFilterBuilderConfig
	features?: SdkFeatureDropdownListEnum[]
	title?: string
	/**
	 * Apache Echarts Config
	 * Data from sdk will be mapped into echarts data so please follow sdk data config.
	 * Echart configs https://echarts.apache.org/en/index.html
	 * **/
	chart: SdkChartOptions
	height?: number
}

const props = withDefaults(defineProps<SdkChartProps>(), {
	features: () => [],
	filterConfig: () => ({}),
	title: '',
	height: 300,
})

const context = useElementContext(props)
const { query, chart, dataSource } = toRefs(props)

// validate chart
watchEffect(() => {
	const { series } = props.chart
	if (series.length === 1) return

	if (!series.length)
		throw new Error('Chart must have at least 1 item in series')

	const xColumns = series.map((s) => s.data.x)
	if (xColumns.length > 1 && uniq(xColumns).length !== 1) {
		throw new Error(`Column x in series must be the same name`)
	}
	if (!props.columns.find((c) => c.name === xColumns[0]))
		throw new Error(`Column ${xColumns[0]} is not found. Please check`)

	const yColumns = series.map((s) => s.data.y)
	yColumns.forEach((y) => {
		const column = props.columns.find((c) => c.name === y)
		if (!column) throw new Error(`Column ${y} is not found. Please check`)
		if (column.type !== ColumnTypeEnum.Number)
			throw new Error(
				`Y column ${column.name} is not number type. Please check`,
			)
	})
})

// Query data
const { data, isLoading } = useElementDataSource(
	context,
	dataSource,
	computed(() => {
		return {
			...query.value,
			fields: uniqBy(
				props.columns.map((c) => ({ name: c.name })),
				'name',
			),
			pagination: {
				limit: 99999,
				index: 1,
			},
		}
	}),
	computed(
		() =>
			!props.features.includes(
				SdkFeatureDropdownListEnum.FilterBuilderAdvance,
			),
	),
	false,
)
const { seriesData } = useDataChart(chart, data)

// UI Data
const chartRef = ref<HTMLElement>()
const chartInstance = ref<EChartsType>()

useResizeObserver(chartRef, () => {
	chartInstance.value?.resize()
})

onMounted(
	() =>
		data.value && !isLoading.value && !chartInstance.value && renderChart(),
)

function renderChart() {
	if (!chartRef.value) return
	if (chartInstance.value) chartInstance.value?.dispose()

	const chartData = chart.value.series.map(
		(_, index) => seriesData.value[index],
	)
	const xAxisData = uniqWith(
		chartData.filter((d) => !!d.xData).map((d) => d.xData),
		isEqual,
	)
	const xAxis = xAxisData.map((d, i) =>
		!!chart.value.xAxis?.[i]
			? { ...chart.value.xAxis[i], data: d }
			: { data: d },
	)
	const yData = chartData.map((d) => d.yData)
	const options = {
		...chart.value,
		legend: {
			...(chart.value.legend ?? {}),
			data: chart.value.series.every((s) => s.type === 'pie')
				? undefined
				: chart.value.series.map((s) => s.name),
		},
		xAxis: xAxis.length ? xAxis : undefined,
		yAxis: chart.value.yAxis?.length ? chart.value.yAxis : undefined,
		series: chart.value.series.map((s, i) => ({ ...s, data: yData[i] })),
	}
	chartInstance.value = markRaw(echarts.init(chartRef.value, null))
	chartInstance.value?.setOption(options)
}

watch(
	[data, chart],
	(cur, prev) => {
		if (!isEqual(cur, prev)) renderChart()
	},
	{ deep: true },
)
</script>

<template>
	<div
		v-loading="isLoading"
		class="sdk-chart-wrapper"
		:style="{ height: `${height}px` }">
		<div ref="chartRef" class="sdk-chart-container e-chart">
			<!-- Chart will be rendered here -->
		</div>
	</div>
</template>

<style scoped lang="scss">
.sdk-chart {
	&-wrapper {
		width: 100%;
		border: 1px solid var(--el-border-color);
	}

	&-container {
		width: 100%;
		height: 100%;
	}
}
</style>
