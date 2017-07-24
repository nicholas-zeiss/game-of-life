/**
This stateless component holds various buttons used to manipulate the game of life through callbacks it receives in props
**/

import React from 'react';


const Controls = (props) => {
	return  (
		<div id='controls-container'>
			
			<button 
				type='button' 
				onClick={props.toggleAnimation}>
				{props.animating ? 'Pause' : 'Start'}
			</button>

			<select 
				id='speed-select' 
				onChange={props.changeSpeed}
				value={props.speed}>
				<option value='slow'>Slow</option>
				<option value='medium'>Medium</option>
				<option value='fast'>Fast</option>
			</select>
			
			<button
				type='button'
			  onClick={props.clear}>
			  Clear Board
			</button>
		
		</div>
	)
};

export default Controls;