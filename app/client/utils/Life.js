/**
 *
 * 	This class implements Conway's Game of Life. It holds the state of all the cells in a 2d array and updates them
 * 	when called to do so. It wraps around its borders, ie a cell on the left edge can count cells on the right edge
 * 	as neighbors.
 *
**/


const emptyBoard = (width, height) => (
	new Array(height)
		.fill(1)
		.map(() => (
			new Array(width)
				.fill(0)
		))
);


class Life {
	constructor(width, height) {
		this.board = emptyBoard(width, height);
		this.generation = 0;
		this.height = height;
		this.width = width;
	}


	flipCellState(row, col) {
		this.board[row][col] = this.board[row][col] ? 0 : 1;
	}


	// updates board and returns if any live cells remain so that we know
	// to stop running simulation
	updateBoard() {
		const newBoard = emptyBoard(this.width, this.height);
		let anyAlive = false;

		for (let r = 0; r < this.height; r++) {
			for (let c = 0; c < this.width; c++) {
				const count = this.countLiveNeighbors(r, c);

				if (count < 2) {
					newBoard[r][c] = 0;
				} else if (count == 2) {
					newBoard[r][c] = this.board[r][c];
					anyAlive = !!newBoard[r][c] || anyAlive;
				} else if (count == 3) {
					newBoard[r][c] = 1;
					anyAlive = true;
				} else {
					newBoard[r][c] = 0;
				}
			}
		}

		this.generation++;
		this.board = newBoard;

		return anyAlive;
	}


	countLiveNeighbors(row, col) {
		let count = 0;

		for (let r = -1; r < 2; r++) {
			for (let c = - 1; c < 2; c++) {
				if (r == 0 && c == 0) continue;

				const nRow = wrap(row + r, this.height);
				const nCol = wrap(col + c, this.width);

				this.board[nRow][nCol] ? count++ : null;
			}
		}

		return count;

		function wrap(index, length) {
			if (index == -1) {
				return length - 1;
			} else if (index == length) {
				return 0;
			}
			return index;
		}
	}


	clear() {
		this.board = emptyBoard(this.width, this.height);
		this.generation = 0;
	}


	toString() {
		return this.board
			.map(row => row.join(' '))
			.join('\n');
	}
}


export default Life;

