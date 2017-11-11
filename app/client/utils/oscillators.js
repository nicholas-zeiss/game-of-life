/**
 *
 *	Some well known oscillators
 *
**/

export default {
	Beacon: {
		cells: [
			[0, 0], [0, 1],
			[1, 0],
															[2, 3],
											[3, 2], [3, 3]
		],
		width: 4,
		height: 4
	},

	Blinker: {
		cells: [
			[0, 0],
			[1, 0],
			[2, 0]
		],
		width: 2,
		height: 3
	},

	Pentadecathlon: {
		cells: [
							[0, 1],
							[1, 1],
			[2, 0], 				[2, 2],
							[3, 1],
							[4, 1],
							[5, 1],
							[6, 1],
			[7, 0],					[7, 2],
							[8, 1],
							[9, 1]
		],
		width: 3,
		height: 10
	},

	Pulsar: {
		cells: [
											[0, 2],  [0, 3],  [0, 4],  												  [0, 8],  [0, 9],  [0, 10], 

			[2, 0], 																	[2, 5], 					[2, 7], 																		[2, 12], 
			[3, 0], 																	[3, 5], 					[3, 7], 																		[3, 12], 
			[4, 0], 																	[4, 5], 					[4, 7], 																		[4, 12], 
											[5, 2],  [5, 3],  [5, 4], 													[5, 8],  [5, 9],  [5, 10], 

											[7, 2],  [7, 3],  [7, 4], 													[7, 8],  [7, 9],  [7, 10], 
			[8, 0], 																  [8, 5], 					[8, 7], 																		[8, 12],
			[9, 0],																	  [9, 5],					  [9, 7],																		  [9, 12],
			[10, 0],																  [10, 5], 				  [10, 7],																		[10, 12],

											[12, 2], [12, 3], [12, 4],													[12, 8], [12, 9], [12, 10]
		],
		width: 13,
		height: 13
	},

	Toad: {
		cells: [
							[0, 1], [0, 2], [0, 3],
			[1, 0], [1, 1], [1, 2]
		],
		width: 4,
		height: 2
	}
};
