<script setup lang="ts">
import { ElInput } from 'element-plus'
import { computed } from 'vue'
import {
	BaseInputEmits,
	BaseInputProps,
} from '@/core/filter-builder/components/base.ts'

const props = defineProps<BaseInputProps<string>>()
const emits = defineEmits<BaseInputEmits<string>>()

const value = computed({
	get: () => props.modelValue,
	set: (value) => emits('update:modelValue', value),
})
</script>

<template>
	<el-input :disabled="disable" v-model="value" placeholder="Enter text" />
</template>

<style scoped></style>
