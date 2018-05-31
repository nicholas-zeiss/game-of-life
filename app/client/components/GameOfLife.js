/**
 *
 *	This is the root component of this app. It holds the instance of the Life class which models our game of life state (a 2d array
 *	where 0 is a dead cell and 1 a live cell). It also holds all the logic to update the model as necessary. It has subcomponents View and
 *	Controls, which render the game and handle user input.
 *
**/


import React from 'react';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import Controls from './Controls';
import View from './View';
import Selector from './Selector';

import styles from '../styles/styles.css';

import { COLORS, drawGlow } from '../utils/cells';
import Life from '../utils/Life';


class GameOfLife extends React.Component {
	static gameHeight = 40;
	static gameWidth = 80;


	constructor(props) {
		super(props);

		const game = new Life(GameOfLife.gameWidth, GameOfLife.gameHeight);

		this.state = {
			animating: false,
			animateInterval: null,
			gameWidth: 800,
			cells: game.board,
			life: game,
			speed: 150,
			selectedPreset: null
		};


		this.gameContainer = React.createRef();
		this.glowCanvas = React.createRef();

		this.speedSubject = new Subject();
	}


	componentDidMount() {
		this.speedSubject
			.pipe(
				distinctUntilChanged(),
				// debounceTime(10)
			)
			.subscribe(this.changeSpeed);

		const resizeCanvas = () => {
			this.setState({ gameWidth: this.gameContainer.current.clientWidth });
		};

		window.onresize = resizeCanvas;
		resizeCanvas();
	}


	componentDidUpdate(prevProps, prevState) {
		if (this.state.gameWidth !== prevState.gameWidth) {
			const ctx = this.glowCanvas.current.getContext('2d');
			const radius = 4 * this.state.gameWidth / GameOfLife.gameWidth;

			drawGlow(ctx, radius, COLORS.gradientStart, COLORS.gradientStop);

			this.forceUpdate();
		}
	}


	animate = () => (
		setInterval(() => {
			const { anyAlive, change } = this.state.life.updateBoard();

			if (!anyAlive) {
				this.stopAnimation();
			}

			if (change) {
				this.setState(state => ({ cells: state.life.board }));
			}
		}, this.state.speed)
	);


	startAnimation = (cb) => {
		cb = cb ? cb : () => {};

		if (!this.state.animating) {
			this.setState({
				animating: true,
				animateInterval: this.animate()
			}, cb);
		} else {
			cb();
		}
	}


	stopAnimation = (cb) => {
		cb = cb ? cb : () => {};

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
		if (!cellSet.size && !cellSet.length) {
			return;
		}

		cellSet.forEach((cell) => {
			const [r, c] = cell.split(':');
			this.state.life.flipCellState(r, c);
		});

		const update = {};

		if (clearPreset) {
			document.getElementById('app').style.cursor = 'auto';
			update.selectedPreset = null;
		}

		this.setState(state => Object.assign(update, { cells: state.life.board }));
	}


	clear = () => {
		this.stopAnimation(() => {
			this.state.life.clear();
			this.setState(state => ({ cells: state.life.board }));
		});
	}


	setPreset = (cells) => {
		document.getElementById('app').style.cursor = 'move';
		this.setState({ selectedPreset: cells }, this.stopAnimation);
	}


	changeSpeed = (percent) => {
		const nextSpeed = 10 + percent * 300;

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
		const cellSize = this.state.gameWidth / GameOfLife.gameWidth;

		return (
			<div id='app'>
				<div className={ styles.appContainer }>
					<div className={ styles.header }>
						<span> Conway&apos;s Game of Life </span>
						<p>Use your mouse to toggle one or more cells (game must be paused), or insert a preset structure from the menu on the left.</p>
					</div>

					<div className={ styles.lifeContainer }>
						<div className={ styles.viewControlsContainer }>
							<div ref={ this.gameContainer } className={ styles.viewContainer }>
								<View
									animating={ this.state.animating }
									cellSize={ cellSize }
									cells={ this.state.cells }
									glow={ this.glowCanvas.current }
									preset={ this.state.selectedPreset }
									toggleCells={ this.toggleCells }
								/>
							</div>

							<Controls
								animating={ this.state.animating }
								clear={ this.clear }
								speedSubject={ this.speedSubject }
								startAnimation={ this.startAnimation }
								stopAnimation={ this.stopAnimation }
							/>
						</div>
					</div>
				</div>

				<Selector select={ this.setPreset } />

				<canvas
					ref={ this.glowCanvas }
					height={ 8 * cellSize }
					style={{
						display: 'none',
						height: 8 * cellSize + 'px',
						width: 8 * cellSize + 'px'
					}}
					width={ 8 * cellSize }
				/>
			</div>
		);
	}
}


export default GameOfLife;

