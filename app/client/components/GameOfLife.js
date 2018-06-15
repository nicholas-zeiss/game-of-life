/**
 *
 *	This is the root component of this app. It holds the instance of the Life class which models our game of life state (a 2d array
 *	where 0 is a dead cell and 1 a live cell). It also holds all the logic to update the model as necessary. It has subcomponents View and
 *	Controls, which render the game and handle user input.
 *
**/


import React from 'react';
// import { Subject } from 'rxjs';
// import { debounceTime, distinctUntilChanged, sampleTime } from 'rxjs/operators';

import Controls from './Controls';
import View from './View';
import Selector from './Selector';

import styles from '../styles/styles.css';

import { COLORS, drawGlow } from '../utils/cells';
import Life from '../utils/Life';
import OSCILLATORS from '../utils/oscillators';


class GameOfLife extends React.Component {
	static gameHeight = 40;
	static gameWidth = 80;


	constructor(props) {
		super(props);

		const game = new Life(GameOfLife.gameWidth, GameOfLife.gameHeight);

		this.state = {
			animating: false,
			gameWidth: 800,
			generation: 0,
			life: game,
			selectedPreset: null
		};


		this.gameContainer = React.createRef();
		this.glowCanvas = React.createRef();

		const pulsar = OSCILLATORS[3];
		const cellSet = pulsar.cells.reduce((cells, [r, c]) => {
			cells.add(`${r + 10}:${c + 10}`);
			return cells;
		}, new Set());

		this.toggleCells(cellSet);
	}


	componentDidMount() {
		this.state.life.generation.subscribe(generation => this.setState({ generation }));

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


	toggleCells = (cellSet, clearPreset = false) => {
		if (!cellSet.size && !cellSet.length) {
			return;
		}

		this.state.life.flipCellStates(cellSet);

		if (clearPreset) {
			document.getElementById('app').style.cursor = 'auto';
			this.setState({ selectedPreset: null });
		}
	}


	setPreset = (cells) => {
		document.getElementById('app').style.cursor = 'move';
		this.setState({ selectedPreset: cells }, this.state.life.stopAnimation);
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
								<span>Generation: { this.state.generation }</span>
								<View
									animating={ this.state.animating }
									board={ this.state.life.board }
									boardHeight={ this.state.life.height }
									boardWidth={ this.state.life.width }
									cellSize={ cellSize }
									glow={ this.glowCanvas.current }
									preset={ this.state.selectedPreset }
									toggleCells={ this.toggleCells }
								/>
							</div>

							<Controls
								animating={ this.state.life.animating }
								clear={ this.state.life.clear }
								speedSubject={ this.state.life.animationSpeedSubject }
								startAnimation={ this.state.life.startAnimation }
								stopAnimation={ this.state.life.stopAnimation }
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

