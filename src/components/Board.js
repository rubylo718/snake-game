import { useState, useEffect } from 'react'
import { DIRECTIONS } from '../utils/constants'
import {
	randomIntGenerator,
	isOutOfBounds,
	getNextCoordsInDirection,
	getGrowthNodeCoords,
	getOppositeDirection,
} from '../utils/helpers'
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

// Game Variables settings
const BOARD_SIZE = 12
const INTERVAL_DELAY = 350

// Create the board
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

// Get the starting snake linked list values
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

		const newHeadCoords = getNextCoordsInDirection(currentHeadCoords, direction)
		if (isOutOfBounds(newHeadCoords, board)) {
			alert(
				`You hit the wall. Game Over. Your score is ${score}. Click OK to play again.`
			)
			resetGame()
			return
		}

		const newHeadCell = board[newHeadCoords?.row][newHeadCoords?.col]
		if (snakeCells.has(newHeadCell)) {
			alert(
				`You hit yourself. Game Over. Your score is ${score}. Click OK to play again.`
			)
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

		// update the snakeCells set: add new head cell and remove tail cell
		const newSnakeCells = new Set(snakeCells)
		newSnakeCells.delete(snake.tail.value.cell)
		newSnakeCells.add(newHeadCell)

		// update the snake tail node: remove the tail cell from the set
		snake.tail = snake.tail.next
		if (snake.tail === null) snake.tail = snake.head

		// check if the snake has eaten the food while moving
		const isFoodEaten = newHeadCell === foodCell
		if (isFoodEaten) {
			handleGrowSnake(newSnakeCells)
			generateFood(newSnakeCells)
			setScore((prevScore) => prevScore + 1)
		}

		setSnakeCells(newSnakeCells)
	}

	const generateFood = (snakeCells) => {
		// handle the extreme case: when the snake has filled the entire board
		const emptyCells = board.flat().filter((cell) => !snakeCells.has(cell))
		if (emptyCells.length === 0) {
			alert(
				`You won! No empty cells left on the board. Your score is ${score}. Click OK to play again.`
			)
			resetGame()
			return
		}
		
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
		return
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

export default Board
