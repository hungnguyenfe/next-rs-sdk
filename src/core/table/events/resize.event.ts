interface ResizeEvent {
	x: number
	y: number
	originWidth: number
	originX: number
	originY: number
}

export const onResizeEvent = (
	el: HTMLElement,
	columnEl: HTMLElement,
	listener: (e: ResizeEvent) => void,
) => {
	let x = 0
	let y = 0
	let originWidth = 0

	function mouseDown(event: MouseEvent) {
		event.preventDefault()
		x = event.clientX
		y = event.clientY
		originWidth = columnEl.getBoundingClientRect().width

		document.addEventListener('mousemove', mouseMove)
		document.addEventListener('mouseup', mouseUp)
	}

	function mouseUp(_event: MouseEvent) {
		document.removeEventListener('mousemove', mouseMove)
		document.removeEventListener('mouseup', mouseUp)
		document.querySelector('body')?.classList.remove('dragging')
	}

	function mouseMove(event: MouseEvent) {
		event.preventDefault()
		listener({
			x: event.clientX,
			y: event.clientY,
			originWidth,
			originX: x,
			originY: y,
		})
		document.querySelector('body')?.classList.add('dragging')
	}

	el.addEventListener('mousedown', mouseDown)

	return () => {
		el.removeEventListener('mousedown', mouseDown)
	}
}
