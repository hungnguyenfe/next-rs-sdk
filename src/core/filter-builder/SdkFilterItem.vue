<script setup lang="ts">
import { ElButton, ElFormItem, ElOption, ElSelect } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { computed, toRef, watch } from 'vue'
import { TreeItem } from '@/core/filter-builder/SdkFilterWrapper.vue'
import {
	ColumnTypeEnum,
	SdkElementColumnConfig,
	SdkFilterBuilderConfig,
	SdkOperator,
} from '@/shared/types/sdk.ts'
import { useFilters } from '@/core/filter-builder/composables/filter.ts'

const props = defineProps<{
	advance?: boolean
	node: TreeItem
	columns: SdkElementColumnConfig[]
	prop: string[]
	config: SdkFilterBuilderConfig
}>()
const emits = defineEmits<{
	(e: 'updated:node', d: TreeItem): void
}>()

const node = computed({
	get: () => props.node,
	set: (newNode: TreeItem) => emits('updated:node', newNode),
})
const {
	column,
	operators,
	valueRule,
	inputValueComponent,
	requireValue,
	inputConfig,
} = useFilters(node, toRef(props.columns), toRef(props, 'config'))

function deleteNode() {
	if (node.value.isRoot) return
	const index = node.value.parent.children.findIndex(
		(c) => c.id === node.value.id,
	)
	if (index === -1) return
	node.value.parent.children.splice(index, 1)
	node.value.parent.data.conditions.splice(index, 1)
}

/**
 * Reset operator and value if changed column
 * **/
watch(
	() => props.node.data.column,
	(newCol, preCol) =>
		newCol !== preCol &&
		Object.assign(props.node.data, { operator: '', value: '' }),
)

/**
 * Reset value if changed operator
 * **/
watch(
	() => props.node.data.operator,
	(newOp, preOp) => {
		if (newOp === preOp) return
		if (
			[SdkOperator.In, SdkOperator.NotIn, SdkOperator.InRange].includes(
				newOp,
			)
		) {
			Object.assign(props.node.data, { value: [] })
		} else {
			Object.assign(props.node.data, {
				value: column.value?.type === ColumnTypeEnum.Number ? 0 : '',
			})
		}
	},
)
</script>

<template>
	<div class="sdk-filter-item" :class="{ '--advance': advance }">
		<el-form-item
			v-if="advance"
			class="sdk-filter-item-col"
			label="Column"
			:prop="[...prop, 'column']"
			:rules="{
				required: true,
				message: 'Column is required',
				trigger: ['blur', 'change'],
			}">
			<el-select
				filterable
				placeholder="Pick a column"
				v-model="node.data.column">
				<el-option
					v-for="column in columns"
					:key="column.name"
					:label="column.title || column.name"
					:value="column.name" />
			</el-select>
		</el-form-item>

		<el-form-item
			v-if="advance"
			class="sdk-filter-item-col"
			label="Operator"
			:prop="[...prop, 'operator']"
			:class="{ 'is-disabled': !node.data.column }"
			:rules="{
				required: true,
				message: 'Operator is required',
				trigger: ['blur', 'change'],
			}">
			<el-select
				:disabled="!node.data.column"
				v-model="node.data.operator"
				filterable>
				<el-option
					v-for="operator in operators"
					:key="operator.value"
					:label="operator.label"
					:value="operator.value" />
			</el-select>
		</el-form-item>

		<el-form-item
			v-if="requireValue"
			class="sdk-filter-item-col"
			:label="advance ? 'Value' : column?.name ?? node.data.column"
			:prop="[...prop, 'value']"
			:class="{ 'is-disabled': !node.data.operator }"
			:rules="advance ? valueRule : {}">
			<template v-if="column">
				<component
					v-model="node.data.value"
					:operator="node.data.operator"
					:is="inputValueComponent"
					:column="column"
					:disable="!node.data.operator"
					:config="inputConfig" />
			</template>
		</el-form-item>

		<div v-if="advance" class="sdk-filter-item-col sdk-delete-filter">
			<el-button
				:icon="Delete"
				type="danger"
				circle
				link
				@click="deleteNode()" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.sdk-filter-item {
	width: 100%;
	display: grid;
	gap: 10px;
	box-sizing: border-box;
	grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));

	&:not(.--advance) .sdk-filter-item-col {
		margin-bottom: 0;
	}

	&-col {
		flex: 1;
		width: 100%;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;

		&.sdk-delete-filter {
			grid-column: -1;
			width: 30px;
			text-align: right;

			.el-button {
				position: relative;
				top: 50%;
				transform: translateY(-50%);
				height: 20px;
			}
		}

		&.is-error:not(.is-disabled) :deep(.el-form-item__label) {
			color: var(--el-color-error);
		}

		:deep(.el-form-item__label) {
			font-size: 0.7rem;
			height: 0.7rem;
			line-height: 1;
		}

		:deep(.el-form-item__content) {
			width: 100%;

			& > * {
				width: 100%;
			}
		}
	}
}
</style>
