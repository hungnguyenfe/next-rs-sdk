<script setup lang="ts">
import axios from 'axios'
import { computed, InjectionKey, provide, ref, watch } from 'vue'
import { QueryClient } from '@tanstack/vue-query'
import { SdkContext } from '@/shared/types/sdk.ts'
import { AxiosError, InternalAxiosRequestConfig } from 'axios'

export interface SDKProviderProps {
	namespace: string
	baseUrl: string
	handleRequestConfigs?: (
		config: InternalAxiosRequestConfig<any>,
	) =>
		| InternalAxiosRequestConfig<any>
		| Promise<InternalAxiosRequestConfig<any>>
	handleResponseError?: (error: AxiosError) => void
}

const props = defineProps<SDKProviderProps>()
const events = ref({
	refetch: 0,
})
const namespace = computed<InjectionKey<SdkContext>>(() =>
	Symbol(props.namespace),
)

function createHttpInstance() {
	const httpClient = axios.create({
		baseURL: props.baseUrl,
	})
	httpClient.interceptors.request.use(
		(c) => {
			return props.handleRequestConfigs?.(c) || c
		},
		(error) => {
			throw new Error(error)
		},
	)
	httpClient.interceptors.response.use(
		(res) => res.data,
		(error) => {
			if (!props.handleResponseError) throw new Error(error)
			props.handleResponseError(error)
		},
	)
	return httpClient
}

function refetch() {
	events.value.refetch++
}

provide(
	namespace.value,
	((): SdkContext => {
		const httpClient = ref(createHttpInstance())
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: 0,
					refetchOnWindowFocus: false,
				},
			},
		})

		watch(
			() => props.baseUrl,
			() => {
				httpClient.value = createHttpInstance()
				events.value.refetch++
			},
		)

		return {
			httpClient,
			queryClient,
			events,
		}
	})(),
)

defineExpose({
	refetch,
})
</script>

<template>
	<slot :namespace="namespace"></slot>
</template>
