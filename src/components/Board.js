import { useState } from 'react'
import { BOARD_SIZE } from '../constants'

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

const Board = () => {
	const [board, setBoard] = useState(initialBoard(BOARD_SIZE))
	const [snake, setSnake] = useState(new LinkedList(44))
	const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value]))
	// console.log('snake', snake)
	// console.log('snakeCells', snakeCells)

	return (
		<div className="board">
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

const initialBoard = (BOARD_SIZE) => {
	let counter = 1
	const board = []
	for (let i = 0; i < BOARD_SIZE; i++) {
		const row = []
		for (let j = 0; j < BOARD_SIZE; j++) {
			row.push(counter++)
		}
		board.push(row)
	}
	return board
}

export default Board
