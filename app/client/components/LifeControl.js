/**
This stateless component holds various buttons used to manipulate the game of life through callbacks it receives in props
**/

import React from 'react';

const LifeControl = (props) => {
	return  (
		<div id='controls-container'>
			<button type='button' onClick={props.toggleAnimation}>{props.animated ? 'Pause' : 'Start'}</button>
			<button type='button' onClick={props.toggleGlow}>{props.glowing ? 'Stop glow' : 'Start glow'}</button>
			<button type='button' onClick={props.clear}>Clear Board</button>
		</div>
	)
};

export default LifeControl;