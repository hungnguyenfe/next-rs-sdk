<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import {
	BaseInputEmits,
	BaseInputProps,
} from '@/core/filter-builder/components/base.ts'
import { ElIcon, ElOption, ElSelect } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { SdkOperator, SdkSelectParamsRequest } from '@/shared/types/sdk.ts'
import { isArray, isObject } from 'lodash'
import { useCollapseSelect } from '@/core/filter-builder/composables/collapseSelect.ts'

type Option = { label: string; value: unknown }

const props = defineProps<BaseInputProps<string | string[]>>()
const emits = defineEmits<BaseInputEmits<string | string[]>>()

const selected = ref<Option | Option[] | undefined[]>()
const loadingSearch = ref(false)
const loadingSelected = ref(false)
const options = ref<Array<Option>>([])
const params = ref<SdkSelectParamsRequest>({
	index: 1,
	limit: 10,
	search: '',
})
const { selectRef, max, collapsed } = useCollapseSelect(
	computed(() => {
		if (!isArray(selected.value)) return []
		return selected.value.map((v) => (isObject(v) ? v.value : v))
	}),
	true,
)
const isMultiple = computed(
	() =>
		props.operator === SdkOperator.In ||
		props.operator === SdkOperator.NotIn,
)

/**
 * Init selected option base on model value
 * **/
onBeforeMount(async () => {
	if (props.config?.remote) {
		if (!props.modelValue) return
		try {
			loadingSelected.value = true
			if (isMultiple.value) {
				const options = await Promise.all(
					(props.modelValue as string[]).map(
						(v) =>
							props
								.config!.current(v)
								.catch(() => undefined) as Promise<Option>,
					),
				)
				const filterOptions = options.filter((o) => !!o)
				if (filterOptions.length !== options.length)
					emits(
						'update:modelValue',
						filterOptions.map((o) => o.value) as string[],
					)
				else selected.value = filterOptions
			} else {
				const option = await props.config?.current(props.modelValue)
				if (!option) emits('update:modelValue', '')
				else selected.value = option
			}
		} catch (e) {
			console.error('Failed to get selected', e)
			selected.value = isMultiple ? undefined : []
		} finally {
			loadingSelected.value = false
		}
	} else {
		await getListOptions('')
		selected.value = options.value.find((o) => o.value === props.modelValue)
	}
})

async function getListOptions(search: string) {
	params.value.search = search
	if (!search && props.config?.remote) {
		options.value = []
		return
	}
	loadingSearch.value = true
	try {
		options.value = (await props.config?.options(params.value)) || []
	} catch (e) {
		console.error('Failed to search')
		options.value = []
	} finally {
		loadingSearch.value = false
	}
}

watch(selected, (selected) => {
	if (loadingSelected.value) return
	if (isArray(selected)) {
		const v = selected.map((s) => (isObject(s) ? s.value : s))
		v.toString() !== props.modelValue.toString() &&
			emits('update:modelValue', v as string[])
	} else {
		const v = isObject(selected) ? selected.value : selected
		v !== props.modelValue && emits('update:modelValue', v as string)
	}
})

watch(
	() => props.operator,
	() => (selected.value = isMultiple ? [] : undefined),
)
</script>

<template>
	<div class="select-container">
		<el-select
			ref="selectRef"
			class="selected"
			:placeholder="
				config?.remote ? `Enter keyword to search` : 'Select a value'
			"
			v-model="selected"
			:disabled="loadingSelected"
			:remote="config?.remote"
			:remote-method="getListOptions"
			:loading="loadingSearch"
			:multiple="isMultiple"
			:collapse-tags="collapsed"
			:collapse-tags-tooltip="collapsed"
			:max-collapse-tags="max"
			clearable
			remote-show-suffix
			filterable>
			<el-option
				v-for="op in options"
				:key="op.value as string"
				:label="op.label"
				:value="op.value as string" />
		</el-select>
		<el-icon
			v-if="loadingSearch || loadingSelected"
			:size="15"
			class="loading">
			<Loading />
		</el-icon>
	</div>
</template>

<style scoped lang="scss">
@keyframes spin {
	from {
		transform: translateY(-50%) rotate(0deg);
	}
	to {
		transform: translateY(-50%) rotate(360deg);
	}
}

.select-container {
	position: relative;

	.selected {
		width: 100%;
	}

	.loading {
		position: absolute;
		z-index: 10;
		right: 10px;
		top: 50%;
		animation-name: spin;
		animation-duration: 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
}
</style>
