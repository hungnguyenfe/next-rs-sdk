import {
	defaultSdkFormatCommonConfig,
	SdkBaseFormatConfig,
	SdkBaseFormatService,
} from '@/services/format/type/base.ts'
import { SdkFormatType } from '@/services/format'
import { SdkTemporalFormatConfig } from '@/services/format/type/temporal.ts'
import defaultsDeep from 'lodash/defaultsDeep'
import { PartialDeep } from 'type-fest'

export interface SdkTextFormatConfig
	extends SdkBaseFormatConfig<SdkFormatType.Text, {}> {}

export const defaultSdkTextFormatConfig = (
	config: PartialDeep<SdkTemporalFormatConfig, { recurseIntoArrays: true }>,
): SdkTemporalFormatConfig => {
	const base = {
		type: SdkFormatType.Text,
		common: defaultSdkFormatCommonConfig(),
		config: {},
	}

	return defaultsDeep(config, base)
}

export class SdkTextFormatService extends SdkBaseFormatService<
	SdkTextFormatConfig,
	string
> {
	constructor(config: SdkTextFormatConfig) {
		super(config)
	}

	override formatAsValue(value: string): string {
		const { prefix, suffix } = this.config.common
		return `${prefix}${value}${suffix}`
	}
}
