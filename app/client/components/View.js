/**
 *
 *	This component renders our game of life to the DOM using a canvas element and allows users to toggle cells by clicking a cell or dragging
 *	the mouse across multiple cells. If a cell is touched more than once during a drag it is only toggled one time. If the user has selected
 *	a preset, clicking a cell places the preset on it.
 *
 *	This component expects a plain 2d array representation of the cells and it modifies the cells via mouse handler callbacks provided in props.
 *	This is accomplished by using the HOC MouseInput. MouseInput is responsible for handling user input and maniputaling the game, the
 *	unaltered View component simply renders the game.
 *
 *	In order to avoid unnecessary and costly renderings of the transparent radial gradient used for the glowing effect, this is rendered once
 *	in a seperate canvas with a display value of none, and then copied into the main canvas as needed. It is only rerendered on resizing.
 *
**/


import PropTypes from 'prop-types';
import React from 'react';

import styles from '../styles/gameView.css';
import { addGlow, COLORS, drawBackground, drawCell, drawGlow } from '../utils/cells';
import MouseInput from './MouseInput';


class View extends React.Component {
	static propTypes = {
		cells: PropTypes.array,												// main game board
		life: PropTypes.object.isRequired,
		modifiedCells: PropTypes.object.isRequired,		// cells that have been flipped by user input but not toggled in game model
		mouseHandler: PropTypes.func.isRequired,
		presetCells: PropTypes.array									// if preset selected, holds cells that would be altered by clicking the cell the
	};																							// mouse is currently over


	constructor(props) {
		super(props);

		this.boardHeight = props.life.height;
		this.boardWidth = props.life.width;

		this.canvasRef = React.createRef();
		this.glowRef = React.createRef();

		this.state = { cellSize: 10 };			// in px units
	}


	componentDidMount() {
		const resizeCanvas = () => {
			this.setState({ cellSize: this.canvasRef.current.clientWidth / this.boardWidth });
		};

		window.onresize = resizeCanvas;
		resizeCanvas();
	}


	// the method ultimately responsible for drawing the game to the canvas
	componentDidUpdate(prevProps, prevState) {
		const canvasCtx = this.canvasRef.current.getContext('2d');
		const cellSize = this.state.cellSize;

		if (prevState.cellSize !== cellSize) {
			this.renderGlow();
		}

		const boardWidth = cellSize * this.boardWidth;
		const boardHeight = cellSize * this.boardHeight;

		drawBackground(canvasCtx, boardWidth, boardHeight);

		this.loopOverCells((alive, r, c) => {
			drawCell(canvasCtx, alive, r, c, cellSize);
		});

		this.loopOverCells((alive, r, c) => {
			alive && addGlow(canvasCtx, this.glowRef.current, r, c, cellSize);
		});

		this.drawOtherCells(canvasCtx);
	}


	loopOverCells(cb) {
		(this.props.cells || []).forEach((row, r) => {
			row.forEach((cell, c) => cb(cell, r, c));
		});
	}


	renderGlow() {
		const ctx = this.glowRef.current.getContext('2d');
		const radius = 4 * this.state.cellSize;
		drawGlow(ctx, radius, COLORS.gradientStart, COLORS.gradientStop);
	}


	// draws cells modified by user input but not yet altered in model and any
	// cells in a user selected preset that is being placed
	drawOtherCells(ctx) {
		const cellSize = this.state.cellSize;
		const glowCanvas = this.glowRef.current;

		this.props.modifiedCells.forEach((locStr) => {
			const [row, col] = locStr.split(':').map(Number);

			drawCell(ctx, !this.props.cells[row][col], row, col, cellSize);

			if (!this.props.cells[row][col]) {
				addGlow(ctx, glowCanvas, row, col, cellSize);
			}
		});

		(this.props.presetCells || []).forEach(([ row, col ]) => {
			drawCell(ctx, true, row, col, cellSize);
			addGlow(ctx, glowCanvas, row, col, cellSize);
		});
	}


	mouseHandler = (event) => {
		this.props.mouseHandler(event, this.state.cellSize);
	}


	render() {
		return (
			<React.Fragment>
				<canvas
					ref={ this.canvasRef }
					className={ styles.lifeCanvas }
					height={ this.state.cellSize * this.boardHeight }
					width={ this.state.cellSize * this.boardWidth }
					onClick={ this.mouseHandler }
					onMouseDown={ this.mouseHandler }
					onMouseEnter={ this.mouseHandler }
					onMouseLeave={ this.mouseHandler }
					onMouseMove={ this.mouseHandler }
					onMouseUp={ this.mouseHandler }
				/>
				<canvas
					ref={ this.glowRef }
					height={ 8 * this.state.cellSize }
					style={{
						display: 'none',
						height: 8 * this.state.cellSize + 'px',
						width: 8 * this.state.cellSize + 'px'
					}}
					width={ 8 * this.state.cellSize }
				/>
			</React.Fragment>
		);
	}
}


export default MouseInput(View);

