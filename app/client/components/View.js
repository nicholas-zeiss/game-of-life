/**
This component renders our game of life to the DOM using a canvas element and allows users to toggle cells by clicking a cell or dragging
the mouse across multiple cells. If a cell is touched more than once during a drag it is only toggled one time.
**/


//TODO separate canvases stacked on top of each other for border/dead pixel background, live pixels, glow


import React from 'react';

import COLORS from '../utils/colors';


class View extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
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
		ctx.fillRect(0, 0, this.props.cellSize * this.props.columns, this.props.cellSize * this.props.rows);


		for (let i = 0; i < this.props.rows; i++) {
			for (let j = 0; j < this.props.columns; j++) {
				this.drawCell(i, j, this.props.cells[i][j]);
			}
		}

		//now that the borders and dead cells are drawn, glow is drawn over them
		for (let i = 0; i < this.props.rows; i++) {
			for (let j = 0; j < this.props.columns; j++) {
				
				if (this.props.cells[i][j]) {
					this.renderGlow(i, j);
				}
			}
		}
		
	}


	/**
	We use this to toggle cells in the canvas when we are in the middle of a drag selection so we don't have to wait
	for the selection to end to display the changes. Does not remove glow from a newly dead cell.
	**/
	toggleCell(r,c) {
		this.drawCell(r, c, !this.props.cells[r][c])
		
		if (!this.props.cells[r][c]) {
			this.renderGlow(r, c);
		}
	}


	drawCell(r, c, alive) {
		let ctx = this.state.container;

		ctx.fillStyle = alive ? COLORS.liveCell : COLORS.deadCell;

		//the +/- 1 modification preserves the borders between cells
		ctx.fillRect(c * this.props.cellSize + 1, r * this.props.cellSize + 1, this.props.cellSize - 1, this.props.cellSize - 1);
	}


	renderGlow(r, c) {
		let glow = document.getElementById('glow-canvas');
		
		let x = (c + .5) * this.props.cellSize, y = (r + .5) * this.props.cellSize;

		this.state.container.drawImage(glow, x - this.props.cellSize * 4, y - this.props.cellSize * 4);
	}


	mouseSelect(isClick, e) {
		if (isClick || e.buttons == 1) {
			let r = Math.floor(e.nativeEvent.offsetY / this.props.cellSize);
			let c = Math.floor(e.nativeEvent.offsetX / this.props.cellSize);
	  	
	  	let validCell = 0 <= r && r <= this.props.rows - 1
								  		&& 0 <= c && c <= this.props.columns - 1
								  		&& !this.state.selectedCells.has(r+':'+c);

	  	if (validCell) {
	  		this.toggleCell(r, c);
	    	this.state.selectedCells.add(r + ':' + c);	
	    }
		}

		//second case occurs at the end of a drag selection
		if (isClick || (e.buttons == 0 && this.state.selectedCells.size > 0)) {
			this.props.toggleCells(this.state.selectedCells);
		}
	}


	render() {
		return (
			<canvas
				id='life-canvas'
				height={this.props.cellSize * this.props.rows}
				width={this.props.cellSize * this.props.columns}
				onClick={this.mouseSelect.bind(this, true)}
				onMouseMove={this.mouseSelect.bind(this, false)}> 
			</canvas>
		);
	}
}


export default View;

