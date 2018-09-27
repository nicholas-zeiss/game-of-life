/**
 *
 *	This is the root component of this app. It holds the instance of the Life class which models our game of life state (a 2d array
 *	where 0 is a dead cell and 1 a live cell). It also holds all the logic to update the model as necessary. It has subcomponents View and
 *	Controls, which render the game and handle user input.
 *
 *	The component's state also holds the generation of the game (integer), and if the user has selected a preset to place on the board
 *	it is stored as a Set in selectedPreset.
 *
**/


import React from 'react';

import Controls from './Controls';
import View from './View';
import Selector from './Selector';

import styles from '../styles/styles.css';

import Life from '../utils/Life';
import OSCILLATORS from '../utils/oscillators';


class GameOfLife extends React.Component {
	static gameHeight = 40;
	static gameWidth = 80;


	constructor(props) {
		super(props);

		this.state = {
			generation: 0,
			life: new Life(GameOfLife.gameWidth, GameOfLife.gameHeight),
			selectedPreset: null
		};

		// load a preset and offset it by 10 cells from top left corner
		const cellSet = OSCILLATORS[3].cells.reduce((cells, [r, c]) => (
			cells.add(`${r + 10}:${c + 10}`) && cells
		), new Set());

		this.toggleCells(cellSet);
	}


	componentDidMount() {
		const currGeneration = this.state.life.generation;
		currGeneration.subscribe(generation => this.setState({ generation }));
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


	setPreset = (cellSet) => {
		document.getElementById('app').style.cursor = 'move';
		this.setState({ selectedPreset: cellSet }, this.state.life.stopAnimation);
	}


	render() {
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
									life={ this.state.life }
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

				<Selector selectPreset={ this.setPreset } />
			</div>
		);
	}
}


export default GameOfLife;

