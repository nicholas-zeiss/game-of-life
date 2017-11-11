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

			//cell the mouse is over
			mouseCell: null,

			selectedCells: new Set()													//selected cells held here in format 'r:c'
		};
	}


	componentDidMount() {
		this.setState({
			container: document.getElementById('life-canvas').getContext('2d')
		});
	}


	componentWillReceiveProps(nextProps) {
		this.setState({
			selectedCells: new Set()
		});
	}																																				


	componentDidUpdate() {
		// let glow = document.getElementById('glow-canvas').getContext('2d');
		// let cellSize = this.props.cellSize;
		
		// let gradient = glow.createRadialGradient(4 * cellSize, 4 * cellSize, 4 * cellSize, 4 * cellSize, 4 * cellSize, 0);																																				 
		// gradient.addColorStop(0, COLORS.gradientStart);									
		// gradient.addColorStop(1, COLORS.gradientStop);
		
		// glow.clearRect(0, 0, 8 * cellSize, 8 * cellSize)
		// glow.fillStyle = gradient;
		// glow.fillRect(0, 0, 8 * cellSize, 8 * cellSize);
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

		//now that the borders and cells are drawn, glow is drawn over them
		for (let i = 0; i < this.props.rows; i++) {
			for (let j = 0; j < this.props.columns; j++) {
				
				if (this.props.cells[i][j]) {
					this.renderGlow(i, j);
				}
			}
		}

		//if the user is placing a preset shape on the board it is drawn as well
		if (this.props.preset && this.state.mouseCell) {
			this.props.preset.forEach(([r, c]) => {

				let row = this.state.mouseCell[0] + r;
				let col = this.state.mouseCell[1] + c;

				if (this.validCell(row, col) && !this.props.cells[row][col]) {
					this.drawCell(row, col, true);
					this.renderGlow(row, this.state.mouseCell[1] + c);
				}
			});
		}
		
	}


	/**
	We use this to toggle cells in the canvas when we are in the middle of a drag selection so we don't have to wait
	for the cells to be toggled in the Life model held by the parent component. Does not remove glow from a newly dead cell.
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
		let x = (c + .5) * this.props.cellSize, y = (r + .5) * this.props.cellSize;

		this.state.container.drawImage(this.props.glow, x - this.props.cellSize * 4, y - this.props.cellSize * 4);
	}


	handleMouse(isClick, e) {
		if (this.props.preset) {
			let row = Math.floor(e.nativeEvent.offsetY / this.props.cellSize);
			let col = Math.floor(e.nativeEvent.offsetX / this.props.cellSize);

			if (isClick) {
				//call this.props.toggleCells on the cells in preset not already alive
				let toToggle = [];

				this.props.preset.forEach(([r, c]) => {
					if (this.validCell(row + r, col + c) && !this.props.cells[row + r][col + c]) {
						toToggle.push(`${row + r}:${col + c}`);
					}
				});

				this.setState({mouseCell: null}, this.props.toggleCells.bind(null, toToggle, true));
			} else {
				this.setState({mouseCell: [row, col]});
			}
		} else {
			this.mouseSelect(isClick, e);
		}
	}


	mouseSelect(isClick, e) {
		const button = e.buttons ? e.buttons : e.nativeEvent.which ? e.nativeEvent.which : 0;

		if (isClick || button == 1) {
			let r = Math.floor(e.nativeEvent.offsetY / this.props.cellSize);
			let c = Math.floor(e.nativeEvent.offsetX / this.props.cellSize);
	  	
	  	let validCell = this.validCell(r, c) && !this.state.selectedCells.has(r+':'+c);

	  	if (validCell) {
	  		this.toggleCell(r, c);
	    	this.state.selectedCells.add(r + ':' + c);	
	    }
		}

		//second case occurs at click or the end of a drag selection
		if (isClick || (button == 0 && this.state.selectedCells.size > 0)) {
			this.props.toggleCells(this.state.selectedCells);
		}
	}


	validCell(r, c) {
		return 0 <= r && r <= this.props.rows - 1 && 0 <= c && c <= this.props.columns - 1;
	}


	render() {
		return (
			<canvas
				id='life-canvas'
				height={this.props.cellSize * this.props.rows}
				width={this.props.cellSize * this.props.columns}
				onClick={this.handleMouse.bind(this, true)}
				onMouseMove={this.handleMouse.bind(this, false)}> 
			</canvas>
		);
	}
}


export default View;

