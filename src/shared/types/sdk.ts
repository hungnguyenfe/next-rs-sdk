import { Axios } from 'axios'
import { QueryClient } from '@tanstack/vue-query'
import { SdkFormatFactoryConfig } from '@/services/format'
import { Ref } from 'vue'

export interface SdkContext {
	httpClient: Ref<Axios>
	queryClient: QueryClient
	events: Ref<{
		refetch: number
	}>
}

export enum ColumnTypeEnum {
	Text = 'text',
	Number = 'number',
	Date = 'date',
	DateTime = 'datetime',
	Boolean = 'boolean',
}

export interface SdkElementColumnConfig {
	name: string
	type: ColumnTypeEnum
	title: string
	width: number
	visible: boolean
	autoWidth: boolean
	sortable: boolean
	format: SdkFormatFactoryConfig
}

export interface DsColumn {
	columns: Array<{
		label: string
		name: string
		type: string
		alias: string
	}>
}

export interface DsCount {
	count: number
}

export interface DsDataSource<Datasource extends Object = {}> {
	cols: DsColumn['columns']
	rows: Datasource[][]
}

export interface SdkGroupColumn {
	name: string
}

export enum SdkAggregationType {
	SUM = 'sum',
	AVERAGE = 'avg',
	COUNT = 'count',
	MIN = 'min',
	MAX = 'max',
	CONCAT = 'concat',
	DISTINCT = 'distinct',
}

export interface SdkAggregation {
	column: string
	aggregation: SdkAggregationType
	alias?: string
}

export interface SdkField {
	name: string
	alias?: string
}

export interface SdkPagination {
	limit: number
	index: number
}

export enum SdkOperator {
	Equal = '$eq',
	NotEqual = '$ne',
	Greater = '$gt',
	GreaterEqual = '$gte',
	Less = '$lt',
	LessEqual = '$lte',
	IsTrue = 'is_true',
	IsFalse = 'is_false',
	IsEmpty = 'empty',
	IsNotEmpty = 'not_empty',
	IsNull = 'null',
	IsNotNull = 'not_null',
	Contains = 'contains',
	NotContains = 'not_contain',
	StartsWith = 'starts_with',
	NotStartWidth = 'not_start_with',
	EndsWith = 'ends_with',
	NotEndWidth = 'not_end_with',
	InRange = 'in_range',
	In = 'in',
	NotIn = 'not_in',
}

export interface SdkEqualFilter {
	column: string
	operator: SdkOperator.Equal | SdkOperator.NotEqual
	value: string | number
}

export interface SdkTextFilter {
	column: string
	operator:
		| SdkOperator.Contains
		| SdkOperator.NotContains
		| SdkOperator.StartsWith
		| SdkOperator.NotStartWidth
		| SdkOperator.EndsWith
		| SdkOperator.NotEndWidth
	value: string
}

export interface SdkNumberOrDateFilter {
	column: string
	operator:
		| SdkOperator.Greater
		| SdkOperator.GreaterEqual
		| SdkOperator.Less
		| SdkOperator.LessEqual
	value: number | string
}

export interface SdkBooleanFilter {
	column: string
	operator: SdkOperator.IsFalse | SdkOperator.IsTrue
	value: ''
}

export interface SdkInFilter {
	column: string
	operator: SdkOperator.In | SdkOperator.NotIn
	value: string[] | number[]
}

export interface SdkInRangeFilter<T extends string | number = string> {
	column: string
	operator: SdkOperator.InRange
	value: [T, T]
}

export type SdkFilterItemType =
	| SdkEqualFilter
	| SdkNumberOrDateFilter
	| SdkTextFilter
	| SdkBooleanFilter
	| SdkInFilter
	| SdkInRangeFilter

export interface SdkFilterGroupType {
	type: 'AND' | 'OR'
	conditions: Array<SdkFilterGroupType | SdkFilterItemType>
}

export interface SdkSort {
	column: string
	direction: 'asc' | 'desc'
}

export interface SdkQuery {
	fields: Array<{ name: string }>
	group: { columns: SdkGroupColumn[]; aggregations: SdkAggregation[] }
	filter: SdkFilterGroupType
	pagination: SdkPagination
	sort: SdkSort | undefined
}

export interface DsQuery {
	query: {
		distinct?: boolean
		paging: { limit: number; current: number }
		orders: SdkSort[]
		group: { columns: SdkGroupColumn[]; aggregations: SdkAggregation[] }
		filter: SdkFilterGroupType | {}
		fields: SdkField[]
	}
}

export interface SdkSelectParamsRequest {
	index: number
	limit: number
	search?: string
}

export interface SdkFilterSelectConfig {
	type: 'select'
	remote: boolean
	current: (
		selected: unknown,
	) => Promise<{ label: string; value: unknown } | undefined>
	options: (
		params: SdkSelectParamsRequest,
	) => Promise<Array<{ label: string; value: unknown }>>
}

export type SdkFilterBuilderConfig = Record<string, SdkFilterSelectConfig>
