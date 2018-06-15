/**
 *
 *	This component renders our game of life to the DOM using a canvas element and allows users to toggle cells by clicking a cell or dragging
 *	the mouse across multiple cells. If a cell is touched more than once during a drag it is only toggled one time.
 *
**/


import PropTypes from 'prop-types';
import React from 'react';

import styles from '../styles/gameView.css';
import { addGlow, COLORS, drawBackground, drawCell, drawGlow } from '../utils/cells';
import MouseInput from './MouseInput';

class View extends React.Component {
	static propTypes = {
		cells: PropTypes.array,
		life: PropTypes.object.isRequired,
		modifiedCells: PropTypes.object.isRequired,
		mouseHandler: PropTypes.func.isRequired,
		presetCells: PropTypes.array
	};


	constructor(props) {
		super(props);

		this.boardHeight = props.life.height;
		this.boardWidth = props.life.width;

		this.canvasRef = React.createRef();
		this.glowRef = React.createRef();

		this.state = { cellSize: 10 };
	}


	componentDidMount() {
		const resizeCanvas = () => {
			this.setState({ cellSize: this.canvasRef.current.clientWidth / this.boardWidth });
		};

		window.onresize = resizeCanvas;
		resizeCanvas();
	}


	componentDidUpdate(prevProps, prevState) {
		const canvasCtx = this.canvasRef.current.getContext('2d');
		const cellSize = this.state.cellSize;

		if (prevState.cellSize !== cellSize) {
			this.renderGlow();
		}

		drawBackground(
			canvasCtx,
			cellSize * this.boardWidth,
			cellSize * this.boardHeight
		);

		this.loopOverCells((alive, r, c) => drawCell(canvasCtx, alive, r, c, cellSize));
		this.loopOverCells((alive, r, c) => alive && addGlow(canvasCtx, this.glowRef.current, r, c, cellSize));

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

		(this.props.presetCells || []).forEach(([ row, col]) => {
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
					onClick={ this.mouseHandler }
					onMouseDown={ this.mouseHandler }
					onMouseEnter={ this.mouseHandler }
					onMouseLeave={ this.mouseHandler }
					onMouseMove={ this.mouseHandler }
					onMouseUp={ this.mouseHandler }
					width={ this.state.cellSize * this.boardWidth }
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

