<script setup lang="ts">
import { computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElButton, ElCard, ElOption, ElSelect } from 'element-plus'
import { nanoid } from 'nanoid'
import {
	TreeGroup,
	TreeItem,
	TreeRoot,
} from '@/core/filter-builder/SdkFilterWrapper.vue'
import {
	SdkElementColumnConfig,
	SdkFilterBuilderConfig,
	SdkFilterGroupType,
	SdkFilterItemType,
	SdkOperator,
} from '@/shared/types/sdk.ts'
import SdkFilterItem from '@/core/filter-builder/SdkFilterItem.vue'

const props = defineProps<{
	advance?: boolean
	prop: string[]
	node: TreeRoot | TreeGroup
	columns: SdkElementColumnConfig[]
	config: SdkFilterBuilderConfig
}>()
const emits = defineEmits<{
	(e: 'updated:node', d: TreeRoot | TreeGroup): void
}>()

const node = computed({
	get: () => props.node,
	set: (newNode: TreeRoot | TreeGroup) => emits('updated:node', newNode),
})

function addNodeItem(parent?: TreeGroup | TreeRoot) {
	const data: SdkFilterItemType = {
		column: props.columns[0]?.name || '',
		operator: SdkOperator.Equal,
		value: '',
	}
	const child: TreeItem = {
		id: nanoid(),
		isLeaf: true,
		isGroup: false,
		isRoot: false,
		data,
		level: props.node.level + 1,
		parent: parent ? parent : node.value,
		children: [],
	}
	;(parent ?? node.value).children.push(child)
	;(parent ?? node.value).data.conditions.push(data)
}

function addNodeGroup() {
	const data: SdkFilterGroupType = {
		type: 'AND',
		conditions: [],
	}
	const child: TreeGroup = {
		id: nanoid(),
		isLeaf: false,
		isGroup: true,
		isRoot: false,
		data,
		level: node.value.level + 1,
		parent: node.value,
		children: [],
	}
	node.value.children.push(child)
	node.value.data.conditions.push(data)
	addNodeItem(child)
}

function deleteNode() {
	if (node.value.isRoot) return
	const index = node.value.parent.children.findIndex(
		(c) => c.id === node.value.id,
	)
	if (index === -1) return
	node.value.parent.children.splice(index, 1)
	node.value.parent.data.conditions.splice(index, 1)
}
</script>

<template>
	<el-card
		class="sdk-filter-group"
		:class="{ '--is-root': node.level === 0, '--advance': advance }"
		:style="{
			'--content-level': node.level,
			'--children-level': node.level + 1,
		}">
		<div v-if="advance" class="sdk-filter-group-content">
			<el-select class="sdk-filter-group-type" v-model="node.data.type">
				<el-option value="AND">AND</el-option>
				<el-option value="OR">OR</el-option>
			</el-select>
			<el-button
				type="primary"
				class="sdk-filter-group-action"
				@click="addNodeGroup()"
				>Add Group</el-button
			>
			<el-button
				type="primary"
				class="sdk-filter-group-action"
				@click="addNodeItem()"
				>Add One</el-button
			>
			<el-button
				v-if="node.level"
				:icon="Delete"
				class="sdk-filter-group-action--right sdk-delete-filter"
				type="danger"
				link
				circle
				@click="deleteNode()" />
		</div>
		<div
			class="sdk-filter-group-children"
			:class="{ '--advance': advance }">
			<template
				v-for="(_childNode, index) in node.children"
				:key="_childNode.id">
				<sdk-filter-group
					v-if="node.children[index].isGroup"
					v-model:node="node.children[index] as TreeGroup"
					:advance="advance"
					:prop="[...prop, index.toString(), 'conditions']"
					:config="config"
					:columns="columns" />
				<sdk-filter-item
					v-else
					v-model:node="node.children[index] as TreeItem"
					:prop="advance ? [...prop, index.toString()] : []"
					:advance="advance"
					:config="config"
					:columns="columns" />
			</template>
		</div>
		<div v-if="!advance && !node.data.conditions.length">
			<span>There is no filter available.</span>
		</div>
	</el-card>
</template>

<style scoped lang="scss">
$item-gap: 20px;
$padding-x: 40px;
$border-tree-width: calc($padding-x / 2);
$border-tree-height: calc(50% + $item-gap);
$item-label-height: calc(0.7rem);

@mixin border-tree($top, $type, $isItem) {
	content: '';
	position: absolute;
	border-left: 1px solid var(--el-border-color);
	@if ($type == before) {
		border-bottom: 1px solid var(--el-border-color);
	} @else {
		border-top: 1px solid var(--el-border-color);
	}
	@if $isItem == true {
		@if $type == before {
			bottom: calc(50% - 1px);
			height: calc($border-tree-height);
		} @else {
			top: 50%;
			height: calc($border-tree-height - $item-label-height);
		}
		width: calc($border-tree-width - 2px);
		left: calc(-1 * $border-tree-width + 1px);
	} @else {
		top: $top;
		width: calc($border-tree-width - 1px);
		left: calc(-1 * $border-tree-width);
		height: $border-tree-height;
	}
}

.sdk-filter-group {
	width: 100%;
	cursor: auto;
	position: relative;
	overflow: visible;

	&.--advance {
		&:not(.--is-root) {
			&:before {
				@include border-tree(calc($item-gap / -1), before, false);
			}

			&:not(:last-child):after {
				@include border-tree(50%, after, false);
			}
		}
	}

	&:not(.--advance) {
		margin-bottom: 20px;
	}

	&-type {
		width: 90px;
	}

	&-content {
		display: flex;
		gap: 10px;
	}

	&-action {
		margin-left: 0;

		&--right {
			margin-left: auto;
		}
	}

	&.--is-root {
		border: none;
		box-shadow: none;

		> :deep(.el-card__body) {
			padding: 0;
		}

		> .sdk-filter-group-content {
			margin-top: 0;
		}
	}
}

.sdk-filter-group-children {
	display: flex;
	flex-direction: column;
	gap: $item-gap;

	&:not(:empty) {
		margin-top: $item-gap;
	}

	&.--advance {
		padding: 0 0 0 $padding-x;
		> :deep(.sdk-filter-item) {
			position: relative;

			&:before {
				@include border-tree(calc($item-gap / -1), before, true);
			}

			&:not(:last-child):after {
				@include border-tree(calc(50%), after, true);
			}
		}
	}
}
</style>
