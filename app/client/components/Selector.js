/**
 *
 *	A collapsible menu allowing a user to select a preset cell structure to insert onto the board. Each preset gets
 *  its own canvas on which it is drawn, clicking that canvas selects the preset and closes the menu.
 *
**/


import PropTypes from 'prop-types';
import React from 'react';

import PresetCanvas from './PresetCanvas';

import oscillators from '../utils/oscillators';
import ships from '../utils/ships';
import stills from '../utils/stills';


const presetTypes = [
	[ 'Oscillators', oscillators ],
	[ 'Ships', ships ],
	[ 'Stills', stills ]
];


class Selector extends React.PureComponent {
	static propTypes = {
		select: PropTypes.func.isRequired
	};

	state = { open: false };


	toggle = () => {
		this.setState(prev => (
			{ open: !prev.open }
		));
	}


	selectPreset = (cells) => {
		this.props.select(cells);
		this.toggle();
	}


	createPresetCanvas = preset => (
		<PresetCanvas key={ preset.name } { ...preset } select={ this.selectPreset } />
	)


	render() {
		const cntrStyle = this.state.open ? { left: '0px' } : null;

		const presetGroups = presetTypes.map(([ groupName, presets ]) => (
			<div key={ groupName + '-category' } className='preset-category'>
				<p>{ groupName }</p>
				<div>{ presets.map(this.createPresetCanvas) }</div>
			</div>
		));

		return (
			<aside id='selector-container' style={ cntrStyle }>
				<section id='selector-content'>
					<p> Useful Patterns </p>
					<div>{ presetGroups }</div>
				</section>

				<button  id='selector-toggle' onClick={ this.toggle } type='button'> &#8811; </button>
			</aside>
		);
	}
}


export default Selector;

