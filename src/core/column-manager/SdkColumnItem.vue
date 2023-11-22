<script setup lang="ts">
import {
	ElCard,
	ElCheckbox,
	ElIcon,
	ElInputNumber,
	ElCollapse,
	ElCollapseItem,
} from 'element-plus'
import { Grid } from '@element-plus/icons-vue'
import { SdkElementColumnConfig } from '@/shared/types/sdk.ts'
import { ref } from 'vue'

defineProps<{ column: SdkElementColumnConfig; allowDrag?: boolean }>()

const isCollapsed = ref('')
</script>

<template>
	<el-card class="sdk-column-item" :class="{ '--allow-drag': allowDrag }">
		<div class="sdk-column-item-wrapper">
			<!-- Drag Icon -->
			<el-icon v-if="allowDrag" class="sdk-column-item-drag-icon">
				<Grid />
			</el-icon>

			<el-collapse class="sdk-column-item-collapse" v-model="isCollapsed">
				<el-collapse-item
					:title="column.title || column.name"
					:name="column.name">
					<!-- Actions -->
					<div class="sdk-column-item-actions">
						<div class="sdk-column-item-action-row">
							<span>Enabled</span>
							<span>
								<el-checkbox v-model="column.visible" />
							</span>
						</div>
						<div class="sdk-column-item-action-row">
							<span>Sortable</span>
							<span>
								<el-checkbox v-model="column.sortable" />
							</span>
						</div>
						<div class="sdk-column-item-action-row">
							<span>Auto Width</span>
							<span>
								<el-input-number
									class="sdk-column-width-control"
									v-model="column.width"
									:disabled="column.autoWidth"
									:controls="false"
									:min="0" />
								<el-checkbox v-model="column.autoWidth" />
							</span>
						</div>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>
	</el-card>
</template>

<style lang="scss" scoped>
.sdk-column-item {
	transition: 100ms !important;

	:deep(.el-card__body) {
		position: relative;
		padding: 10px 10px 10px 40px;
	}

	&-drag-icon {
		position: absolute;
		top: 50%;
		left: 15px;
		transform: translateY(-50%);
		opacity: 0;
	}

	&.--allow-drag:hover .sdk-column-item-drag-icon {
		opacity: 1;
		cursor: move;
	}

	&-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	&-collapse {
		border: 0;

		:deep(.el-collapse-item__header) {
			font-weight: bold;
			border: 0;
		}

		:deep(.el-collapse-item__wrap) {
			border: 0;
		}

		:deep(.el-collapse-item__content) {
			padding-bottom: 0;
			padding-left: 20px;
		}
	}

	.sdk-column-item-actions {
		font-size: 0.8rem;
		display: flex;
		flex-direction: column;
	}

	.sdk-column-item-action-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.sdk-column-width-control {
		width: 80px;
		margin-right: 10px;
	}
}
</style>
