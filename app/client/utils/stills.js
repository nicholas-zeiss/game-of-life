/**
 *
 *	Some well known stills
 *
**/

export default {
	Beehive: {
		cells: [
							[0, 1], [0, 2],
			[1, 0],									[1, 3],
							[2, 1], [2, 2]
		],
		width: 4,
		height: 3
	},
	
	Block: {
		cells: [
			[0, 0], [0, 1],
			[1, 0], [1, 1]
		],
		width: 2,
		height: 2
	},
	
	Boat: {
		cells: [
			[0, 0], [0, 1],
			[1, 0],					[1, 2],
							[2, 1]
		],
		width: 3,
		height: 3
	},
	
	Loaf: {
		cells: [
			        [0, 1], [0, 2],
			[1, 0],                 [1, 3],
			        [2, 1],         [2, 3],
			                [3, 2]
		],
		width: 4,
		height: 4
	},
	
	Tub: {
		cells: [
			        [0, 1],
			[1, 0],         [1, 2],
			        [2, 1]
		],
		width: 3,
		height: 3
	}
};

