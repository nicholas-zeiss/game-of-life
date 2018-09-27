

const expect = require('chai').expect;

const CellSet = require('../client/utils/cellSet').default;


describe('The CellSet class', () => {
	let cellSet;


	it('should be able to take no arguments in the constructor and add method, as well as ignore empty ones', () => {
		cellSet = new CellSet();

		expect(cellSet.size).to.equal(0);

		cellSet.add();
		cellSet.add([], new Set());

		expect(cellSet.size).to.equal(0);
	});


	it('should take any number of valid inputs in the constructor and add method', () => {
		cellSet = new CellSet(
			[0, 0],
			[0, 1],
			'1:1',
			new Set([[3, 4], [5, 6], '7:8']),
			['9:10', [11, 12]]
		);

		expect(cellSet.size).to.equal(8);

		cellSet.add([9, 8], '11:99');

		expect(cellSet.size).to.equal(10);
	});


	it('should ignore invalid inputs', () => {
		cellSet = new CellSet(
			[0, 0],
			'foobar'
		);

		expect(cellSet.size).to.equal(1);

		cellSet.add(
			[0, 1],
			new Date(),
			[-5, 4]
		);

		expect(cellSet.size).to.equal(2);
	});


	it('should ignore duplicate values', () => {
		cellSet = new CellSet(new Set([
			[0, 0],
			[1, 1],
			[1, 1]
		]));

		expect(cellSet.size).to.equal(2);

		cellSet.add([3, 3], '3:3');

		expect(cellSet.size).to.equal(3);
	});


	it('should not hold a deep reference to input values', () => {
		const cellFoo = [1, 2];

		cellSet = new CellSet(cellFoo);

		expect(cellSet.size).to.equal(1);

		cellFoo[0] = 3;
		cellSet.add(cellFoo);

		expect(cellSet.size).to.equal(2);
	});


	it('should be able to create a copy of itself', () => {
		cellSet = new CellSet([0, 0]);

		const copySet = cellSet.copy();
		copySet.add('1:1');

		expect(cellSet.size).to.not.equal(copySet.size);
	});


	it('should handle callbacks supplied to forEach()', () => {
		const cells = new Set(['1:1', '2:2', '3:3']);
		cellSet = new CellSet('4:4', cells);

		cellSet.forEach(([r, c]) => {
			cells.delete(`${r}:${c}`);
		});

		expect(cells.size).to.equal(0);
	});


	it('should be iterable', () => {
		let count = 0;

		cellSet = new CellSet('1:1', '2:2', '3:3');

		for (let _ of cellSet) count++;

		expect(count).to.equal(3);
	});
});

