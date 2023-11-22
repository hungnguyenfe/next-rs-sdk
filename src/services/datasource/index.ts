import {
	AbstractDataSource,
	LocalDataSource,
	RemoteDataSource,
} from '@/services/datasource/datasources.ts'
import { Axios } from 'axios'
import { SdkContext } from '@/shared/types/sdk.ts'
import { Ref } from 'vue'

interface DataSourceMapper {
	[key: string]: {
		isApplicable: (ds: string) => boolean
		instance: (
			httpClientRef: Ref<Axios>,
			datasource: string,
		) => AbstractDataSource
	}
}

const dataSource: DataSourceMapper = {
	local: {
		isApplicable: (ds: string) => window[ds as any] !== undefined,
		instance: (httpClientRef, datasource) =>
			new LocalDataSource(httpClientRef, datasource),
	},
	remote: {
		isApplicable: (ds: string) => window[ds as any] === undefined,
		instance: (httpClientRef, datasource) =>
			new RemoteDataSource(httpClientRef, datasource),
	},
}

export class DataSourceRepository {
	private static mapper: Record<string, AbstractDataSource> = {}

	static getDatasource(context: SdkContext, datasource: string) {
		if (!this.mapper[datasource]) {
			const { instance } =
				Object.values(dataSource).find(({ isApplicable }) =>
					isApplicable(datasource),
				) || dataSource.local
			this.mapper[datasource] = instance(context.httpClient, datasource)
		}
		return this.mapper[datasource]
	}
}
