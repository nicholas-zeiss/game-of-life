/**
 *
 *	This component renders our game of life to the DOM using a canvas element and allows users to toggle cells by clicking a cell or dragging
 *	the mouse across multiple cells. If a cell is touched more than once during a drag it is only toggled one time.
 *
**/


import PropTypes from 'prop-types';
import React from 'react';

import styles from '../styles/gameView.css';
import { addGlow, COLORS, drawCell } from '../utils/cells';


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
			mouseDown: false,
			selectedCells: new Set()		// Holds cells selected in a mouse drag
		};
	}


	UNSAFE_componentWillReceiveProps() {
		this.setState({ selectedCells: new Set() });
	}


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


	validCell(row, col) {
		return this.props.cells[row] && this.props.cells[row][col] !== undefined;
	}


	drawBackground() {
		const boardWidth = this.props.cellSize * this.boardWidth;
		const boardHeight = this.props.cellSize * this.boardHeight;

		this.ctx.fillStyle = COLORS.cellBorder;
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
			row += this.state.mouseCell.row;
			col += this.state.mouseCell.col;

			// No need to draw if cell is already alive (ie already drawn)
			if (this.validCell(row, col) && !this.props.cells[row][col]) {
				drawCell(this.ctx, COLORS.liveCell, row, col, this.props.cellSize);
			}
		});
	}


	placePreset(row, col) {
		const toToggle = [];

		this.props.preset.forEach(([r, c]) => {
			r += row;
			c += col;

			if (this.validCell(r, c) && !this.props.cells[r][c]) {
				toToggle.push(r + ':' + c);
			}
		});

		this.props.toggleCells(toToggle, true);
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


	mouseHandler = (event) => {
		if (this.props.animating) {
			return;
		}

		const row = Math.floor(event.nativeEvent.offsetY / this.props.cellSize);
		const col = Math.floor(event.nativeEvent.offsetX / this.props.cellSize);

		const valid = this.validCell(row, col);

		if (event.type === 'click' && valid) {
			this.handleClick(row, col);
		} else if (event.type === 'mousedown') {
			this.setState({ mouseDown: true });
		} else if (event.type === 'mouseup' || event.type === 'mouseleave') {
			this.handleUp(event.type);
		} else if (event.type === 'mousemove' && valid) {
			this.handleMove(row, col);
		}
	}


	handleClick = (row, col) => {
		if (this.props.preset) {
			this.placePreset(row, col);
		} else {
			this.props.toggleCells([ row + ':' + col ]);
		}
	}


	handleUp = (type) => {
		if (this.state.selectedCells.size) {
			this.props.toggleCells(this.state.selectedCells, false);
		}

		const update = { mouseDown: false };
		type === 'mouseleave' ? update.mouseCell = null : null;

		this.setState(update);
	}


	handleMove = (row, col) => {
		const locStr = row + ':' + col;

		if (this.props.preset) {
			this.setState({ mouseCell: { row, col } });
		} else if (this.state.mouseDown && !this.state.selectedCells.has(locStr)) {
			this.toggleCell(row, col);
			this.state.selectedCells.add(locStr);
		}
	}


	handleEnter = (event) => {
		const down = event.nativeEvent.buttons === 1;
		this.setState({ mouseDown: down });
	}


	render() {
		return (
			<canvas
				ref={ this.canvasRef }
				height={ this.props.cellSize * this.boardHeight }
				className={ styles.lifeCanvas }
				onClick={ this.mouseHandler }
				onMouseDown={ this.mouseHandler }
				onMouseEnter={ this.handleEnter }
				onMouseLeave={ this.mouseHandler }
				onMouseMove={ this.mouseHandler }
				onMouseUp={ this.mouseHandler }
				width={ this.props.cellSize * this.boardWidth }
			/>
		);
	}
}


export default View;

