import { useState, useEffect } from 'react'
import { BOARD_SIZE, DIRECTIONS, INTERVAL_DELAY } from '../constants'
import { randomIntGenerator } from '../utils/helpers'
import { useInterval } from '../utils/hooks'

// The snake Structure
class LinkedListNode {
	constructor(value) {
		this.value = value
		this.next = null
	}
}

class LinkedList {
	constructor(value) {
		const node = new LinkedListNode(value)
		this.head = node
		this.tail = node
	}
}

const createBoard = (BOARD_SIZE) => {
	let counter = 1
	const board = []
	for (let i = 0; i < BOARD_SIZE; i++) {
		const row = []
		for (let j = 0; j < BOARD_SIZE; j++) {
			row.push(counter++)
		}
		board.push(row)
	}
	return board // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
}

const getStartingSnakeLLValues = (board) => {
	const startingCell = board[3][3]
	return {
		row: 3,
		col: 3,
		cell: startingCell,
	}
}

const Board = () => {
	const [board, setBoard] = useState(createBoard(BOARD_SIZE)) // 2D array
	const [snake, setSnake] = useState(
		new LinkedList(getStartingSnakeLLValues(board))
	) // LinkedList
	const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value.cell])) // Set
	const [direction, setDirection] = useState(DIRECTIONS.ArrowRight) // string
	const [foodCell, setFoodCell] = useState(snake.head.value.cell + 5)
	const [score, setScore] = useState(0)

	const handleMoveSnake = () => {
		const currentHeadCoords = {
			row: snake.head.value.row,
			col: snake.head.value.col,
		}

		const newHeadCoords = getCoordsInDirection(currentHeadCoords, direction)
		if (isOutOfBounds(newHeadCoords, board)) {
			alert(`Good Game! Your score is ${score}. Click OK to play again.`)
			resetGame()
			return
		}

		const newHeadCell = board[newHeadCoords?.row][newHeadCoords?.col]
		if (snakeCells.has(newHeadCell)) {
			alert(`Good Game! Your score is ${score}. Click OK to play again.`)
			resetGame()
			return
		}

		const newHead = new LinkedListNode({
			row: newHeadCoords?.row,
			col: newHeadCoords?.col,
			cell: newHeadCell,
		})

		// update the snake head node
		const currentHead = snake.head
		snake.head = newHead
		currentHead.next = newHead

		// update the snakeCells set
		const newSnakeCells = new Set(snakeCells)
		newSnakeCells.delete(snake.tail.value.cell)
		newSnakeCells.add(newHeadCell)

		// update the snake tail node
		snake.tail = snake.tail.next
		if (snake.tail === null) snake.tail = snake.head

		// check if the snake has eaten the food
		const isFoodEaten = newHeadCell === foodCell
		if (isFoodEaten) {
			handleGrowSnake(newSnakeCells)
			generateFood(newSnakeCells)
			setScore((prevScore) => prevScore + 1)
		}

		setSnakeCells(newSnakeCells)
	}

	const generateFood = (snakeCells) => {
		const food = randomIntGenerator(1, BOARD_SIZE ** 2)
		if (snakeCells.has(food)) {
			return generateFood(snakeCells)
		}
		setFoodCell(food)
	}

	const handleGrowSnake = (newSnakeCells) => {
		const growthNodeCoords = getGrowthNodeCoords(snake.tail, direction)
		if (isOutOfBounds(growthNodeCoords, board)) {
			return
		}
		const growthNodeCell = board[growthNodeCoords.row][growthNodeCoords.col]
		const newTail = new LinkedListNode({
			row: growthNodeCoords.row,
			col: growthNodeCoords.col,
			cell: growthNodeCell,
		})
		const currentTail = snake.tail
		snake.tail = newTail
		snake.tail.next = currentTail

		newSnakeCells.add(growthNodeCell)
	}

	const resetGame = () => {
		setScore(0)
		const startingSnakeLLValues = getStartingSnakeLLValues(board)
		setSnake(new LinkedList(startingSnakeLLValues))
		setSnakeCells(new Set([startingSnakeLLValues.cell]))
		setDirection(DIRECTIONS.ArrowRight)
		setFoodCell(startingSnakeLLValues.cell + 5)
	}

	useEffect(() => {
		const handleKeyDown = (e) => {
			const newDirection = DIRECTIONS[e.key] || null
			if (!newDirection) return
			if (newDirection === getOppositeDirection(direction)) return
			setDirection(newDirection)
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [direction])

	useInterval(() => {
		handleMoveSnake()
	}, INTERVAL_DELAY)

	return (
		<>
			<h2>Score: {score}</h2>
			<div className="board">
				{board.map((row, rowIdx) => (
					<div key={rowIdx} className="row">
						{row.map((cellValue, cellIdx) => (
							<div
								key={cellIdx}
								className={`cell 
							${snakeCells.has(cellValue) ? 'snake-cell' : ''} 
							${cellValue === foodCell ? 'food-cell' : ''}`}
							></div>
						))}
					</div>
				))}
			</div>
		</>
	)
}

const isOutOfBounds = (coords, board) => {
	const { row, col } = coords
	if (row < 0 || col < 0) return true
	if (row >= board.length || col >= board[0].length) return true
	return false
}

const getCoordsInDirection = (coords, direction) => {
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
const getNextNodeDirection = (node, currentDirection) => {
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
const getGrowthNodeCoords = (tail, currentDirection) => {
	const tailNextNodeDirection = getNextNodeDirection(tail, currentDirection)
	const growthDirection = getOppositeDirection(tailNextNodeDirection)
	const growthNodeCoords = getCoordsInDirection(
		{
			row: tail.value.row,
			col: tail.value.col,
		},
		growthDirection
	)
	return growthNodeCoords
}

// get the opposite direction
const getOppositeDirection = (direction) => {
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
export default Board
