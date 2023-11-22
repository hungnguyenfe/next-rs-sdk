import { DataSourceRepository } from '@/services/datasource'
import { useQuery } from '@tanstack/vue-query'
import { computed, ref, Ref, watch } from 'vue'
import {
	DsDataSource,
	DsQuery,
	SdkContext,
	SdkFilterGroupType,
	SdkFilterItemType,
	SdkOperator,
	SdkQuery,
} from '@/shared/types/sdk.ts'
import { useCloned } from '@vueuse/core'
import { getExpression } from '@/shared/composables/expression.ts'
import { isEmpty } from '@/shared/helpers/validate.ts'

export interface Element {
	rows: DsDataSource['rows']
	cols: DsDataSource['cols']
	count: number
}

export const useElementDataSource = (
	context: SdkContext,
	dataSource: Ref<string>,
	query: Ref<SdkQuery>,
	removeFilterOnEmpty?: Ref<boolean>,
) => {
	const cached = ref<Element>({
		cols: [],
		rows: [],
		count: 0,
	})

	const refetch = computed(() => context.events.value.refetch)
	const parseQuery = computed(() => parseSdkQueryToDsQuery(query.value))
	const datasource = computed(() =>
		DataSourceRepository.getDatasource(context, dataSource.value),
	)

	const { isLoading: execLoading, data: execData } = useQuery(
		[dataSource, parseQuery, 'exec', refetch],
		() => datasource.value.exec(parseQuery.value),
		{
			queryClient: context.queryClient,
		},
	)
	const { isLoading: countLoading, data: countData } = useQuery(
		[dataSource, parseQuery, 'count', refetch],
		() => datasource.value.count(parseQuery.value),
		{
			queryClient: context.queryClient,
		},
	)

	const isLoading = computed(() => execLoading.value || countLoading.value)

	function parseSdkQueryToDsQuery(query: SdkQuery): DsQuery {
		return {
			query: {
				fields: [],
				group: query.group,
				filter: buildFilter(query.filter),
				orders: query.sort ? [query.sort] : [],
				paging: {
					current: query.pagination.index,
					limit: query.pagination.limit,
				},
			},
		}
	}

	function buildFilter(queryFilter: SdkQuery['filter']) {
		const { cloned: filter } = useCloned(queryFilter)
		let stacks: Array<SdkFilterGroupType | SdkFilterItemType> = [
			filter.value,
		]
		const isGroup = (
			node: SdkFilterGroupType | SdkFilterItemType,
		): node is SdkFilterGroupType => node.hasOwnProperty('conditions')

		while (stacks.length) {
			const filterNode = stacks.pop()
			if (!filterNode) break
			if (isGroup(filterNode)) {
				filterNode.conditions.filter((c) => {
					return isGroup(c) || !removeFilterOnEmpty?.value
						? true
						: !isEmpty(c.value)
				})
				filterNode.conditions = filterNode.conditions.filter((c) =>
					isGroup(c) || !removeFilterOnEmpty?.value
						? true
						: !isEmpty(c.value),
				)
				stacks = [...stacks, ...filterNode.conditions]
			} else if (filterNode.operator === SdkOperator.InRange) {
				const expression = getExpression(filterNode.value)
				if (expression) {
					filterNode.value = expression.parseValues()
				}
			}
		}
		return filter.value
	}

	watch(isLoading, (isLoading) => {
		if (!isLoading) {
			cached.value = {
				cols: execData.value?.cols ?? [],
				rows: execData.value?.rows ?? [],
				count: countData.value?.count ?? 0,
			}
		}
	})

	return {
		isLoading,
		countLoading,
		execLoading,
		data: computed(() => ({
			cols: execData.value?.cols || cached.value.cols,
			rows: execData.value?.rows || cached.value.rows,
			count: countData.value?.count || cached.value.count,
		})),
	}
}
