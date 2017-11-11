/**
 *
 *	This is the root component of this app. It holds the instance of the Life class which models our game of life state (a 2d array
 *	where 0 is a dead cell and 1 a live cell). It also holds all the logic to update it as necessary. It has subcomponents View and 
 *	Controls, which render the game and handle user input respectively.
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

		this.state = {
			animating: false,
			animateInterval: null,
			canvasWidth: 800,
			cellColumns: 80,
			cellRows: 35,
			life: new Life(80, 35),
			speed: 0,								// 0: slow, 1: medium, 2: fast
			selectedPreset: null
		};
	}


	// as a window resize changes the size of each cell we must track changes
	componentDidMount() {
		const setCanvasSize = () => this.setState({ 
			canvasWidth: this.canvasContainer.offsetWidth 
		});
		
		window.onresize = setCanvasSize;
		setCanvasSize();
	}


	// to save computation the glow applied to live cells is only created once in a separate
	// undisplayed canvas which must be updated on window resizes
	componentDidUpdate(prevProps, prevState) {
		if (this.state.canvasWidth != prevState.canvasWidth) {
			const ctx = this.glowCanvas.getContext('2d');
			const radius = 4 * this.state.canvasWidth / this.state.cellColumns;
			
			drawGlow(ctx, radius, colors.gradientStart, colors.gradientStop);
		}
	}


	// set an interval and return the id
	animate = speed => {
		return setInterval(() => {
			// updateBoard will return false if no living cells remain
			if (!this.state.life.updateBoard()) {
				this.stopAnimation();
			}

			this.forceUpdate();
		}, speed);
	}


	// start and stop take an optional callback executed after animation starts/stops
	startAnimation = cb => {
		cb = cb || function() {};

		if (!this.state.animating) {
			this.setState({
				animating: true,
				animateInterval: this.animate(speeds[this.state.speed])
			}, cb);
		}
	}


	stopAnimation = cb => {
		cb = cb || function() {};

		if (this.state.animating) {
			clearInterval(this.state.animateInterval);
			
			this.setState({
				animating: false,
				animateInterval: null
			}, cb);
		}
	}


	toggleCells = (cellSet, clearPreset) => {
		cellSet.forEach(cell => {
			let [r, c] = cell.split(':');
			this.state.life.flipCellState(r, c);
		});

		// clearPreset is true if user just placed a preset cell structure
		if (clearPreset) {
			document.getElementById('app').style.cursor = 'auto';
			this.setState({ selectedPreset: null });
		} else {
			this.forceUpdate();
		}
	}


	clear = () => {
		this.state.life.clear();
		this.state.animating ? this.stopAnimation() : this.forceUpdate();
	}


	setPreset = cells => {
		document.getElementById('app').style.cursor = 'move';
		this.setState({ selectedPreset: cells }, this.stopAnimation);
	}


	changeSpeed = inc => {
		if (!this.state.animating) {
			this.setState({ speed: this.state.speed + inc });
		
		} else {
			this.stopAnimation(() => {
				this.setState({ 
					speed: this.state.speed + inc
				}, this.startAnimation);
			});
		}
	}


	render() {
		const cellSize = this.state.canvasWidth / this.state.cellColumns;

		return (
			<div id='app'>			
				<div id='header'>
					<h1> Conway&apos;s Game of Life </h1>
				</div>
				
				<div id='life-container'>
					<div id='view-controls-container'>
						<div>{ `Generation: ${this.state.life.generation}` }</div>
						
						<div id='view-container' ref={ el => this.canvasContainer = el }>
							<View 
								cellSize={ cellSize }
								cells={ this.state.life.board }
								columns={ this.state.cellColumns }
								glow={ this.glowCanvas }
								preset={ this.state.selectedPreset }
								rows={ this.state.cellRows }
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
				
				<Selector select={ this.setPreset }/>

				<canvas
					height={ 8 * cellSize }
					id='glow-canvas'
					ref={ canvas => this.glowCanvas = canvas }
					style={{ height: 8 * cellSize + 'px', width: 8 * cellSize + 'px' }}
					width={ 8 * cellSize }
				/>
			</div>
		);	
	}
}


export default GameOfLife;

