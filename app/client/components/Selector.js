/**
 *
 *	A collapsible menu allowing a user to select a preset cell structure to insert onto the board. Each preset gets
 *  its own canvas on which it is drawn, clicking that canvas selects the preset and closes the menu.
 *
**/

import React from 'react';

import { drawCell } from '../utils/cells';
import colors from '../utils/colors';
import oscillators from '../utils/oscillators';
import ships from '../utils/ships';
import stills from '../utils/stills';


const cellSize = 10;
const presets = Object.assign({}, oscillators, ships, stills);


class Selector extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false };
		this.contexts = {};
	}


	componentDidMount() {
		const color = colors.liveCell;

		for (let shape in presets) {
			const ctx = this.contexts[shape];
			const preset = presets[shape];

			preset.cells.forEach(([r, c]) => drawCell(ctx, color, r, c, cellSize));
		}
	}


	shouldComponentUpdate(nextProps, nextState) {
		return this.state.open != nextState.open;
	}


	toggle = () => {
		this.setState({ open: !this.state.open });
	}


	selectPreset = cells => {		
		this.props.select(cells);
		this.toggle();
	}


	createCanvases(presets, groupName) {
		let canvases = [];

		for (let preset in presets) {
			canvases.push(
				<div className='preset-label' key={ preset + '-label' }>{ preset }</div>,
				
				<canvas 
					className='preset-canvas'
					height={ cellSize * presets[preset].height }
					key={ preset }
					onClick={ this.selectPreset.bind(this, presets[preset].cells) }
					ref={ canvas => canvas ? this.contexts[preset] = canvas.getContext('2d') : null }
					width={ cellSize * presets[preset].width }
				>
				</canvas>
			);
		}

		return (
			<div className='preset-category' key={ groupName + '-category' }>
				<div className='preset-category-label' key={ groupName }>{ groupName + ':' }</div>
				{ canvases }
			</div>
		);
	}
	

	render() {
		const content = [
			this.createCanvases(stills, 'Stills'),
			this.createCanvases(oscillators, 'Oscillators'),
			this.createCanvases(ships, 'Ships')
		];

		return (
			<div
				id='selector-container'
				ref={ div => this.container = div }
				style={{ left: this.state.open ? '0px' : '-445px', width: '450px' }}
			>
				<div id='selector'>
					<div id='selector-title'> Useful Patterns </div>
					<div id='selector-content'>{ content }</div>
				</div>
				
				<button  id='selector-toggle' onClick={ this.toggle }>
					&#8811;
				</button>
			</div>
		);
	}
}


export default Selector;

