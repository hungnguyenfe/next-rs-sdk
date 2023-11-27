import '@/assets/style.scss'
import { Meta, StoryObj } from '@storybook/vue3'
import { useArgs } from '@storybook/client-api'
import { computed } from 'vue'
import { useStories } from '@/stories/common/common.ts'
import { defaultSdkQuery, defaultSdkElementColumns } from '@/shared/helpers'
import SdkConfigProvider from '@/core/config-provider/SdkConfigProvider.vue'
import SdkChart, { SdkChartOptions } from '@/core/chart/SdkChart.vue'
import { ColumnTypeEnum, SdkAggregationType } from '@/shared/types/sdk.ts'

const meta: Meta = {
	component: SdkChart,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text', table: { category: 'Table Props' } },
		dataSource: { control: 'text', table: { category: 'Table Props' } },
		features: { control: 'object', table: { category: 'Table Props' } },
		columns: { control: 'object', table: { category: 'Table Props' } },
		height: { control: 'number', table: { category: 'Table Props' } },
		chart: { control: 'object', table: { category: 'Table Props' } },
		query: { control: 'object', table: { category: 'Table Props' } },
		filterConfig: {
			control: 'object',
			description:
				'Keys of object must be name of column. Optional, just declare the column you want to have special config filter. Ex {Region: {}}',
			table: { category: 'Table Props' },
		},
		namespace: {
			control: {
				type: 'text',
				disabled: true,
			},
			description: 'Getting from slot default of sdk-provider',
			table: { category: 'Table Props' },
		},
	},
	args: {
		title: 'Table Sdk v2',
		dataSource: 'idreportingsdk',
		height: 300,
		features: [],
	},
	render: () => {
		const [args, updateArgs] = useArgs()
		return {
			components: { SdkChart, SdkConfigProvider },
			template: `
				<sdk-config-provider ref="providerRef"
									 :base-url="props.baseUrl"
									 :namespace="props.namespaceChildren"
									 :handle-request-configs="handleRequestConfigs"
									 v-slot="{ namespace }">
					<sdk-chart :namespace="namespace"
							   :data-source="props.dataSource"
							   :columns="props.columns"
							   :title="props.title"
							   :query="props.query"
							   :chart="props.chart"
							   :height="props.height"
					/>
				</sdk-config-provider>
			`,
			setup() {
				const stories = useStories(
					computed(() => args),
					computed(() => updateArgs),
				)
				return { ...stories }
			},
		}
	},
}

export default meta

type Story = StoryObj<typeof meta>

// @ts-ignore
export const PieChart: Story = {
	args: {
		title: 'Pie Chart',
		columns: defaultSdkElementColumns([
			{
				name: 'Region',
				type: ColumnTypeEnum.Text,
			},
			{
				name: 'Unit Price',
				type: ColumnTypeEnum.Number,
			},
		]),
		query: defaultSdkQuery({
			group: {
				columns: [{ name: 'Region' }],
				aggregations: [
					{
						column: 'Unit Price',
						aggregation: SdkAggregationType.SUM,
						alias: 'Unit Price',
					},
				],
			},
		}),
		chart: {
			tooltip: {
				show: true,
			},
			legend: {
				show: true,
				orient: 'vertical',
				left: 'left',
			},
			series: [
				{
					type: 'pie',
					itemStyle: {
						borderRadius: 10,
						borderColor: '#fff',
						borderWidth: 2,
					},
					name: 'Region - Unit Price',
					data: {
						x: 'Region',
						y: 'Unit Price',
					},
				},
			],
		} as SdkChartOptions,
	},
}

export const DonutChart: Story = {
	args: {
		title: 'Dounut Chart',
		columns: defaultSdkElementColumns([
			{
				name: 'Region',
				type: ColumnTypeEnum.Text,
			},
			{
				name: 'Unit Price',
				type: ColumnTypeEnum.Number,
			},
		]),
		query: defaultSdkQuery({
			group: {
				columns: [{ name: 'Region' }],
				aggregations: [
					{
						column: 'Unit Price',
						aggregation: SdkAggregationType.SUM,
						alias: 'Unit Price',
					},
				],
			},
		}),
		chart: {
			tooltip: {
				show: true,
			},
			legend: {
				show: true,
				orient: 'vertical',
				left: 'left',
			},
			series: [
				{
					type: 'pie',
					radius: ['40%', '80%'],
					itemStyle: {
						borderRadius: 10,
						borderColor: '#fff',
						borderWidth: 2,
					},
					name: 'Region - Unit Price',
					data: {
						x: 'Region',
						y: 'Unit Price',
					},
				},
			],
		} as SdkChartOptions,
	},
}

