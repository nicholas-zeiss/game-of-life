/**
 *
 *	Holds various buttons used to manipulate the game of life through callbacks
 *
**/


import PropTypes from 'prop-types';
import React from 'react';
import { Subject } from 'rxjs';

import styles from '../styles/controls.css';


class Controls extends React.PureComponent {
	static propTypes = {
		animating: PropTypes.bool.isRequired,
		clear: PropTypes.func.isRequired,
		speedSubject: PropTypes.any.isRequired,
		startAnimation: PropTypes.func.isRequired,
		stopAnimation: PropTypes.func.isRequired
	};


	toggleAnimation = () => {
		this.props.animating ? this.props.stopAnimation() : this.props.startAnimation();
	};


	updateSpeed = (event) => {
		this.props.speedSubject.next(1 - (event.target.value / 100));
	}


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
					<input className={ styles.slider }  max={ 100 } min={ 0 } onInput={ this.updateSpeed } type='range' />
				</div>
			</div>
		);
	}
}


export default Controls;

