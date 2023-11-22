import { Axios } from 'axios'
import { DsColumn, DsCount, DsDataSource, DsQuery } from '@/shared/types/sdk.ts'
import { Ref } from 'vue'

export abstract class AbstractDataSource {
	protected dataSource: string
	protected httpClientRef: Ref<Axios>

	protected constructor(httpClientRef: Ref<Axios>, dataSource: string) {
		this.httpClientRef = httpClientRef
		this.dataSource = dataSource
	}

	abstract exec(query: DsQuery): Promise<DsDataSource>

	abstract columns(): Promise<DsColumn>

	abstract count(_query: DsQuery): Promise<DsCount>
}

export class LocalDataSource extends AbstractDataSource {
	constructor(httpClientRef: Ref<Axios>, dataSource: string) {
		super(httpClientRef, dataSource)
	}

	override exec(_query: DsQuery): Promise<DsDataSource> {
		return Promise.resolve({ cols: [], rows: [] })
	}

	override columns(): Promise<DsColumn> {
		return Promise.resolve({ columns: [] })
	}

	override count(_query: DsQuery): Promise<DsCount> {
		return Promise.resolve({ count: 0 })
	}
}

export class RemoteDataSource extends AbstractDataSource {
	constructor(httpClientRef: Ref<Axios>, dataSource: string) {
		super(httpClientRef, dataSource)
	}

	override exec(query: DsQuery): Promise<DsDataSource> {
		return this.httpClientRef.value.post(
			`ds/${this.dataSource}/exec`,
			query,
		)
	}

	override columns(): Promise<DsColumn> {
		return this.httpClientRef.value.get(`ds/${this.dataSource}/columns`)
	}

	override count(query: DsQuery): Promise<DsCount> {
		return this.httpClientRef.value.post(
			`ds/${this.dataSource}/count`,
			query,
		)
	}
}
