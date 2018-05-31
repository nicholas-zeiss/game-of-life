/**
 *
 *	Holds various buttons used to manipulate the game of life through callbacks
 *
**/


import PropTypes from 'prop-types';
import React from 'react';

import styles from '../styles/controls.css';


// const CtrlButton = props => (
// 	// <button disabled={ props.disabled } onClick={ props.cb } type='button'>
// 	// 	{ props.text }
// 	// </button>
// );

// CtrlButton.defaultProps = {
// 	disabled: false
// };

// CtrlButton.propTypes = {
// 	cb: PropTypes.func.isRequired,
// 	disabled: PropTypes.bool,
// 	text: PropTypes.string.isRequired
// };


class Controls extends React.PureComponent {

	toggleAnimation = () => {
		this.props.animating ? this.props.stopAnimation() : this.props.startAnimation();
	};

	decSpeed = () => this.props.changeSpeed(-1)

	incSpeed = () => this.props.changeSpeed(1)

	render() {
		return  (
			<div className={ styles.controlsContainer }>
				<input onClick={ this.toggleAnimation } value={ this.props.animating ? 'Pause' : 'Start' }  type='button'/>

				<div className={ styles.sliderContainer }>
					<input type='range' onChange={ event => console.log(event.target.value) } className={ styles.slider }/>
				</div>

				<input onClick={ this.props.clear } value='Reset' type='button'/>
			</div>
		);
	}


	// render() {
	// 	return  (
	// 		<div id='controls-container'>
	// 			<input onClick={ this.toggleAnimation } value={ this.props.animating ? 'Pause' : 'Start' }  type='button'/>

	// 			<div id='speed'>
	// 				<input onClick={ this.decSpeed } disabled={ !this.props.speed } value='&#8810;'  type='button'/>
	// 				<div>{ [ 'Slow', 'Medium', 'Fast' ][this.props.speed] }</div>
	// 				<input onClick={ this.incSpeed } disabled={ this.props.speed === 2 } value='&#8811;' type='button' />
	// 			</div>

	// 			<input onClick={ this.props.clear } value='Clear Board' type='button'/>
	// 		</div>
	// 	);
	// }
}


Controls.propTypes = {
	animating: PropTypes.bool.isRequired,
	changeSpeed: PropTypes.func.isRequired,
	clear: PropTypes.func.isRequired,
	speed: PropTypes.number.isRequired,
	startAnimation: PropTypes.func.isRequired,
	stopAnimation: PropTypes.func.isRequired
};


export default Controls;

