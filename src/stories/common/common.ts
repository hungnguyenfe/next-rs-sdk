import { defaultSdkElementColumns } from '@/shared/helpers'
import { SdkFormatType } from '@/services/format'
import { ColumnTypeEnum } from '@/shared/types/sdk.ts'

export const getColumnsDSIdReportingSdk = () =>
	defaultSdkElementColumns([
		{
			name: 'Region',
			title: 'Region',
			type: ColumnTypeEnum.Text,
			sortable: true,
		},
		{
			name: 'Country',
			title: 'Country',
			type: ColumnTypeEnum.Text,
			sortable: true,
		},
		{
			name: 'Item Type',
			title: 'Item Type',
			type: ColumnTypeEnum.Text,
			sortable: true,
		},
		{
			name: 'Sales Channel',
			title: 'Sales Channel',
			type: ColumnTypeEnum.Text,
		},
		{
			name: 'Order Priority',
			title: 'Order Priority',
			type: ColumnTypeEnum.Text,
		},
		{
			name: 'Order Date',
			title: 'Order Date',
			type: ColumnTypeEnum.Date,
			width: 200,
			autoWidth: false,
			format: {
				type: SdkFormatType.Temporal,
			},
			sortable: true,
		},
		{ name: 'Order ID', title: 'Order ID', type: ColumnTypeEnum.Text },
		{
			name: 'Ship Date',
			title: 'Ship Date',
			type: ColumnTypeEnum.Date,
			width: 200,
			autoWidth: false,
			format: {
				type: SdkFormatType.Temporal,
			},
			sortable: true,
		},
		{
			name: 'Units Sold',
			title: 'Units Sold',
			type: ColumnTypeEnum.Number,
			format: {
				type: SdkFormatType.Numeric,
				config: {
					thousandSeparated: true,
				},
			},
			sortable: true,
		},
		{
			name: 'Unit Price',
			title: 'Unit Price',
			type: ColumnTypeEnum.Number,
			format: {
				type: SdkFormatType.Numeric,
				common: { prefix: '$' },
				config: {
					thousandSeparated: true,
				},
			},
			sortable: true,
		},
		{
			name: 'Unit Cost',
			title: 'Unit Cost',
			type: ColumnTypeEnum.Number,
			format: {
				type: SdkFormatType.Numeric,
				common: { prefix: '$' },
				config: {
					thousandSeparated: true,
				},
			},
			sortable: true,
		},
		{
			name: 'Total Revenue',
			title: 'Total Revenue',
			type: ColumnTypeEnum.Number,
			width: 150,
			autoWidth: false,
			format: {
				type: SdkFormatType.Numeric,
				common: { prefix: '$' },
				config: {
					thousandSeparated: true,
				},
			},
			sortable: true,
		},
		{
			name: 'Total Cost',
			title: 'Total Cost',
			type: ColumnTypeEnum.Number,
			width: 150,
			autoWidth: false,
			format: {
				type: SdkFormatType.Numeric,
				common: { prefix: '$' },
				config: {
					thousandSeparated: true,
				},
			},
			sortable: true,
		},
		{
			name: 'Total Profit',
			title: 'Total Profit',
			type: ColumnTypeEnum.Number,
			width: 150,
			autoWidth: false,
			format: {
				type: SdkFormatType.Numeric,
				common: { prefix: '$' },
				config: {
					thousandSeparated: true,
				},
			},
			sortable: true,
		},
	])
