/**
 *
 *	This component renders our game of life to the DOM using a canvas element and allows users to toggle cells by clicking a cell or dragging
 *	the mouse across multiple cells. If a cell is touched more than once during a drag it is only toggled one time.
 *
**/


import React from 'react';

import { addGlow, drawCell } from '../utils/cells';
import colors from '../utils/colors';


class View extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mouseCell: null,			// Cell mouse is over, ie [ int r, int c ]
			selectedCells: new Set()		// Holds cells selected in a mouse drag
		};
	}

	componentWillReceiveProps() {
		this.setState({ selectedCells: new Set() });
	}

	// Draw the board
	componentDidUpdate() {
		const cellSize = this.props.cellSize;
		const glow = this.props.glow;

		this.drawBackground();
		this.loopOverCells((alive, r, c) => drawCell(this.ctx, alive, r, c, cellSize));
		this.loopOverCells((alive, r, c) => alive ? addGlow(this.ctx, glow, r, c, cellSize) : null);

		if (this.props.preset && this.state.mouseCell) {
			this.drawPresetCells();
		}
	}



	//-------------------------------------------------------------
	//									Utils for drawing board
	//-------------------------------------------------------------

	validCell(row, col) {
		return this.props.cells[row] && this.props.cells[row][col] != undefined;
	}

	drawBackground() {
		const boardWidth = this.props.cellSize * this.props.columns;
		const boardHeight = this.props.cellSize * this.props.rows;

		this.ctx.fillStyle = colors.cellBorder;
		this.ctx.fillRect(0, 0, boardWidth, boardHeight);
	}

	loopOverCells(cb) {
		this.props.cells.forEach((row, r) => {
			row.forEach((cell, c) => cb(cell, r, c));
		});
	}

	// Draw a preset structure under the mouse position
	drawPresetCells = () => {
		this.props.preset.forEach(([row, col]) => {
			row += this.state.mouseCell[0];
			col += this.state.mouseCell[1];

			// No need to draw if cell is already alive (ie already drawn)
			if (this.validCell(row, col) && !this.props.cells[row][col]) {
				drawCell(this.ctx, colors.liveCell, row, col, this.props.cellSize);
			}
		});
	}



	//-------------------------------------------------------------
	//							Utils for toggling cells in view
	//-------------------------------------------------------------

	placePreset(row, col) {
		const toToggle = [];

		this.props.preset.forEach(([r, c]) => {
			r += row;
			c += col;

			if (this.validCell(r, c) && !this.props.cells[r][c]) {
				toToggle.push(r + ':' + c);
			}
		});

		this.setState({ mouseCell: null }, this.props.toggleCells.bind(null, toToggle, true));
	}

	// Toggles a cell between alive/dead in the view but not the model
	toggleCell(r, c) {
		drawCell(this.ctx, !this.props.cells[r][c], r, c, this.props.cellSize);

		if (!this.props.cells[r][c]) {
			addGlow(this.ctx, this.props.glow, r, c, this.props.cellSize);
		}
	}



	//-------------------------------------------------------------
	//										Mouse event handlers
	//-------------------------------------------------------------

	// update model by placing preset structure or toggling selected cell(s)
	handleClick = (e) => {
		if (this.props.animating) return;

		const row = Math.floor(e.nativeEvent.offsetY / this.props.cellSize);
		const col = Math.floor(e.nativeEvent.offsetX / this.props.cellSize);

		if (!this.validCell(row, col)) return;

		if (this.props.preset) {
			this.placePreset(row, col);
		} else if (this.state.selectedCells.size) {
			this.props.toggleCells(this.state.selectedCells);
		} else {
			this.props.toggleCells([ row + ':' + col ]);
		}
	}

	handleMouseLeave = () => {
		if (this.props.animating) return;

		this.setState({ mouseCell: null }, () => {
			if (this.state.selectedCells.size) {
				this.props.toggleCells(this.state.selectedCells, false);			// Update model
			}
		});
	}

	// If a drag add cell to selected cells, if not update mouse pos in state (will draw
	// preset on update if one exists)
	handleMouseMove = (e) => {
		if (this.props.animating) return;

		const row = Math.floor(e.nativeEvent.offsetY / this.props.cellSize);
		const col = Math.floor(e.nativeEvent.offsetX / this.props.cellSize);

		if (!this.validCell(row, col)) return;

		let button = 0;

		if (e.buttons != undefined) {
			button = e.buttons;
		} else if (e.nativeEvent.which != undefined) {
			button = e.nativeEvent.which;
		}

		if (button == 1 && !this.props.preset) {
			if (!this.state.selectedCells.has(row + ':' + col)) {
				this.toggleCell(row, col);
				this.state.selectedCells.add(row + ':' + col);
			}
		} else {
			this.setState({ mouseCell: [ row, col ] });
		}
	}


	render() {
		return (
			<canvas
				ref={ canvas => canvas ? this.ctx = canvas.getContext('2d') : null }
				height={ this.props.cellSize * this.props.rows }
				id='life-canvas'
				onClick={ this.handleClick }
				onDrag={ e => console.log(e.buttons, e.nativeEvent.offsetX, e.nativeEvent.offsetY) }
				onMouseLeave={ this.handleMouseLeave }
				onMouseMove={ this.handleMouseMove }
				width={ this.props.cellSize * this.props.columns }
			/>
		);
	}
}


export default View;

