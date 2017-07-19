/**
This is the root component of this app. It holds the instance of the Life class which models our game of life state (a 2d array
where 0 is a dead cell and 1 a live cell). It also holds all the logic to update it as necessary. It has subcomponents View and 
Controls, which render the game and handle user input respectively.
**/

import React from 'react';

import Life from '../utils/Life';

import View from './View';
import Controls from './Controls';


class GameOfLife extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			life: new Life(100,50),
			
			cellRows: 50,
			cellColumns: 100,

			canvasWidth: 800,
			canvasDiv: null,
			
			animating: false,
			renderGlow: false,
			
			intervalID: null
		};
	}


	componentDidMount() {
		
		window.onresize = () => { 
			this.setState({
				canvasWidth: this.state.canvasDiv.offsetWidth
			});
		};

		let canvasDiv = document.getElementById('canvas-container')

		this.setState({
			canvasWidth: canvasDiv.offsetWidth,
			canvasDiv: canvasDiv
		});
	}

	toggleAnimation() {
		let id = null;

    if (this.state.animating) {
      clearInterval(this.state.intervalID);
    
    } else {
    	id = setInterval(() => {
    		this.state.life.updateBoard();
    		this.forceUpdate();
    	}, 150);   	
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


	toggleGlow() {
		this.setState({
			renderGlow : !this.state.renderGlow
		});
	}


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
					<div id='canvas-container'>
						<View 
							cells={this.state.life.board}
							rows={this.state.cellRows}
							columns={this.state.cellColumns}
							cellSize={this.state.canvasWidth / this.state.cellColumns}
							toggleCells={this.toggleCells.bind(this)} 
							animating={this.state.animating} 
							glowing={this.state.renderGlow}/>
					</div>
					<Controls
						toggleAnimation={this.toggleAnimation.bind(this)} 
						toggleGlow={this.toggleGlow.bind(this)} 
						clear={this.clear.bind(this)} 
						animating={this.state.animating} 
						glowing={this.state.renderGlow}/>
				</div>

				<div className='empty'>
				</div>
			</div>
		);	
	}
}


export default GameOfLife;

