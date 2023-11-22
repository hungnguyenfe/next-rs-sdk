import cloneDeep from 'lodash/cloneDeep'
import defaultsDeep from 'lodash/defaultsDeep'
import { SdkFilterGroupType } from '@/shared/types/sdk.ts'
import { nanoid } from 'nanoid'
import {
	SdkTreeNode,
	TreeRoot,
} from '@/core/filter-builder/SdkFilterWrapper.vue'

export const defaultTreeNode = (): TreeRoot => ({
	id: nanoid(),
	level: 0,
	isLeaf: false,
	isGroup: true,
	isRoot: true,
	parent: null,
	children: [],
	data: {
		type: 'AND',
		conditions: [],
	},
})

export function convertFilterToNode(
	data: SdkFilterGroupType | undefined,
): TreeRoot {
	const clone = cloneDeep(data)
	const root = defaultsDeep(defaultTreeNode(), { data: clone })
	let stack: Array<SdkTreeNode> = [root]
	const isGroup = (data: SdkTreeNode['data']): data is SdkFilterGroupType =>
		'conditions' in data
	while (stack.length) {
		const item = stack.pop()
		if (!item?.data) break
		if (isGroup(item.data)) {
			const children = item.data.conditions.map(
				(c) =>
					({
						id: nanoid(),
						isRoot: false,
						data: c,
						isGroup: isGroup(c),
						isLeaf: !isGroup(c),
						children: [],
						parent: item,
						level: item.level + 1,
					}) as SdkTreeNode,
			)
			item.children = children
			stack = [...stack, ...children]
		}
	}

	return root
}
