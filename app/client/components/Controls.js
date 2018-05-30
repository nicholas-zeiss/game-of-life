/**
 *
 *	Holds various buttons used to manipulate the game of life through callbacks
 *
**/


import PropTypes from 'prop-types';
import React from 'react';


const CtrlButton = props => (
	<button disabled={ props.disabled } onClick={ props.cb } type='button'>
		{ props.text }
	</button>
);

CtrlButton.defaultProps = {
	disabled: false
};

CtrlButton.propTypes = {
	cb: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	text: PropTypes.string.isRequired
};


class Controls extends React.PureComponent {

	toggleAnimation = () => {
		this.props.animating ? this.props.stopAnimation() : this.props.startAnimation();
	};

	decSpeed = () => this.props.changeSpeed(-1)

	incSpeed = () => this.props.changeSpeed(1)


	render() {
		return  (
			<div id='controls-container'>
				<CtrlButton cb={ this.toggleAnimation } text={ this.props.animating ? 'Pause' : 'Start' } />

				<div id='speed'>
					<CtrlButton cb={ this.decSpeed } disabled={ !this.props.speed } text='&#8810;' />
					<div>{ [ 'Slow', 'Medium', 'Fast' ][this.props.speed] }</div>
					<CtrlButton cb={ this.incSpeed } disabled={ this.props.speed === 2 } text='&#8811;' />
				</div>

				<CtrlButton cb={ this.props.clear } text='Clear Board' />
			</div>
		);
	}
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

