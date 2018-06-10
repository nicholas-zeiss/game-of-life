/**
 *
 *	Holds various buttons used to manipulate the game of life through callbacks
 *
**/


import PropTypes from 'prop-types';
import React from 'react';

import styles from '../styles/controls.css';


class Controls extends React.PureComponent {
	static propTypes = {
		animating: PropTypes.object.isRequired,
		clear: PropTypes.func.isRequired,
		speedSubject: PropTypes.object.isRequired,
		startAnimation: PropTypes.func.isRequired,
		stopAnimation: PropTypes.func.isRequired
	};

	state = {
		animating: false,
		speed: .5
	};


	componentDidMount() {
		this.props.animating.subscribe(animating => this.setState({ animating }));
		this.props.speedSubject.subscribe(speed => this.setState({ speed }));
	}


	toggleAnimation = () => {
		this.state.animating ? this.props.stopAnimation() : this.props.startAnimation();
	};


	updateSpeed = (event) => {
		this.props.speedSubject.next(1 - (event.target.value / 100));
	}


	render() {
		return  (
			<div className={ styles.controlsContainer }>
				<div className={ styles.playBackContainer }>
					<button
						className={ this.state.animating ? styles.pause : styles.play }
						onClick={ this.toggleAnimation }
						type='button'
					>
						{ this.state.animating ?  '\u2590\u2590' : '\u25B6' }
					</button>

					<button onClick={ this.props.clear } type='button'>
						{ 'Reset' }
					</button>
				</div>

				<div className={ styles.sliderContainer }>
					<input
						className={ styles.slider }
						defaultValue={ this.state.speed * 100 }
						max={ 100 }
						min={ 0 }
						onInput={ this.updateSpeed }
						type='range'
					/>
				</div>
			</div>
		);
	}
}


export default Controls;

