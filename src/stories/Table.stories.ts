import '@/assets/style.scss'
import { Meta, StoryObj } from '@storybook/vue3'
import { useArgs } from '@storybook/client-api'
import { computed } from 'vue'
import { getColumnsDSIdReportingSdk } from '@/stories/common/common.ts'
import { defaultSdkQuery } from '@/shared/helpers'
import { SdkFeatureDropdownListEnum } from '@/common/features/type.ts'
import SdkTable from '@/core/table/SdkTable.vue'
import SdkConfigProvider, {
	SDKProviderProps,
} from '@/core/config-provider/SdkConfigProvider.vue'
import { defaultFilterBuilderConfig } from '@/shared/helpers/filter.ts'
import { SdkAggregationType, SdkOperator } from '@/shared/types/sdk.ts'

const meta: Meta = {
	component: SdkTable,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text', table: { category: 'Table Props' } },
		dataSource: { control: 'text', table: { category: 'Table Props' } },
		height: { control: 'text', table: { category: 'Table Props' } },
		minHeight: { control: 'number', table: { category: 'Table Props' } },
		showPagination: {
			control: 'boolean',
			table: { category: 'Table Props' },
		},
		showFilter: { control: 'boolean', table: { category: 'Table Props' } },
		rowCellClass: { control: 'text', table: { category: 'Table Props' } },
		colCellClass: { control: 'text', table: { category: 'Table Props' } },
		features: { control: 'object', table: { category: 'Table Props' } },
		columns: { control: 'object', table: { category: 'Table Props' } },
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
		features: [],
		height: 'auto',
		minHeight: 300,
		showPagination: true,
		showFilter: false,
		rowCellClass: '',
		colCellClass: '',
	},
	render: () => {
		const [args, updateArgs] = useArgs()
		return {
			components: { SdkTable, SdkConfigProvider },
			template: `
				<sdk-config-provider ref="providerRef"
									 :base-url="props.baseUrl"
									 :namespace="props.namespaceChildren"
									 :handle-request-configs="handleRequestConfigs"
									 v-slot="{ namespace }">
					<sdk-table
						:title="props.title"
						:namespace="namespace"
						:query="props.query"
						:columns="props.columns"
						:data-source="props.dataSource"
						:height="props.height"
						:min-height="props.minHeight"
						:col-cell-class="props.collCellClass"
						:row-cell-class="props.rowCellClass"
						:features="props.features"
						:show-filter="props.showFilter"
						:show-pagination="props.showPagination"
						:show-sort="props.showSort"
						:filter-config="props.filterConfig"
						@update:columns="updateProps({ columns: $event })"
						@update:query="updateProps({ query: $event })"
					/>
				</sdk-config-provider>
			`,
			setup() {
				const props = computed(() => ({ ...args }))
				const handleRequestConfigs = computed<
					SDKProviderProps['handleRequestConfigs']
				>(() => (config) => {
					config.headers = config.headers || {}
					if (args.clientId) {
						config.headers['x-ps-client-id'] = args.clientId
						config.headers.Authorization = 'Bearer ' + args.token
					} else {
						config.headers.Authorization = args.token || ''
					}
					return config
				})
				const updateProps = (partialArgs: any) => {
					updateArgs({ ...args, ...partialArgs })
				}
				return {
					props,
					updateProps,
					handleRequestConfigs,
				}
			},
		}
	},
}

export default meta

type Story = StoryObj<typeof meta>

// @ts-ignore
export const Default: Story = {
	args: {
		query: defaultSdkQuery({}),
		columns: getColumnsDSIdReportingSdk(),
	},
}

