/**
 *
 *	A collapsible menu allowing a user to select a preset cell structure to insert onto the board. Each preset gets
 *  its own canvas on which it is drawn, clicking that canvas selects the preset and closes the menu, pausing the game
 *	if it is animating.
 *
**/


import PropTypes from 'prop-types';
import React from 'react';

import PresetCanvas from './PresetCanvas';

import styles from '../styles/selector.css';
import oscillators from '../utils/oscillators';
import ships from '../utils/ships';
import stills from '../utils/stills';


const presetCategories = [
	[ 'Oscillators', oscillators ],
	[ 'Ships', ships ],
	[ 'Stills', stills ]
];


class Selector extends React.PureComponent {
	static propTypes = {
		selectPreset: PropTypes.func.isRequired
	};

	state = { open: false };


	toggle = () => {
		this.setState(prev => ({ open: !prev.open }));
	}


	selectPreset = (cells) => {
		this.props.selectPreset(cells);
		this.toggle();
	}


	createPresetCanvas = preset => (
		<PresetCanvas
			key={ preset.name }
			{ ...preset }
			select={ this.selectPreset }
		/>
	)


	render() {
		const cntrStyle = { left: this.state.open ? '0px' : '-405px' };

		const presetGroups = presetCategories.map(([ categoryName, presets ]) => (
			<div key={ categoryName + '-category' } className={ styles.presetCategory }>
				<p>{ categoryName }</p>
				<div>{ presets.map(this.createPresetCanvas) }</div>
			</div>
		));

		return (
			<aside className={ styles.selectorContainer } style={ cntrStyle }>
				<section className={ styles.selectorContent }>
					<p> Useful Patterns </p>
					<div>{ presetGroups }</div>
				</section>

				<button
					className={ styles.selectorToggle }
					type='button'
					onClick={ this.toggle }
				>
					<i
						className='material-icons'
						style={{ fontSize: '36px' }}
					>
						arrow_forward_ios
					</i>
				</button>
			</aside>
		);
	}
}


export default Selector;

