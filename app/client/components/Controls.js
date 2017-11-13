/**
 *
 *	Holds various buttons used to manipulate the game of life through callbacks
 *
**/

import React from 'react';


const Controls = props => {
	const toggleAnimation = () => {
		props.animating ? props.stopAnimation() : props.startAnimation();
	};

	const speed = [ 'Slow', 'Medium', 'Fast' ][props.speed];

	return  (
		<div id='controls-container'>	
			<button onClick={ toggleAnimation } type='button'>
				{ props.animating ? 'Pause' : 'Start' }
			</button>

			<div id='speed'>
				<button disabled={ props.speed == 0 } onClick={ props.changeSpeed.bind(null, -1) }>
					&#8810;
				</button>

				<div>{ speed }</div>

				<button disabled={ props.speed == 2 } onClick={ props.changeSpeed.bind(null, 1) }>
					&#8811;
				</button>
			</div>
			
			<button id='clear' onClick={ props.clear }>
				Clear Board
			</button>
		</div>
	);
};


export default Controls;