export const Grouping: Story = {
	args: {
		query: defaultSdkQuery({
			group: {
				columns: [{ name: 'Region' }],
				aggregations: [
					{
						column: 'Country',
						aggregation: SdkAggregationType.COUNT,
						alias: 'Country',
					},
					{
						column: 'Item Type',
						aggregation: SdkAggregationType.COUNT,
						alias: 'Item Type',
					},
					{
						column: 'Sales Channel',
						aggregation: SdkAggregationType.COUNT,
						alias: 'Sales Channel',
					},
					{
						column: 'Order Priority',
						aggregation: SdkAggregationType.COUNT,
						alias: 'Order Priority',
					},
					{
						column: 'Order Date',
						aggregation: SdkAggregationType.MAX,
						alias: 'Order Date',
					},
					{
						column: 'Order ID',
						aggregation: SdkAggregationType.COUNT,
						alias: 'Order ID',
					},
					{
						column: 'Ship Date',
						aggregation: SdkAggregationType.MAX,
						alias: 'Ship Date',
					},
					{
						column: 'Units Sold',
						aggregation: SdkAggregationType.SUM,
						alias: 'Units Sold',
					},
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
					{
						column: 'Total Revenue',
						aggregation: SdkAggregationType.SUM,
						alias: 'Total Revenue',
					},
					{
						column: 'Total Cost',
						aggregation: SdkAggregationType.SUM,
						alias: 'Total Cost',
					},
					{
						column: 'Total Profit',
						aggregation: SdkAggregationType.SUM,
						alias: 'Total Profit',
					},
				],
			},
		}),
		columns: getColumnsDSIdReportingSdk(),
	},
}

export const WithColumnFeatures: Story = {
	args: {
		query: defaultSdkQuery({}),
		features: [SdkFeatureDropdownListEnum.ColumnManager],
		columns: getColumnsDSIdReportingSdk(),
	},
}

export const WithFilterFeatures: Story = {
	args: {
		features: [SdkFeatureDropdownListEnum.FilterBuilder],
		query: defaultSdkQuery({
			filter: {
				type: 'AND',
				conditions: [
					{
						column: 'Region',
						operator: SdkOperator.Equal,
						value: '',
					},
					{
						column: 'Sales Channel',
						operator: SdkOperator.Equal,
						value: '',
					},
				],
			},
		}),
		columns: getColumnsDSIdReportingSdk(),
		filterConfig: defaultFilterBuilderConfig({
			Region: {
				type: 'select',
				remote: false,
				options: async (_) => [
					{
						label: 'Australia and Oceania',
						value: 'Australia and Oceania',
					},
					{
						label: 'Central America and the Caribbean',
						value: 'Central America and the Caribbean',
					},
					{
						label: 'Europe',
						value: 'Europe',
					},
					{
						label: 'Sub-Saharan Africa',
						value: 'Sub-Saharan Africa',
					},
					{
						label: 'Asia',
						value: 'Asia',
					},
				],
			},
			'Sales Channel': {
				type: 'select',
				remote: false,
				options: async (_) => [
					{
						label: 'Online',
						value: 'Online',
					},
					{
						label: 'Offline',
						value: 'Offline',
					},
				],
			},
		}),
	},
}

export const WithFilterAdvanceFeatures: Story = {
	args: {
		features: [SdkFeatureDropdownListEnum.FilterBuilderAdvance],
		query: defaultSdkQuery({}),
		columns: getColumnsDSIdReportingSdk(),
		filterConfig: defaultFilterBuilderConfig({
			Region: {
				type: 'select',
				remote: true,
				current: (selected) =>
					fetch(`https://dummyjson.com/products/${selected}`)
						.then((res) => res.json())
						.then((d) => (d.id !== undefined ? d : undefined))
						.then((d) => ({
							d: d,
							label: d.title,
							value: d ? `${d.id}` : undefined,
						}))
						.catch(() => undefined),
				options: async (params) => {
					try {
						return await fetch(
							`https://dummyjson.com/products/search?q=${
								params.search || ''
							}&limit=${params.limit}&skip=${
								params.limit * (params.index - 1)
							}`,
						)
							.then((res) => res.json())
							.then((d) =>
								d.products.map((d: any) => ({
									label: d.title,
									value: d ? `${d.id}` : undefined,
								})),
							)
					} catch {
						return []
					}
				},
			},
		}),
	},
}
