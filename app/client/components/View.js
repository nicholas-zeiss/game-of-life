/**
 *
 *	This component renders our game of life to the DOM using a canvas element and allows users to toggle cells by clicking a cell or dragging
 *	the mouse across multiple cells. If a cell is touched more than once during a drag it is only toggled one time.
 *
**/


import PropTypes from 'prop-types';
import React from 'react';

import { addGlow, drawCell } from '../utils/cells';
import colors from '../utils/colors';


class View extends React.Component {
	static propTypes = {
		animating: PropTypes.bool.isRequired,
		cellSize: PropTypes.number.isRequired,
		cells: PropTypes.array.isRequired,
		glow: PropTypes.any,
		preset: PropTypes.array,
		toggleCells: PropTypes.func.isRequired
	};


	constructor(props) {
		super(props);

		this.boardHeight = props.cells.length;
		this.boardWidth = props.cells[0].length;
		this.canvasRef = React.createRef();

		this.state = {
			mouseCell: null,			// Cell mouse is over, ie [ int r, int c ]
			selectedCells: new Set()		// Holds cells selected in a mouse drag
		};
	}

	UNSAFE_componentWillReceiveProps() {
		this.setState({ selectedCells: new Set() });
	}


	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.cells !== this.props.cells) {
			return true;
		} else if (nextProps.cellSize !== this.props.cellSize) {
			return true;
		} else if (nextProps.preset && nextState.mouseCell !== this.state.mouseCell) {
			return true;
		}

		return false;
	}


	// Draw the board
	componentDidUpdate() {
		this.ctx = this.canvasRef.current.getContext('2d');
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
		return this.props.cells[row] && this.props.cells[row][col] !== undefined;
	}

	drawBackground() {
		const boardWidth = this.props.cellSize * this.boardWidth;
		const boardHeight = this.props.cellSize * this.boardHeight;

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

		if (e.buttons !== undefined) {
			button = e.buttons;
		} else if (e.nativeEvent.which !== undefined) {
			button = e.nativeEvent.which;
		}

		if (button === 1 && !this.props.preset) {
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
				ref={ this.canvasRef }
				height={ this.props.cellSize * this.boardHeight }
				id='life-canvas'
				onClick={ this.handleClick }
				onMouseLeave={ this.handleMouseLeave }
				onMouseMove={ this.handleMouseMove }
				width={ this.props.cellSize * this.boardWidth }
			/>
		);
	}
}


export default View;

