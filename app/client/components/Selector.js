

import React from 'react';

import COLORS from '../utils/colors';

import OSCILLATORS from '../utils/oscillators';
import SHIPS from '../utils/ships';
import STILLS from '../utils/stills';


class Selector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			cellSize: 10
		}
	}


	componentDidMount() {
		let size = this.state.cellSize;

		let PRESETS = Object.assign({}, OSCILLATORS, SHIPS, STILLS);

		for (let shape in PRESETS) {
			let preset = PRESETS[shape];
			
			let ctx = document.getElementById(`selector-${shape}`).getContext('2d');

			for (let i = 0; i < preset.cells.length; i++) {
				let r = preset.cells[i][0];
				let c = preset.cells[i][1];

				ctx.fillStyle = COLORS.cellBorder;
				ctx.fillRect(size * c, size * r, size, size);

				ctx.fillStyle = COLORS.liveCell;
				ctx.fillRect(size * c + 1, size * r + 1, size - 1, size - 1);
			}
		}
	}


	shouldComponentUpdate(nextProps) {
		return false;
	}


	toggle(presetCells, e) {
		let modal = document.getElementById('selector-container');
		
		if (e.target.className === 'selector-canvas') {
			this.props.select(presetCells);
		}

		if (modal.style.left === '0px') {
			modal.style.left = '-410px';
		} else {
			modal.style.left = '0px';
		}
	}


	createCanvases(preset, presetName) {	
		let shapes = [];

		for (let shape in preset) {
			shapes.push(
				<div 
					key={`${shape}-label`}
					className='selector-preset-label'>
					{shape}
				</div>,
				
				<canvas 
					key={shape}
					className='selector-canvas'
					id={`selector-${shape}`}
					width={this.state.cellSize * preset[shape].width}
					height={this.state.cellSize * preset[shape].height}
					onClick={this.toggle.bind(this, preset[shape].cells)}>
				</canvas>
			);
		}

		return (
			<div 
				key={`${presetName}-category`}
				className='selector-category'>
				<div 
					key={`${presetName}-label`}
					className='selector-category-label'>
					{`${presetName}:`}
				</div>
				{shapes}
			</div>
		);
	}
	

	render() {
		let content = [];
		
		content.push(this.createCanvases(STILLS, 'Stills'));
		content.push(this.createCanvases(OSCILLATORS, 'Oscillators'));
		content.push(this.createCanvases(SHIPS, 'Ships'));

		return (
			<div id='selector-container'>
				<div id='selector'>
					<div id='selector-title'>Useful Patterns</div>
					<div id='selector-content'>
						{content}
					</div>
				</div>
				
				<button 
					id='selector-toggle'
					type='button' 
					onClick={this.toggle.bind(this, null)}>
					&#8811;
				</button>
			</div>
		);
	}
}


export default Selector;

