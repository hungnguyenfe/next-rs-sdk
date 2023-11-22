<script setup lang="ts">
import { ElInputNumber } from 'element-plus'
import { computed } from 'vue'
import {
	BaseInputEmits,
	BaseInputProps,
} from '@/core/filter-builder/components/base.ts'

const props = defineProps<BaseInputProps<number>>()
const emits = defineEmits<BaseInputEmits<number>>()

const value = computed({
	get: () => props.modelValue,
	set: (value) => emits('update:modelValue', value),
})
</script>

<template>
	<el-input-number
		:disabled="disable"
		v-model="value"
		placeholder="Enter a number" />
</template>

<style scoped></style>
