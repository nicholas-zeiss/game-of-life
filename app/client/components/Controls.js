/**
This stateless component holds various buttons used to manipulate the game of life through callbacks it receives in props
**/

import React from 'react';


const Controls = props => {
	const toggleAnimation = () => {
		props.animating ? props.stopAnimation() : props.startAnimation();
	}

	return  (
		<div id='controls-container'>
			
			<button 
				type='button' 
				onClick={toggleAnimation}>
				{props.animating ? 'Pause' : 'Play'}
			</button>

			<div id='speed'>
				<button
					type='button'
					disabled={props.speed === 0}
					onClick={props.changeSpeed.bind(null, -1)}>
					-
				</button>
				<div>{['Slow', 'Medium', 'Fast'][props.speed]}</div>
				<button
					type='button'
					disabled={props.speed === 2}
					onClick={props.changeSpeed.bind(null, 1)}>
					+
				</button>
			</div>
			
			<button
				id='clear'
				type='button'
			  onClick={props.clear}>
			  Clear Board
			</button>
		
		</div>
	)
};

export default Controls;