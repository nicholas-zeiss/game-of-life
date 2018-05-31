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
	static propTypes = {
		animating: PropTypes.bool.isRequired,
		changeSpeed: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired,
		speed: PropTypes.number.isRequired,
		startAnimation: PropTypes.func.isRequired,
		stopAnimation: PropTypes.func.isRequired
	};


	toggleAnimation = () => {
		this.props.animating ? this.props.stopAnimation() : this.props.startAnimation();
	};


	decSpeed = () => this.props.changeSpeed(-1)


	incSpeed = () => this.props.changeSpeed(1)


	render() {
		return  (
			<div className={ styles.controlsContainer }>
				<div className={ styles.playBackContainer }>
					<button onClick={ this.toggleAnimation } type='button'>
						<span>{ '\u25B6' }</span><span>{ '\u258E' }</span>
					</button>

					<button onClick={ this.props.clear } type='button'>
						{ 'Reset' }
					</button>
				</div>

				<div className={ styles.sliderContainer }>
					<input className={ styles.slider } type='range' />
				</div>
			</div>
		);
	}
}


export default Controls;

