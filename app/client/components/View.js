/**
This component renders our game of life to the DOM using a canvas element and allows users to toggle cells by clicking a cell or dragging
the mouse across multiple cells. If a cell is touched more than once during a drag it is only toggled one time.
**/

import React from 'react';

import COLORS from '../utils/colors';


class View extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			cellSize: 20,

			container: null,

			//used to track cells selected by mouse events
			selectedCells: new Set(),													//selected cells held here in format 'r:c'
			mouseDownMouseUp: [false, false]
		};
	}


	componentDidMount() {
		this.setState({
			container: document.getElementById('life-canvas').getContext('2d')
		});
	}


	componentWillReceiveProps(nextProps) {
		this.setState({
			selectedCells: new Set(),
			mouseDownMouseUp: [false, false]
		});
	}																																				


	componentDidUpdate() {
		this.drawCellBoard();
	}


	drawCellBoard() {
		let ctx = this.state.container;

		ctx.fillStyle = COLORS.cellBorder;
		ctx.fillRect(0, 0, this.state.cellSize * this.props.columns, this.state.cellSize * this.props.rows);


		for (let i = 0; i < this.props.rows; i++) {
			for (let j = 0; j < this.props.columns; j++) {
				this.drawCell(i, j, !!this.props.cells[i][j]);
			}
		}

		//now that the borders and cells are drawn, render glow if glow is enabled
		if (this.props.glowing) {
			
			for (let i = 0; i < this.props.rows; i++) {
				for (let j = 0; j < this.props.columns; j++) {
					
					if (!!this.props.cells[i][j]) {
						this.renderGlow(i, j);
					}
				}
			}
		}
	}


	/**
	We use this to toggle cells in the canvas when we are in the middle of a drag selection so we don't have to wait
	for the selection to end to display the changes. Does not remove glow.
	**/
	toggleCell(r,c) {
		this.drawCell(r, c, !this.props.cells[r][c])
		
		if (this.props.glowing && !this.props.cells[r][c]) {
			this.renderGlow(r, c);
		}
	}


	drawCell(r, c, alive) {
		let ctx = this.state.container;

		ctx.fillStyle = alive ? COLORS.liveCell : COLORS.deadCell;

		//the +/- 1 modification preserves the borders between cells
		ctx.fillRect(c * this.state.cellSize + 1, r * this.state.cellSize + 1, this.state.cellSize - 1, this.state.cellSize - 1);
	}


	renderGlow(r, c) {
		let ctx = this.state.container;

		//center of current cell
		let x = (c + .5) * this.state.cellSize, y = (r + .5) * this.state.cellSize;
		
		let gradient = ctx.createRadialGradient(x, y, 120, x, y, 0);						
																																						 
		gradient.addColorStop(0, COLORS.gradientStart);									
		gradient.addColorStop(1, COLORS.gradientStop);
		
		ctx.fillStyle = gradient;

		ctx.fillRect(x - 120, y - 120, x + 120, y + 120);					
	}


	startSelection(e) {
		if (!this.props.animated) {
			this.state.mouseDownMouseUp[0] = true;
			
			//e.nativeEvent.offsetX / offsetY are the mouse coordinates relative to the canvas element
			let r = Math.floor(e.nativeEvent.offsetY / this.state.cellSize);
			let c = Math.floor(e.nativeEvent.offsetX / this.state.cellSize);

			this.toggleCell(r, c);																																																																
			
			this.state.selectedCells.add(r + ':' + c);																		
		}
	}


	inSelection(e) {
	  if (this.state.mouseDownMouseUp[0] && !this.state.mouseDownMouseUp[1]) {

			let r = Math.floor(e.nativeEvent.offsetY / this.state.cellSize);
			let c = Math.floor(e.nativeEvent.offsetX / this.state.cellSize);
	  	
	  	let validCell = 0 <= r && r <= this.props.rows - 1
								  		&& 0 <= c && c <= this.props.columns - 1
								  		&& !this.state.selectedCells.has(r+':'+c);

	  	if (validCell) {
	  		this.toggleCell(r, c);
	    	this.state.selectedCells.add(r + ':' + c);	
	    }
	  }
	}


	finishedSelection(e) {
    if (this.state.mouseDownMouseUp[0]) {
    	this.props.toggleCells(this.state.selectedCells);
    }
	}


	render() {
		return (
			<canvas
				id='life-canvas'
				height={this.state.cellSize * this.props.cells.length}
				width={this.state.cellSize * this.props.cells[0].length}
				onMouseDown={this.startSelection.bind(this)} 
				onMouseMove={this.inSelection.bind(this)} 
				onMouseUp={this.finishedSelection.bind(this)} 
				onMouseLeave={this.finishedSelection.bind(this)}>
			</canvas>
		);
	}
}


export default View;

