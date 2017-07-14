/**
This component renders our game of life to the DOM using a canvas element and allows users to toggle cells by clicking on them or holding down
the mouse and dragging the mouse across the cells they wish to switch (n.b. if during a drag the user moves across the same cell more than once, only one toggle is registered)

props.cells is the actual board we must render, props.animated is whether or not our gameOfLife is ticking and thus should not allow cells to be toggled,
state is helpers/accesory information explained in getInitialState
**/

import React from 'react';

const LifeView = React.createClass({
	getInitialState() {
		return {
			width: 20,									//width/height of each cell, magic numbers because responsive design is hard
			height: 20,
			container: null,						//initially empty reference for the 2d canvas context
			mousePositions: new Set(),	//holds the cells that the mouse touches (in the form 'row:col') while the user selects cells, once selection is done the gameOfLife model and this component update
			downUp: [false, false]			//represents that mousedown has occurred, mouseup has occurred respectively to track where a user is in their selection of cells
		};
	},

	componentDidMount() {
		this.setState({container: document.getElementById('life-canvas').getContext('2d')});			//component is rendered to DOM initially so we can now track our canvas context
	},

	componentWillReceiveProps() {
		this.setState({mousePositions: new Set(), downUp: [false, false]});			//this component will re-render, we must reset mousePositions and downUp so that they are primed for a new selection of cells
	},																																				

	componentDidUpdate() {			//we have received a new board, we must render it
		this.draw();
	},

	draw() {																	//this is where our board becomes represented graphically
		let ctx = this.state.container;

		ctx.fillStyle = '#3a3a3a';																																												//magic number for a medium grey which is used as the border between cells
		ctx.fillRect(0, 0, this.state.width * this.props.cells[0].length, this.state.height * this.props.cells.length);		//set background color which ends up being the borders between cells

		for (let i = 0; i < this.props.cells.length; i++) {													//for each cell in the board
			for (let j = 0; j < this.props.cells[0].length; j++) {
				this.drawCell(i, j, !!this.props.cells[i][j])
			}
		}

		//now that the borders and cells are rendered, we can render a fancy glowing effect on top of them
		//here we take every live cell and layer a transparent green tint on top of their surroundings
		if (this.props.glowing) {
			for (let i = 0; i < this.props.cells.length; i++) {														//for each cell in board
				for (let j = 0; j < this.props.cells[0].length; j++) {
					if (this.props.cells[i][j]) {  																						//if cell is live
						this.renderGlow(i, j);		
					}
				}
			}
		}
	},

	//before the actual gameOfLife model is updated during a selection, we render the toggles directly to our canvas for ux
	//this will turn a green cell to black and vice versa, but it will not disable the glow the green tile already created around it
	toggleCell(r,c) {
		this.drawCell(r, c, !this.props.cells[r][c])
		
		if (this.props.glowing && !this.props.cells[r][c]) {
			this.renderGlow(r, c);
		}
	},

	drawCell(r, c, alive) {
		let ctx = this.state.container;
		ctx.fillStyle = alive ? 'rgb(67,211,0)' : 'black';			//green if alive, black if dead
		ctx.fillRect(c * this.state.width + 1, r * this.state.height + 1, this.state.width - 2, this.state.height - 2);		//the final 2 arguments are decremented to allow for borders between cells
	},

	renderGlow(r, c) {
		let ctx = this.state.container;
		let x = (c + .5) * this.state.width, y = (r + .5) * this.state.height;	//(x,y) is the center of the current cell
		let gradient = ctx.createRadialGradient(x, y, 120, x, y, 0);						
																																						 
		gradient.addColorStop(0, 'rgba(67,211,0,0)');									
		gradient.addColorStop(1, 'rgba(67,211,0,.05)');
		
		ctx.fillStyle = gradient;
		ctx.fillRect(x - 120, y - 120, x + 120, y + 120);							//draw the transparent lighting onto the rendered board					
	},

	//this event listener is activated when mousedown occurs on the canvas, if board is not being animated it adds the cell it selected to those to be changed
	//and allows inSelection and finishedSelection to be evaluated when their events occur
	startSelection(e) {
		if (!this.props.animated) {
			this.state.downUp[0] = true;		//mousedown is true as it just happened
			
			this.toggleCell(Math.floor(e.nativeEvent.offsetY / this.state.height), Math.floor(e.nativeEvent.offsetX / this.state.width));		//before this cell is toggled in the actual game model
																																																																			//we draw it on canvas for ux
			
			this.state.mousePositions.add(Math.floor(e.nativeEvent.offsetY / this.state.height) + ':'																				 //adds 'row:col' to the set where we hold cells to be toggled
																	  + Math.floor(e.nativeEvent.offsetX / this.state.width));																				
		}
	},

	inSelection(e) {
	  if (this.state.downUp[0] && !this.state.downUp[1]) {																					//we only care where the mouse is if mousedown happened and (mouseup or mouseleave) hasn't

	  	let str = Math.floor(e.nativeEvent.offsetY / this.state.height) + ':' + Math.floor(e.nativeEvent.offsetX / this.state.width);
	  	
	  	if (!this.state.mousePositions.has(str)) {
	  		this.toggleCell(Math.floor(e.nativeEvent.offsetY / this.state.height),				//if 'row:col' is a new addition to the cells to be toggled we render it for ux before it is actually toggled
	  									  Math.floor(e.nativeEvent.offsetX / this.state.width));
	    }

	    this.state.mousePositions.add(Math.floor(e.nativeEvent.offsetY / this.state.height) + ':'			//add 'row:col' to the collection of cells to be toggled
	                                  + Math.floor(e.nativeEvent.offsetX / this.state.width));	
	  }
	},

	finishedSelection(e) {																			//either the mousebutton was raised and our selection is done, or the mouse has left the canvas
    if (this.state.downUp[0]) {																//if the mouse was down before that this is a valid selection of cells to toggle
    	this.props.toggleCells(this.state.mousePositions);			//here the actual gameOfLife model toggles the selected cells, updates cascade downards from GameOfLife
    }
	},


	render() {
		return (
			<canvas id='life-canvas'
			height={this.state.height * this.props.cells.length}
			width={this.state.width * this.props.cells[0].length}
			onMouseDown={this.startSelection} onMouseMove={this.inSelection} onMouseUp={this.finishedSelection} onMouseLeave={this.finishedSelection}></canvas>
		);
	}
});

export default LifeView;