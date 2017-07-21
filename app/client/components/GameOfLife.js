/**
This is the root component of this app. It holds the instance of the Life class which models our game of life state (a 2d array
where 0 is a dead cell and 1 a live cell). It also holds all the logic to update it as necessary. It has subcomponents View and 
Controls, which render the game and handle user input respectively.
**/

import React from 'react';

import COLORS from '../utils/colors';
import Life from '../utils/Life';

import View from './View';
import Controls from './Controls';


class GameOfLife extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			life: new Life(70, 35),
			
			cellRows: 35,
			cellColumns: 70,

			canvasWidth: 800,
			canvas: null,
			
			animating: false,			
			intervalID: null
		};
	}


	componentDidMount() {
		
		window.onresize = () => { 
			this.setState({
				canvasWidth: this.state.canvas.offsetWidth
			});
		};

		let canvas = document.getElementById('life-canvas');

		this.setState({
			canvasWidth: canvas.offsetWidth,
			canvas: canvas
		});
	}


	//creating the glow gradient for each cell in view itself is very computationally intensive
	//so instead we create a separate hidden canvas with the glow effect and place it each cell in view
	componentDidUpdate() {
		let glow = document.getElementById('glow-canvas').getContext('2d');
		let cellSize = this.state.canvasWidth / this.state.cellColumns;
		let gradient = glow.createRadialGradient(4 * cellSize, 4 * cellSize, 4 * cellSize, 4 * cellSize, 4 * cellSize, 0);						
																																						 
		gradient.addColorStop(0, COLORS.gradientStart);									
		gradient.addColorStop(1, COLORS.gradientStop);
		
		glow.clearRect(0, 0, 8 * cellSize, 8 * cellSize)
		
		glow.fillStyle = gradient;

		glow.fillRect(0, 0, 8 * cellSize, 8 * cellSize);
	}


	toggleAnimation() {
		let id = null;

    if (this.state.animating) {
      clearInterval(this.state.intervalID);
    
    } else {
    	id = setInterval(() => {
    		this.state.life.updateBoard();
    		this.forceUpdate();
    	}, 250);   	
    }

  	this.setState({
  		animating : !this.state.animating,
  		intervalID : id
  	});
	}


	toggleCells(cellSet) {
		cellSet.forEach(str => {
			let [r, c] = str.split(':');
		
			this.state.life.flipCellState(Number(r), Number(c))
		});

		this.forceUpdate();
	}


	// toggleGlow() {
	// 	this.setState({
	// 		renderGlow : !this.state.renderGlow
	// 	});
	// }


	clear() {
		this.state.life.clear();

		if (this.state.animating) {
			clearInterval(this.state.intervalID);
		}

		this.setState({
			animating : false,
			intervalID : null
		});
	}


	render() {
		return (
			<div id='app'>			
				<div id='header'>
					<h1>Conway's Game of Life</h1>
				</div>
				
				<div id='view-controls-container'>
					<View 
						cells={this.state.life.board}
						rows={this.state.cellRows}
						columns={this.state.cellColumns}
						cellSize={this.state.canvasWidth / this.state.cellColumns}
						toggleCells={this.toggleCells.bind(this)} 
						animating={this.state.animating}/> 
					<Controls
						toggleAnimation={this.toggleAnimation.bind(this)} 
						clear={this.clear.bind(this)} 
						animating={this.state.animating}/>
				</div>
					
				<div className='empty'>
					<canvas
						id='glow-canvas'
						height={8 * this.state.canvasWidth / this.state.cellColumns}
						width={8 * this.state.canvasWidth / this.state.cellColumns}>
					</canvas>
				</div>
			</div>
		);	
	}
}


export default GameOfLife;

