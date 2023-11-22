import {
	defaultSdkFormatCommonConfig,
	SdkBaseFormatConfig,
	SdkBaseFormatService,
} from '@/services/format/type/base.ts'
import { format, parseISO } from 'date-fns'
import { SdkFormatType } from '@/services/format'
import { PartialDeep } from 'type-fest'
import defaultsDeep from 'lodash/defaultsDeep'

export interface SdkTemporalFormatConfig
	extends SdkBaseFormatConfig<
		SdkFormatType.Temporal,
		{
			/**
			 * Please check https://date-fns.org/v2.30.0/docs/format to have more information about format
			 * **/
			format: string
		}
	> {}

export const defaultSdkTemporalFormatConfig = (
	config: PartialDeep<SdkTemporalFormatConfig, { recurseIntoArrays: true }>,
): SdkTemporalFormatConfig => {
	const base = {
		type: SdkFormatType.Temporal,
		common: defaultSdkFormatCommonConfig(),
		config: {
			format: 'MM/dd/yyyy',
		},
	}

	return defaultsDeep(config, base)
}

export class SdkTemporalFormatService extends SdkBaseFormatService<
	SdkTemporalFormatConfig,
	string
> {
	constructor(config: SdkTemporalFormatConfig) {
		super(config)
	}

	private formatDate(value: string) {
		return format(new Date(value), this.config.config.format)
	}

	override formatAsValue(value: string): string {
		return this.formatDate(value)
	}

	override isValidValue(value: string): boolean {
		return (
			super.isValidValue(value) &&
			parseISO(value).toString() !== 'Invalid Date'
		)
	}
}
