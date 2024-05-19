import { DIRECTIONS } from './constants'

export const randomIntGenerator = (min, max) => {
	// Returns a random integer between min (inclusive) and max (inclusive)
	return Math.floor(Math.random() * (max - min + 1) + min)
}

// check if the coordinates are out of bounds
export const isOutOfBounds = (coords, board) => {
	const { row, col } = coords
	if (row < 0 || col < 0) return true
	if (row >= board.length || col >= board[0].length) return true
	return false
}

// get the next coordinates in the direction
export const getNextCoordsInDirection = (coords, direction) => {
	switch (direction) {
		case 'up':
			return { row: coords.row - 1, col: coords.col }
		case 'down':
			return { row: coords.row + 1, col: coords.col }
		case 'left':
			return { row: coords.row, col: coords.col - 1 }
		case 'right':
			return { row: coords.row, col: coords.col + 1 }
		default:
			return coords
	}
}

// get the direction of the next node
export const getNextNodeDirection = (node, currentDirection) => {
	if (node.next === null) return currentDirection
	const { row: currentRow, col: currentCol } = node.value
	const { row: nextRow, col: nextCol } = node.next.value
	if (currentRow === nextRow) {
		return currentCol < nextCol ? DIRECTIONS.ArrowRight : DIRECTIONS.ArrowLeft
	} else {
		return currentRow < nextRow ? DIRECTIONS.ArrowDown : DIRECTIONS.ArrowUp
	}
}

// get the growth node coordinates
export const getGrowthNodeCoords = (tail, currentDirection) => {
	const tailNextNodeDirection = getNextNodeDirection(tail, currentDirection)
	const growthDirection = getOppositeDirection(tailNextNodeDirection)
	return getNextCoordsInDirection(
		{
			row: tail.value.row,
			col: tail.value.col,
		},
		growthDirection
	)
}

// get the opposite direction
export const getOppositeDirection = (direction) => {
	switch (direction) {
		case DIRECTIONS.ArrowUp:
			return DIRECTIONS.ArrowDown
		case DIRECTIONS.ArrowDown:
			return DIRECTIONS.ArrowUp
		case DIRECTIONS.ArrowLeft:
			return DIRECTIONS.ArrowRight
		case DIRECTIONS.ArrowRight:
			return DIRECTIONS.ArrowLeft
		default:
			return direction
	}
}
