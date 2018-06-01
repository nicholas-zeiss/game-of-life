/**
 *
 * 	This class implements Conway's Game of Life. It holds the state of all the cells in a 2d array and updates them
 * 	when called to do so. It wraps around its borders, ie a cell on the left edge can count cells on the right edge
 * 	as neighbors.
 *
**/


import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';


const emptyBoard = (width, height) => (
	new Array(height).fill(1).map(() => new Array(width).fill(false))
);

const equalBoards = (a, b) => (
	a.every((rA, i) => rA.every((cA, j) => cA === b[i][j]))
);

const wrapIndex = (index, length) => {
	if (index < 0) {
		return length - 1;
	} else if (index === length) {
		return 0;
	}
	return index;
};


class Life {
	constructor(width, height) {
		this._board = emptyBoard(width, height);
		this.boardSubject = new BehaviorSubject(this._board);
		this.generation = 0;
		this.height = height;
		this.width = width;

		// thisK.boardSubject.next(this._board);
	}


	subscribeBoard = () => (
		this.boardSubject
			.pipe(
				distinctUntilChanged(equalBoards),
				map(board => board.map(row => [...row]))
			)
	)


	flipCellStates(cellSet) {
		const boardCopy = this._board.map(row => [...row]);

		cellSet.forEach((cell) => {
			const [row, col] = cell.split(':');
			boardCopy[row][col] = !this._board[row][col];
		});

		this.boardSubject.next(boardCopy);
		this._board = boardCopy;
	}


	// Updates board and returns if any live cells remain so that we know
	// to stop running simulation
	updateBoard() {
		const newBoard = emptyBoard(this.width, this.height);

		let change = false;
		let anyAlive = false;

		for (let r = 0; r < this.height; r++) {
			for (let c = 0; c < this.width; c++) {
				const count = this.countLiveNeighbors(r, c);

				if (count === 2) {
					newBoard[r][c] = this._board[r][c];
				} else if (count === 3) {
					newBoard[r][c] = true;
				} else {
					newBoard[r][c] = false;
				}

				anyAlive = anyAlive || newBoard[r][c];
				change = change || newBoard[r][c] !== this._board[r][c];
			}
		}

		this.generation++;

		if (change) {
			this._board = newBoard;
			this.boardSubject.next(newBoard);
		}

		return anyAlive;
	}


	countLiveNeighbors(row, col) {
		let count = 0;

		for (let r = -1; r < 2; r++) {
			for (let c = -1; c < 2; c++) {
				if (r === 0 && c === 0) continue;

				const nRow = wrapIndex(row + r, this.height);
				const nCol = wrapIndex(col + c, this.width);

				this._board[nRow][nCol] ? count++ : null;
			}
		}

		return count;
	}


	clear() {
		this._board = emptyBoard(this.width, this.height);
		this.boardSubject.next(this._board);
		this.generation = 0;
	}
}


export default Life;

