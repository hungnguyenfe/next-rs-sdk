import { SdkElementColumnConfig } from '@/shared/types/sdk.ts'

export enum SdkFeatureDropdownListEnum {
	ColumnManager = 'column_manager',
	FilterBuilderAdvance = 'filter_builder_advance',
	FilterBuilder = 'filter_builder',
}

export interface SdkFeatureDropdownListConfig {
	columnManagers: {
		columns: SdkElementColumnConfig[]
	}
}
