<script setup lang="ts">
import {
	ContainerOptions,
	DragEndParams,
	DragStartParams,
	DropResult,
	SmoothDnD,
	smoothDnD,
	dropHandlers,
	constants,
} from 'smooth-dnd'
import { onDeactivated, onMounted, ref } from 'vue'

smoothDnD.dropHandler = dropHandlers.reactDropHandler().handler
smoothDnD.wrapChild = false

/**
 * Follow https://github.com/kutlugsahin/smooth-dnd/tree/master
 * **/
interface SdkDraggableContainerProps
	extends Partial<
		Pick<
			ContainerOptions,
			| 'groupName'
			| 'orientation'
			| 'behaviour'
			| 'dragClass'
			| 'dragHandleSelector'
			| 'dropClass'
			| 'dropPlaceholder'
			| 'animationDuration'
			| 'autoScrollEnabled'
		>
	> {
	getItem?: (index: number) => any
}

const props = withDefaults(defineProps<SdkDraggableContainerProps>(), {
	orientation: 'vertical',
	animationDuration: 250,
	autoScrollEnabled: true,
	getItem: (index: number) => index,
})
const emits = defineEmits<{
	(c: 'drag-start', params: DragStartParams): void
	(c: 'drag-end', params: DragEndParams): void
	(c: 'drop', params: DropResult): void
}>()

const classes = {
	dragging: 'dragging',
}
const element = ref<HTMLElement>()
const dragInstance = ref<SmoothDnD>()

function createDragInstance() {
	if (!element.value) return
	const options: ContainerOptions = {
		...props,
		dragBeginDelay: 0,
		getChildPayload(index) {
			return props.getItem?.(index) ?? index
		},
		onDragStart(params) {
			params.isSource && element.value?.classList.add(classes.dragging)
			emits('drag-start', params)
		},
		onDragEnd(params) {
			params.isSource && element.value?.classList.remove(classes.dragging)
			emits('drag-end', params)
		},
		onDrop(params) {
			emits('drop', params)
		},
	}
	dragInstance.value = smoothDnD(element.value, options)
}

function removeDragInstance() {
	try {
		dragInstance.value?.dispose()
		dragInstance.value = undefined
	} catch {
		// ignore
	}
}

onMounted(() => createDragInstance())

onDeactivated(() => removeDragInstance())
</script>

<template>
	<div ref="element" class="sdk-dragging-container">
		<slot :wrapper-class="constants.wrapperClass"></slot>
	</div>
</template>

<style scoped></style>
