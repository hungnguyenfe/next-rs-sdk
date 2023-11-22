import {
	defaultSdkFormatCommonConfig,
	SdkBaseFormatConfig,
	SdkBaseFormatService,
} from '@/services/format/type/base.ts'
import numbro from 'numbro'
import { SdkFormatType } from '@/services/format'
import defaultsDeep from 'lodash/defaultsDeep'
import { PartialDeep } from 'type-fest'

type NumericFormat = string | numbro.Format

export interface SdkNumericFormatConfig
	extends SdkBaseFormatConfig<SdkFormatType.Numeric, NumericFormat> {}

export const defaultSdkNumericFormatConfig = (
	config: PartialDeep<SdkNumericFormatConfig, { recurseIntoArrays: true }>,
): SdkNumericFormatConfig => {
	const base = {
		type: SdkFormatType.Numeric,
		common: defaultSdkFormatCommonConfig(),
		config: {
			thousandSeparated: true,
			mantissa: 2,
		},
	}
	return defaultsDeep(config, base)
}

export class SdkNumericFormatService extends SdkBaseFormatService<
	SdkNumericFormatConfig,
	number | string
> {
	constructor(config: SdkNumericFormatConfig) {
		super(config)
	}

	override formatAsValue(value: number | string): string {
		return numbro(value).format(this.config.config)
	}
}
