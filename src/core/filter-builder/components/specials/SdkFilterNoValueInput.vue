<script setup lang="ts">
import { computed } from 'vue'
import {
	BaseInputEmits,
	BaseInputProps,
} from '@/core/filter-builder/components/base.ts'

const props = defineProps<BaseInputProps>()
const emits = defineEmits<BaseInputEmits>()

computed({
	get: () => props.modelValue,
	set: (_value) => emits('update:modelValue', _value),
})
</script>

<template>
	<span></span>
</template>

<style scoped></style>
