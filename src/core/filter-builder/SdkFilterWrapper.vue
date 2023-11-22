<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import {
	SdkFilterItemType,
	SdkFilterGroupType,
	SdkQuery,
	SdkElementColumnConfig,
	SdkFilterBuilderConfig,
} from '@/shared/types/sdk.ts'
import {
	convertFilterToNode,
	defaultTreeNode,
} from '@/core/filter-builder/helpers/node.ts'
import { FormInstance } from 'element-plus'
import { ElForm } from 'element-plus'
import SdkFilterGroup from '@/core/filter-builder/SdkFilterGroup.vue'

export type TreeRoot = {
	id: string
	isRoot: true
	level: 0
	data: SdkFilterGroupType
	isGroup: true
	isLeaf: false
	parent: null
	children: SdkTreeNode[]
}

export type TreeGroup = {
	id: string
	isRoot: false
	level: number
	data: SdkFilterGroupType
	isGroup: true
	isLeaf: false
	parent: TreeGroup | TreeRoot
	children: SdkTreeNode[]
}

export type TreeItem = {
	id: string
	isRoot: false
	level: number
	data: SdkFilterItemType
	isGroup: false
	isLeaf: true
	parent: TreeGroup | TreeRoot
	children: SdkTreeNode[]
}

export type SdkTreeNode = TreeRoot | TreeGroup | TreeItem

const props = defineProps<{
	advance?: boolean
	filter: SdkQuery['filter']
	columns: SdkElementColumnConfig[]
	config: SdkFilterBuilderConfig
}>()

const formRef = ref<FormInstance>()
const tree = ref(defaultTreeNode())

async function validateForm(): Promise<{
	isValid: boolean
	filter: SdkFilterGroupType
}> {
	try {
		await formRef.value?.validate()
		return {
			isValid: true,
			filter: tree.value.data,
		}
	} catch (e) {
		return {
			isValid: false,
			filter: tree.value.data,
		}
	}
}

/**
 * Convert filter to tree data to render and styling
 * **/
watchEffect(() => {
	tree.value = convertFilterToNode(props.filter)
})

defineExpose({
	validateForm,
})
</script>

<template>
	<el-form ref="formRef" :model="tree.data">
		<sdk-filter-group
			:prop="['conditions']"
			:advance="advance"
			:config="config"
			:columns="columns"
			v-model:node="tree" />
	</el-form>
</template>
