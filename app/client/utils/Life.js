/**
 *
 * 	This class implements Conway's Game of Life. It holds the state of all the cells in a 2d array and updates them
 * 	when called to do so. It wraps around its borders, ie a cell on the left edge can count cells on the right edge
 * 	as neighbors. Accessing an instances state is done via rxjs BehaviorSubjects following the observable pattern.
 *
**/


import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


const emptyBoard = (width, height) => (
	new Array(height).fill(1).map(() => new Array(width).fill(false))
);

const equalBoards = (a, b) => (
	a.every((rA, i) => rA.every((cA, j) => cA === b[i][j]))
);

const percentSpeedToDelay = percent => 20 + (1 - percent) * 300;

// a cells neighbors wrap arounds the edge of the board, so this is used to
// adjust the index accordingly
const wrapIndex = (index, length) => {
	if (index < 0) {
		return length - 1;
	} else if (index === length) {
		return 0;
	}
	return index;
};


class Life {
	_animationInterval = null;
	_animationSpeed = .5;																// ranges from 0 to 1
	_animatingSubject = new BehaviorSubject(false);
	_gen = 0;
	_genSubject = new BehaviorSubject(0);
	animationSpeedSubject = new BehaviorSubject(.5);

	constructor(width = 80, height = 40) {
		this._board = emptyBoard(width, height);
		this._boardSubject = new BehaviorSubject(this._board);
		this.height = height;
		this.width = width;

		this.animationSpeedSubject
			.pipe(distinctUntilChanged(), debounceTime(100))
			.subscribe(this.changeSpeed);
	}


	get animating() {
		return this._animatingSubject;
	}


	get board() {
		return this._boardSubject.pipe(
			distinctUntilChanged(equalBoards),
			map(board => board.map(row => [...row]))
		);
	}


	get generation() {
		return this._genSubject;
	}


	flipCellStates(cellSet) {
		const boardCopy = this._board.map(row => [...row]);

		cellSet.forEach((cell) => {
			const [ row, col ] = cell.split(':');
			boardCopy[row][col] = !this._board[row][col];
		});

		this._boardSubject.next(boardCopy);
		this._board = boardCopy;
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


	// updates board and returns whether there are any live cells remaining
	// so that we know if we need to stop running the simulation
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

		this._genSubject.next(++this._gen);

		if (change) {
			this._board = newBoard;
			this._boardSubject.next(newBoard);
		}

		return anyAlive;
	}


	changeSpeed = (percentSpeed) => {
		this._animationSpeed = percentSpeed;

		if (this._animationInterval !== null) {
			this.stopAnimation();
			this.startAnimation();
		}
	}


	startAnimation = () => {
		if (this._animationInterval !== null) {
			return;
		}

		const delay = percentSpeedToDelay(this._animationSpeed);

		this._animationInterval = setInterval(() => {
			const anyAlive = this.updateBoard();

			if (!anyAlive) {
				this.stopAnimation();
			}
		}, delay);

		this._animatingSubject.next(true);
	}


	stopAnimation = () => {
		if (this._animationInterval) {
			clearInterval(this._animationInterval);
			this._animationInterval = null;
			this._animatingSubject.next(false);
		}
	}


	clear = () => {
		this.stopAnimation();
		this._board = emptyBoard(this.width, this.height);
		this._boardSubject.next(this._board);
		this._genSubject.next(this._gen = 0);
	}
}


export default Life;

