/**
This is the root component of this app. It holds the instance of the Life class which models our game of life state and holds
all the logic to update it as necessary. It has subcomponents View and Controls, which render the game and handle user input
respectively.
**/

import React from 'react';

import Life from '../utils/Life';
import View from './View';
import Controls from './Controls';


class GameOfLife extends React.Component {
	constructor(props) {
		this.state = {
			life : new Life(40,20),
			
			width : 40,
			height : 20,
			
			animating : false,
			renderGlow : false,
			
			intervalID : null
		};
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


	toggleCells(set) {
		if (!this.state.animating) {		//todo remove this check
			
			set.forEach(str => {
				let [r, c] = str.split(':');
			
				this.state.life.flipCellState(Number(r), Number(c))
			});

			this.forceUpdate();
		}
	}


	toggleGlow() {
		if(!this.state.animating) {	//todo remove this check
			this.setState({
				renderGlow : !this.state.renderGlow
			});
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


	render() {
		return (
			<div id='app'>
				
				<div id='header'>
					<h1>Conway's Game of Life</h1>
				</div>
				
				<div id='view-controls-container'>
					<LifeView 
						cells={this.state.life.board} 
						toggleCells={this.toggleCells} 
						animated={this.state.animating} 
						glowing={this.state.renderGlow}/>
					
					<LifeControl 
						toggleAnimation={this.toggleAnimation} 
						toggleGlow={this.toggleGlow} 
						clear={this.clear} 
						animated={this.state.animating} 
						glowing={this.state.renderGlow}/>
				</div>

				<div className='empty'></div>
			</div>
		);	
	}
});

export default GameOfLife;

