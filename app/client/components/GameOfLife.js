/**
This is the root component of this app. It holds the instance of the Life class which models our game of life state (a 2d array
where 0 is a dead cell and 1 a live cell). It also holds all the logic to update it as necessary. It has subcomponents View and 
Controls, which render the game and handle user input respectively.
**/

import React from 'react';

import Life from '../utils/Life';

import COLORS from '../utils/colors';

import Controls from './Controls';
import View from './View';
import Selector from './Selector';


const DELAYS = {
	slow: 500,
	medium: 150,
	fast: 50
}


class GameOfLife extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			life: new Life(70, 35),
			
			cellRows: 35,
			cellColumns: 70,

			canvas: null,
			canvasWidth: 800,
			
			animating: false,			
			intervalID: null,
			delay: 'medium',

			selectedPreset: null
		};
	}


	componentDidMount() {
		//so that View component gets updated cellSize prop
		window.onresize = () => {
			this.setState({
				canvasWidth: document.getElementById('life-canvas').offsetWidth
			});
		}

		let canvas = document.getElementById('life-canvas');

		this.setState({
			canvas: canvas,
			canvasWidth: canvas.offsetWidth
		});
	}


	toggleAnimation() {
		let id = null;

    if (this.state.animating) {
      clearInterval(this.state.intervalID);
    
    } else {
    	id = setInterval(() => {
    		//updateBoard will return false if no living cells remain
    		if (!this.state.life.updateBoard()) {
    			this.toggleAnimation();
    		}

    		this.forceUpdate();
    	}, DELAYS[this.state.delay]);   	
    }

  	this.setState({
  		animating : !this.state.animating,
  		intervalID : id
  	});
	}


	toggleCells(cellSet, clearPreset) {
		cellSet.forEach(str => {
			let [r, c] = str.split(':');
			this.state.life.flipCellState(Number(r), Number(c))
		});

		if (clearPreset) {
			document.getElementById('app').style.cursor = 'auto';
			this.setState({selectedPreset: null});
		} else {
			this.forceUpdate();
		}
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


	setPreset(cells) {
		document.getElementById('app').style.cursor = 'move';
		
		if (this.state.animating) {
			this.setState({selectedPreset: cells}, this.toggleAnimation);
		
		} else {
			this.setState({selectedPreset: cells});
		}
	}


	changeSpeed(e) {
		if (!this.state.animating) {
			this.setState({
				delay: e.target.value
			});
		
		} else {
			clearInterval(this.state.intervalID);
			
			let id = setInterval(() => {
    		if (!this.state.life.updateBoard()) {
    			this.toggleAnimation();
    		}

	    	this.forceUpdate();

	    }, DELAYS[e.target.value]);
		  
	  	this.setState({
	  		delay: e.target.value,
	  		intervalID : id
	  	});
    }
	}


	render() {
		return (
			<div id='app'>			
				<div id='header'>
					<h1>Conway's Game of Life</h1>
				</div>
				
				<div id='view-controls-container'>
					{`Generation: ${this.state.life.generation}`}
					<View 
						cells={this.state.life.board}
						rows={this.state.cellRows}
						columns={this.state.cellColumns}
						cellSize={this.state.canvasWidth / this.state.cellColumns}
						toggleCells={this.toggleCells.bind(this)}
						preset={this.state.selectedPreset}
						animating={this.state.animating}/> 
					<Controls
						toggleAnimation={this.toggleAnimation.bind(this)} 
						clear={this.clear.bind(this)} 
						animating={this.state.animating}
						speed={this.state.delay}
						changeSpeed={this.changeSpeed.bind(this)}/>
				</div>
				
				<Selector
					select={this.setPreset.bind(this)}/>

				<div className='empty'>
				</div>
			</div>
		);	
	}
}


export default GameOfLife;

