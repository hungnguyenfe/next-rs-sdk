import { computed, type Ref } from 'vue'
import { SDKProviderProps } from '@/core/config-provider/SdkConfigProvider.vue'

export const useStories = (
	args: Ref<any>,
	updateArgs: Ref<(args: any) => void>,
) => {
	const props = computed(() => ({ ...args.value }))
	const handleRequestConfigs = computed<
		SDKProviderProps['handleRequestConfigs']
	>(() => (config) => {
		config.headers = config.headers || {}
		if (args.value.clientId) {
			config.headers['x-ps-client-id'] = args.value.clientId
			config.headers.Authorization = 'Bearer ' + args.value.token
		} else {
			config.headers.Authorization = args.value.token || ''
		}
		return config
	})
	const updateProps = (partialArgs: any) => {
		updateArgs.value({ ...args, ...partialArgs })
	}
	return {
		props,
		updateProps,
		handleRequestConfigs,
	}
}
