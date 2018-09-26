/**
 *
 *	Holds various buttons used to manipulate the game of life through callbacks. Can play/pause, reset the game, and
 *	adjust the speed at which it animates.
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
	}


	updateSpeed = (event) => {
		const percentSpeed = 1 - (event.target.value / 100);
		this.props.speedSubject.next(percentSpeed);
	}


	render() {
		return  (
			<div className={ styles.controlsContainer }>
				<div className={ styles.playBackContainer }>
					<button
						className={ this.state.animating ? styles.pause : styles.play }
						type='button'
						onClick={ this.toggleAnimation }
					>
						<i className='material-icons' style={{ fontSize: '30px' }}>
							{ this.state.animating ? 'pause' : 'play_arrow' }
						</i>
					</button>

					<button type='button' onClick={ this.props.clear }>
						{ 'Reset' }
					</button>
				</div>

				<div className={ styles.sliderContainer }>
					<span style={{ marginRight: '10px' }}> Slower </span>
					<input
						className={ styles.slider }
						defaultValue={ this.state.speed * 100 }
						max={ 100 }
						min={ 0 }
						type='range'
						onInput={ this.updateSpeed }
					/>
					<span style={{ marginLeft: '10px' }}> Faster </span>
				</div>
			</div>
		);
	}
}


export default Controls;

