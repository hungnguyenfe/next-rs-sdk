import { SdkFormatType } from '@/services/format'

export interface SdkBaseFormatConfig<
	T extends SdkFormatType,
	C extends Object,
> {
	type: T
	common: {
		prefix: string
		suffix: string
		invalidReplacement: {
			undefined: string
			null: string
			NaN: string
		}
		invalidTemplate: string
	}
	config: C
}

export const defaultSdkFormatCommonConfig = (): SdkBaseFormatConfig<
	SdkFormatType.Text,
	any
>['common'] => ({
	prefix: '',
	suffix: '',
	invalidReplacement: {
		undefined: 'Undefined',
		null: 'Null',
		NaN: 'NaN',
	},
	invalidTemplate: '',
})

export abstract class SdkBaseFormatService<
	C extends SdkBaseFormatConfig<any, any> = any,
	V = string,
> {
	protected config: C

	protected constructor(config: C) {
		this.config = config
	}

	protected isValidValue(value: any) {
		return ![undefined, null, NaN].includes(value)
	}

	public format(value: any) {
		// Check and parse invalid value
		const { invalidTemplate, invalidReplacement } = this.config.common
		if (!this.isValidValue(value)) {
			const invalidValue =
				invalidReplacement[value as keyof typeof invalidReplacement]
			return invalidTemplate
				? invalidTemplate.replace(`$value`, invalidValue)
				: invalidValue
		}
		return this.formatAsValue(value)
	}

	protected abstract formatAsValue(value: any): V
}
