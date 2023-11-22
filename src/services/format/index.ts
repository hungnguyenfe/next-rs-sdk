import {
	SdkNumericFormatConfig,
	SdkNumericFormatService,
} from '@/services/format/type/numeric.ts'
import { SdkBaseFormatService } from '@/services/format/type/base.ts'
import {
	SdkTextFormatConfig,
	SdkTextFormatService,
} from '@/services/format/type/text.ts'
import {
	SdkTemporalFormatConfig,
	SdkTemporalFormatService,
} from '@/services/format/type/temporal.ts'
import {
	SdkBooleanFormatConfig,
	SdkBooleanFormatService,
} from '@/services/format/type/boolean.ts'

export enum SdkFormatType {
	Text = 'text',
	Temporal = 'temporal',
	Numeric = 'numeric',
	Boolean = 'boolean',
}

export type SdkFormatFactoryConfig =
	| SdkTextFormatConfig
	| SdkNumericFormatConfig
	| SdkTemporalFormatConfig
	| SdkBooleanFormatConfig

export class SdkFormatFactory {
	static formatValue(config: SdkFormatFactoryConfig, value: string) {
		let instance: SdkBaseFormatService<any, any>

		switch (config.type) {
			case SdkFormatType.Numeric:
				instance = new SdkNumericFormatService(config)
				break
			case SdkFormatType.Temporal:
				instance = new SdkTemporalFormatService(config)
				break
			case SdkFormatType.Boolean:
				instance = new SdkBooleanFormatService(config)
				break
			default:
				instance = new SdkTextFormatService(config)
				break
		}

		return instance.format(value)
	}
}
