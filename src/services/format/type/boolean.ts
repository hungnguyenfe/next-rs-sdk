import {
	defaultSdkFormatCommonConfig,
	SdkBaseFormatConfig,
	SdkBaseFormatService,
} from '@/services/format/type/base.ts'
import { SdkFormatType } from '@/services/format'
import { PartialDeep } from 'type-fest'
import defaultsDeep from 'lodash/defaultsDeep'

export interface SdkBooleanFormatConfig
	extends SdkBaseFormatConfig<
		SdkFormatType.Boolean,
		{
			truthyLabel: string
			falsyLabel: string
		}
	> {}

export const defaultSdkBooleanFormatConfig = (
	config: PartialDeep<SdkBooleanFormatConfig, { recurseIntoArrays: true }>,
): SdkBooleanFormatConfig => {
	const base = {
		type: SdkFormatType.Boolean,
		common: defaultSdkFormatCommonConfig(),
		config: {
			truthyLabel: 'True',
			falsyLabel: 'False',
		},
	}

	return defaultsDeep(config, base)
}

export class SdkBooleanFormatService extends SdkBaseFormatService<
	SdkBooleanFormatConfig,
	string
> {
	constructor(config: SdkBooleanFormatConfig) {
		super(config)
	}

	override formatAsValue(value: boolean): string {
		const { prefix, suffix } = this.config.common
		const formatValue =
			value.toString().toLowerCase() === 'true'
				? this.config.config.truthyLabel
				: this.config.config.falsyLabel
		return `${prefix}${formatValue}${suffix}`
	}
}
