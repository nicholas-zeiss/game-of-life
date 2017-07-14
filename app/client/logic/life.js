/**
This class implements Conway's game of life
**/

class Life {
	//initializes a board of specified width and height with all 0s
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.board = new Array(height).fill(1).map(el => new Array(width).fill(0));
	}

	flipCellState(row, col) {
		this.board[row][col] = this.board[row][col] ? 0 : 1;
	}

	updateBoard() {
		let newBoard = new Array(this.height).fill(1).map(el => new Array(this.width).fill(0));

		for (let r = 0; r < this.height; r++) {
			for (let c = 0; c < this.width; c++) {

				let count = this.countLiveNeighbors(r, c);

				if (count < 2) newBoard[r][c] = 0;
				else if (count == 2) newBoard[r][c] = this.board[r][c];
				else if (count == 3) newBoard[r][c] = 1;
				else newBoard[r][c] = 0;
			}
		}

		this.board = newBoard;
	}

	countLiveNeighbors(row, col) {
		let count = 0;

		for (let r = -1; r < 2; r++) {
			for (let c = - 1; c < 2; c++) {
				if (r == 0 && c == 0) continue;
				
				let wrapRow = (row + r) == -1 ? this.height - 1 : 			//here we allow the board to wrap around the edges
											(row + r) == this.height ? 0 :
											row + r;
				
				let wrapCol = (col + c) == -1 ? this.width - 1 :
											(col + c) == this.width ? 0 :
											col + c;

				this.board[wrapRow][wrapCol] ? count++ : null;
			}
		}

		return count;
	}

	print() {
		this.board.forEach(row => console.log(row, '\n'));
	}

	clear() {
		this.board = new Array(this.height).fill(1).map(el => new Array(this.width).fill(0));
	}
}

export default Life;