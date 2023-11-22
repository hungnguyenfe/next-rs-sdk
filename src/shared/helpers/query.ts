import defaultsDeep from 'lodash/defaultsDeep'
import { PartialDeep } from 'type-fest'
import { SdkQuery } from '@/shared/types/sdk.ts'

export const defaultSdkQuery = (query: PartialDeep<SdkQuery>) => {
	const base = (): SdkQuery => ({
		group: {
			columns: [],
			aggregations: [],
		},
		filter: {
			type: 'AND',
			conditions: [],
		},
		sort: undefined,
		pagination: {
			limit: 10,
			index: 1,
		},
	})
	return defaultsDeep(query, base())
}
