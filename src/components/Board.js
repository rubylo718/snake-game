import { useState } from 'react'

const Board = () => {
	const [board, setBoard] = useState(
		Array(10)
			.fill(0)
			.map((_) => Array(10).fill(0))
	)

	return (
		<div className="board">
			{board.map((row, rowIdx) => (
				<div key={rowIdx} className="row">
					{row.map((cell, cellIdx) => (
						<div key={cellIdx} className="cell"></div>
					))}
				</div>
			))}
		</div>
	)
}

export default Board
