import { useState, useEffect, useCallback } from 'react'
import { BOARD_SIZE, DIRECTIONS } from '../constants'

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
		cell: startingCell, // 34
	}
}

const Board = () => {
	const [board, setBoard] = useState(createBoard(BOARD_SIZE)) // 2D array
	const [snake, setSnake] = useState(
		new LinkedList(getStartingSnakeLLValues(board))
	) // LinkedList
	const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value.cell])) // Set
	const [direction, setDirection] = useState(DIRECTIONS.ArrowRight) // string

	const handleMoveSnake = () => {
		const currentHeadCoords = {
			row: snake.head.value.row,
			col: snake.head.value.col,
		}

		const newHeadCoords = getCoordsInDirection(currentHeadCoords, direction) // { row: 3, col: 4 }
		if (isOutOfBounds(newHeadCoords, board)) {
			alert('Game Over!')
			resetGame()
			return
		}

		const newHeadCell = board[newHeadCoords?.row][newHeadCoords?.col] // 35
		if (snakeCells.has(newHeadCell)) {
			alert('Game Over!')
			resetGame()
			return
		}

		const newHead = new LinkedListNode({
			row: newHeadCoords?.row,
			col: newHeadCoords?.col,
			cell: newHeadCell,
		})

		// update the snake head node
		snake.head = newHead

		// update the snakeCells set
		const newSnakeCells = new Set(snakeCells)
		newSnakeCells.delete(snake.tail.value.cell)
		newSnakeCells.add(newHeadCell)

		// update the snake tail node
		snake.tail = snake.tail.next
		if (snake.tail === null) snake.tail = snake.head

		setSnakeCells(newSnakeCells)
	}

	const handleKeyDown = (e) => {
		const newDirection = DIRECTIONS[e.key] || null
		if (!newDirection) return
		setDirection(newDirection)
	}

	const resetGame = () => {
		const startingSnakeLLValues = getStartingSnakeLLValues(board)
		setSnake(new LinkedList(startingSnakeLLValues))
		setSnakeCells(new Set([startingSnakeLLValues.cell]))
		setDirection(DIRECTIONS.ArrowRight)
	}

	useEffect(() => {
		document.addEventListener('keydown', (e) => {
			handleKeyDown(e)
		})
		return () => {
			document.removeEventListener('keydown', (e) => {
				handleKeyDown(e)
			})
		}
	}, [])

	return (
		<div className="board">
			<button onClick={handleMoveSnake}>Move Snake</button>
			{board.map((row, rowIdx) => (
				<div key={rowIdx} className="row">
					{row.map((cellValue, cellIdx) => (
						<div
							key={cellIdx}
							className={`cell ${
								snakeCells.has(cellValue) ? 'snake-cell' : ''
							}`}
						>
							{cellValue}
						</div>
					))}
				</div>
			))}
		</div>
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

export default Board
