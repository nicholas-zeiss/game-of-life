/**
 *
 *	Wraps View component and handles user mouse input.
 *
**/


import PropTypes from 'prop-types';
import React from 'react';


const MouseInput = (View) => {
	class WrappedView extends React.Component {
		static propTypes = {
			life: PropTypes.object.isRequired,
			preset: PropTypes.array,
			toggleCells: PropTypes.func.isRequired
		};


		constructor(props) {
			super(props);

			this.boardHeight = props.life.height;
			this.boardWidth = props.life.width;

			this.state = {
				animating: false,
				cells: null,
				modifiedCells: null,
				mouseCell: null,
				mouseDown: false,
				presetCells: null
			};
		}


		componentDidMount() {
			this.props.life.animating.subscribe(animating => this.setState({ animating }));
			this.props.life.board.subscribe(cells => this.setState({ cells }));
		}


		validCell(row, col) {
			return row >= 0 && row < this.boardHeight && col >= 0 && col < this.boardHeight;
		}


		mouseHandler = (event, cellSize) => {
			if (this.state.animating) {
				return;
			}

			const row = Math.floor(event.nativeEvent.offsetY / cellSize);
			const col = Math.floor(event.nativeEvent.offsetX / cellSize);

			const valid = this.validCell(row, col);

			if (event.type === 'mouseenter') {
				const down = event.nativeEvent.buttons === 1;
				this.setState({ mouseDown: down });
			} else if (event.type === 'click' && valid) {
				this.handleClick(row, col);
			} else if (event.type === 'mousedown') {
				this.setState({ mouseDown: true });
			} else if (event.type === 'mouseup' || event.type === 'mouseleave') {
				this.handleUp(event.type);
			} else if (event.type === 'mousemove' && valid) {
				this.handleMove(row, col);
			}
		}


		handleClick = (row, col) => {
			if (this.props.preset) {
				const toToggle = [];

				this.props.preset.forEach(([r, c]) => {
					r += row;
					c += col;

					if (this.validCell(r, c) && !this.state.cells[r][c]) {
						toToggle.push(r + ':' + c);
					}
				});

				this.props.toggleCells(toToggle, true);
			} else {
				this.props.toggleCells([ row + ':' + col ]);
			}
		}


		handleUp = (type) => {
			// const update = { mouseDown: false };

			// if (this.state.selectedCells.size) {
			// 	update.selectedCells = new Set();
			// 	const cellsCopy = new Set(this.state.selectedCells);
			// 	this.props.toggleCells(cellsCopy, false);
			// }

			// type === 'mouseleave' ? update.mouseCell = null : null;

			// this.setState(update);
		}


		handleMove = (row, col) => {
			// const locStr = row + ':' + col;

			// if (this.props.preset) {
			// 	this.setState({ mouseCell: { row, col } });
			// } else if (this.state.mouseDown && !this.state.selectedCells.has(locStr)) {
			// 	this.toggleCell(row, col);
			// 	this.state.selectedCells.add(locStr);
			// }
		}


		getAdjustedPreset() {
			return null;
		}


		render() {
			return (
				<View
					{ ...this.props }
					cells={ this.state.cells }
					modifiedCells={ this.state.modifiedCells }
					mouseHandler={ this.mouseHandler }
					presetCells={ this.getAdjustedPreset() }
				/>
			);
		}
	}

	return WrappedView;
};


export default MouseInput;

