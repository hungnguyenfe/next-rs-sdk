import {
	SdkElementColumnConfig,
	SdkFilterSelectConfig,
	SdkOperator,
} from '@/shared/types/sdk.ts'

export interface BaseInputProps<T> {
	column: SdkElementColumnConfig
	modelValue: T
	disable?: boolean
	operator?: SdkOperator
	config?: SdkFilterSelectConfig
}

export interface BaseInputEmits<T> {
	(e: 'update:modelValue', d: T): void
}
