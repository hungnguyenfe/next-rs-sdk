import defaultsDeep from 'lodash/defaultsDeep'
import { PartialDeep } from 'type-fest'
import { ColumnTypeEnum, SdkElementColumnConfig } from '@/shared/types/sdk.ts'
import { defaultSdkTextFormatConfig } from '@/services/format/type/text.ts'
import { SdkFormatType } from '@/services/format'
import { defaultSdkTemporalFormatConfig } from '@/services/format/type/temporal.ts'
import { defaultSdkNumericFormatConfig } from '@/services/format/type/numeric.ts'
import { defaultSdkBooleanFormatConfig } from '@/services/format/type/boolean.ts'

export const defaultSdkElementColumns = (
	columns: ReadonlyArray<
		PartialDeep<
			SdkElementColumnConfig | undefined,
			{ recurseIntoArrays: true }
		>
	>,
) => {
	const base = (): SdkElementColumnConfig => ({
		name: '',
		type: ColumnTypeEnum.Text,
		title: '',
		width: 100,
		visible: true,
		autoWidth: true,
		sortable: false,
		format: defaultSdkTextFormatConfig({}),
	})
	return columns.map((column) => {
		if (!column) return base()
		if (!column.format) column.format = defaultSdkTextFormatConfig({})
		switch (column.format.type) {
			case SdkFormatType.Numeric:
				column.format = defaultSdkNumericFormatConfig(column.format)
				break
			case SdkFormatType.Boolean:
				column.format = defaultSdkBooleanFormatConfig(column.format)
				break
			case SdkFormatType.Temporal:
				column.format = defaultSdkTemporalFormatConfig(column.format)
				break
			default:
				column.format = defaultSdkTextFormatConfig({})
				break
		}
		return defaultsDeep(column, base()) as SdkElementColumnConfig
	})
}
