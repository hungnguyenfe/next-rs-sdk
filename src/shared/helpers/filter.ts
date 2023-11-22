import {
	SdkFilterBuilderConfig,
	SdkSelectParamsRequest,
} from '@/shared/types/sdk.ts'
import { PartialDeep } from 'type-fest'

export const defaultFilterBuilderConfig = (
	config: PartialDeep<SdkFilterBuilderConfig>,
) => {
	Object.keys(config).map((key) => {
		const subConfig = config[key]
		if (!subConfig?.type) throw new Error('Filter config required a type')

		if (subConfig.type === 'select') {
			typeof subConfig.remote !== 'boolean' && (subConfig.remote = true)
			!subConfig.options &&
				(subConfig.options = async (
					_params: SdkSelectParamsRequest,
				) => [])
		}
		return { ...subConfig }
	})
	return config
}
