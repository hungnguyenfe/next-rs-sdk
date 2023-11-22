import { nextTick, onMounted, Ref, ref, watch } from 'vue'
import { ElSelect } from 'element-plus'

export const useCollapseSelect = (value: Ref<any[]>, useLabel = false) => {
	const selectRef = ref<InstanceType<typeof ElSelect>>()
	const collapsed = ref(false)
	const max = ref(0)
	const TAG_WIDTH = 36

	function handleCheck() {
		void nextTick(() => {
			if (!selectRef.value?.multiple) return
			const totalWidth =
				selectRef.value?.$el.querySelector('.select-trigger')
					.clientWidth
			const maxAllowWidth = Math.min((totalWidth * 3) / 4, 100)
			max.value = 0
			value.value.reduce((total, v, index) => {
				const el = document.createElement('span')
				el.innerHTML = useLabel
					? selectRef.value?.selected[index].currentLabel
					: v
				el.style.visibility = 'hidden'
				el.style.fontSize = 'var(--el-tag-font-size, 12px)'
				document.body.appendChild(el)
				const { width } = el.getBoundingClientRect()
				const tagWidth = width + TAG_WIDTH + 5
				// 5 for padding right each tag
				if (
					total + width + TAG_WIDTH + 5 >=
					totalWidth - maxAllowWidth
				) {
					!max.value && (max.value = index)
					collapsed.value = true
				} else {
					collapsed.value = false
				}
				document.body.removeChild(el)
				return total + tagWidth
			}, 0)
		})
	}

	onMounted(() => handleCheck())
	watch(value, () => handleCheck())

	return {
		selectRef,
		collapsed,
		max,
	}
}