export const BarChart: Story = {
	args: {
		title: 'Bar Chart',
		columns: defaultSdkElementColumns([
			{
				name: 'Region',
				type: ColumnTypeEnum.Text,
			},
			{
				name: 'Unit Price',
				type: ColumnTypeEnum.Number,
			},
			{
				name: 'Unit Cost',
				type: ColumnTypeEnum.Number,
			},
		]),
		query: defaultSdkQuery({
			group: {
				columns: [{ name: 'Region' }],
				aggregations: [
					{
						column: 'Unit Price',
						aggregation: SdkAggregationType.SUM,
						alias: 'Unit Price',
					},
					{
						column: 'Unit Cost',
						aggregation: SdkAggregationType.SUM,
						alias: 'Unit Cost',
					},
				],
			},
		}),
		chart: {
			tooltip: {
				show: true,
				trigger: 'axis',
			},
			legend: {
				show: true,
				top: 'bottom',
				left: 'center',
			},
			xAxis: [
				{
					type: 'category',
				},
			],
			yAxis: [
				{
					type: 'value',
				},
			],
			series: [
				{
					type: 'bar',
					name: 'Region - Unit Price',
					data: {
						x: 'Region',
						y: 'Unit Price',
					},
				},
				{
					type: 'bar',
					name: 'Region - Unit Cost',
					data: {
						x: 'Region',
						y: 'Unit Cost',
					},
				},
			],
		} as SdkChartOptions,
	},
}

export const LineChart: Story = {
	args: {
		title: 'Line Chart',
		columns: defaultSdkElementColumns([
			{
				name: 'Region',
				type: ColumnTypeEnum.Text,
			},
			{
				name: 'Unit Price',
				type: ColumnTypeEnum.Number,
			},
			{
				name: 'Unit Cost',
				type: ColumnTypeEnum.Number,
			},
		]),
		query: defaultSdkQuery({
			group: {
				columns: [{ name: 'Region' }],
				aggregations: [
					{
						column: 'Unit Price',
						aggregation: SdkAggregationType.SUM,
						alias: 'Unit Price',
					},
					{
						column: 'Unit Cost',
						aggregation: SdkAggregationType.SUM,
						alias: 'Unit Cost',
					},
				],
			},
		}),
		chart: {
			tooltip: {
				show: true,
				trigger: 'axis',
			},
			legend: {
				show: true,
				left: 'center',
				top: 'bottom',
			},
			xAxis: [
				{
					type: 'category',
					boundaryGap: false,
				},
			],
			yAxis: [
				{
					type: 'value',
				},
			],
			series: [
				{
					type: 'line',
					name: 'Region - Unit Price',
					data: {
						x: 'Region',
						y: 'Unit Price',
					},
				},
				{
					type: 'line',
					name: 'Region - Unit Cost',
					data: {
						x: 'Region',
						y: 'Unit Cost',
					},
				},
			],
		} as SdkChartOptions,
	},
}

export const CombineChart: Story = {
	args: {
		title: 'Line Chart',
		columns: defaultSdkElementColumns([
			{
				name: 'Region',
				type: ColumnTypeEnum.Text,
			},
			{
				name: 'Units Sold',
				type: ColumnTypeEnum.Number,
			},
			{
				name: 'Total Profit',
				type: ColumnTypeEnum.Number,
			},
		]),
		query: defaultSdkQuery({
			group: {
				columns: [{ name: 'Region' }],
				aggregations: [
					{
						column: 'Units Sold',
						aggregation: SdkAggregationType.SUM,
						alias: 'Units Sold',
					},
					{
						column: 'Total Profit',
						aggregation: SdkAggregationType.SUM,
						alias: 'Total Profit',
					},
				],
			},
		}),
		chart: {
			tooltip: {
				show: true,
				trigger: 'axis',
			},
			legend: {
				show: true,
				left: 'center',
				top: 'bottom',
			},
			xAxis: [
				{
					type: 'category',
				},
			],
			yAxis: [
				{
					type: 'value',
				},
				{
					type: 'value',
				},
			],
			series: [
				{
					type: 'line',
					name: 'Region - Units Sold',
					data: {
						x: 'Region',
						y: 'Units Sold',
					},
				},
				{
					type: 'bar',
					yAxisIndex: 1,
					name: 'Region - Total Profit',
					data: {
						x: 'Region',
						y: 'Total Profit',
					},
				},
			],
		} as SdkChartOptions,
	},
}
