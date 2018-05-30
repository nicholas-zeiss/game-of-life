/**
 *
 *	This is the root component of this app. It holds the instance of the Life class which models our game of life state (a 2d array
 *	where 0 is a dead cell and 1 a live cell). It also holds all the logic to update the model as necessary. It has subcomponents View and
 *	Controls, which render the game and handle user input.
 *
**/


import React from 'react';

import Controls from './Controls';
import View from './View';
import Selector from './Selector';

import { drawGlow } from '../utils/cells';
import colors from '../utils/colors';
import Life from '../utils/Life';
import speeds from '../utils/speeds';


class GameOfLife extends React.Component {
	constructor(props) {
		super(props);

		const game = new Life(80, 35);

		this.state = {
			animating: false,
			animateInterval: null,
			canvasWidth: 800,
			cells: game.board,
			life: game,
			speed: 1,								// 0: slow, 1: medium, 2: fast
			selectedPreset: null
		};

		this.state.life.flipCellState(15, 36);
		this.state.life.flipCellState(15, 37);
		this.state.life.flipCellState(16, 35);
		this.state.life.flipCellState(16, 36);
		this.state.life.flipCellState(17, 36);
	}


	// As a window resize changes the size of our canvas must change
	componentDidMount() {
		const setCanvasSize = () => this.setState({
			canvasWidth: this.canvasContainer.clientWidth
		});

		window.onresize = setCanvasSize;
		setCanvasSize();
	}


	// To save computation the glow applied to live cells is only created once in a separate
	// undisplayed canvas which must be updated on window resizes
	componentDidUpdate(prevProps, prevState) {
		if (this.state.canvasWidth !== prevState.canvasWidth) {
			const ctx = this.glowCanvas.getContext('2d');
			const radius = 4 * this.state.canvasWidth / 80;

			drawGlow(ctx, radius, colors.gradientStart, colors.gradientStop);

			// Now that the glow canvas is drawn we need to force <View/> to redraw
			this.forceUpdate();
		}
	}


	// Set an interval and return the id
	animate = speed => setInterval(() => {
		// UpdateBoard will return false if no living cells remain
		const { anyAlive, change } = this.state.life.updateBoard();

		if (!anyAlive) {
			this.stopAnimation();
		}

		if (change) {
			this.setState((state) => ({ cells: state.life.board }));
		} else {
			this.forceUpdate();
		}
	}, speed)


	// Start and stop take an optional callback to be executed after animation starts/stops
	startAnimation = (cb) => {
		cb = cb || function() {};
		const speed = speeds[this.state.speed];

		if (!this.state.animating) {
			this.setState({
				animating: true,
				animateInterval: this.animate(speed)
			}, cb);
		} else {
			cb();
		}
	}


	stopAnimation = (cb) => {
		cb = cb || function() {};

		if (this.state.animating) {
			clearInterval(this.state.animateInterval);

			this.setState({
				animating: false,
				animateInterval: null
			}, cb);
		} else {
			cb();
		}
	}


	toggleCells = (cellSet, clearPreset) => {
		cellSet.forEach((cell) => {
			const [r, c] = cell.split(':');
			this.state.life.flipCellState(r, c);
		});

		// ClearPreset is true if user just placed a preset cell structure
		const update = {};

		if (clearPreset) {
			document.getElementById('app').style.cursor = 'auto';
			update.selectedPreset = null;
		}

		this.setState((state) => Object.assign(update, { cells: state.life.board }));
	}


	clear = () => {
		this.stopAnimation(() => {
			this.state.life.clear();
			this.setState((state) => ({ cells: state.life.board }));
		});
	}


	setPreset = (cells) => {
		document.getElementById('app').style.cursor = 'move';
		this.setState({ selectedPreset: cells }, this.stopAnimation);
	}


	// Inc is +/- 1
	changeSpeed = (inc) => {
		const nextSpeed = this.state.speed + inc;

		if (!this.state.animating) {
			this.setState({ speed: nextSpeed });

		} else {
			this.stopAnimation(() => {
				this.setState({
					speed: nextSpeed
				}, this.startAnimation);
			});
		}
	}


	render() {
		const cellSize = this.state.canvasWidth / 80;

		return (
			<div id='app'>
				<div id='header'>
					<h1> Conway&apos;s Game of Life </h1>
					<h4>Use your mouse to toggle one or more cells (game must be paused), or insert a preset structure from the menu on the left.</h4>
				</div>

				<div id='life-container'>
					<div id='view-controls-container'>
						<div>{ `Generation: ${this.state.life.generation}` }</div>

						<div ref={ el => this.canvasContainer = el } id='view-container'>
							<View
								animating={ this.state.animating }
								cellSize={ cellSize }
								cells={ this.state.cells }
								glow={ this.glowCanvas }
								preset={ this.state.selectedPreset }
								toggleCells={ this.toggleCells }
							/>
						</div>

						<Controls
							animating={ this.state.animating }
							changeSpeed={ this.changeSpeed }
							clear={ this.clear }
							speed={ this.state.speed }
							startAnimation={ this.startAnimation }
							stopAnimation={ this.stopAnimation }
						/>
					</div>
				</div>

				<Selector select={ this.setPreset } />

				<canvas
					ref={ canvas => this.glowCanvas = canvas }
					height={ 8 * cellSize }
					style={{ display: 'none', height: 8 * cellSize + 'px', width: 8 * cellSize + 'px' }}
					width={ 8 * cellSize }
				/>
			</div>
		);
	}
}


export default GameOfLife;

