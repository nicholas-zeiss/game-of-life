/**
 *
 *	A helper class for holding sets of cell locations. Cells are stored in strings of form `${rowIndex}:${colIndex}`
 *	to effeciently avoid duplication without relying on doing comparisons against all other stored cells.
 *
**/


const fromCellStr = cStr => cStr.split(':').map(Number);

const toCellStr = ([ row, col ]) => `${row}:${col}`;

const validCellStr = cStr => typeof cStr === 'string' && /^(0|[1-9]\d*):(0|[1-9]\d*)$/.test(cStr);

const validCellArray = arr => arr instanceof Array && validCellStr(arr.join(':'));

const validCell = cell => validCellStr(cell) || validCellArray(cell);



class CellSet {
	constructor(...args) {
		this.storedCells = new Set();
		this.add(...args);
	}


	get size() {
		return this.storedCells.size;
	}


	add(...args) {
		args.forEach((arg) => {
			const isValidCell = validCell(arg);

			if (!isValidCell && arg[Symbol.iterator]) {
				[...arg].forEach(item => validCell(item) && this.addCell(item));
			} else if (isValidCell) {
				this.addCell(arg);
			}
		});
	}


	addCell(cell) {
		this.storedCells.add(typeof cell !== 'string' ? toCellStr(cell) : cell);
	}


	copy() {
		return new CellSet(this.storedCells);
	}


	forEach(cb) {
		[...this.storedCells]
			.map(fromCellStr)
			.forEach(cb);
	}


	[Symbol.iterator]() {
		// directly referencing .values() on the array conflicted with transpiling to tests
		return [...this.storedCells]
			.map(fromCellStr)[Symbol.iterator]();
	}
}


export default CellSet;

