/**
 *
 *	Wraps View component, feeding it the state of the game board and the state of any cells modified by user input
 *	or a selected preset. Additionally, it provides mouse event handlers for user input, and handles all the logic
 *	of updating the game's state.
 *
**/


import PropTypes from 'prop-types';
import React from 'react';

import CellSet from '../utils/cellSet';


const MouseInput = (View) => {
	class WrappedView extends React.Component {
		static propTypes = {
			life: PropTypes.object.isRequired,
			preset: PropTypes.object,
			toggleCells: PropTypes.func.isRequired
		};


		constructor(props) {
			super(props);

			this.boardHeight = props.life.height;
			this.boardWidth = props.life.width;

			this.state = {
				animating: false,
				cells: null,
				modifiedCells: new CellSet(),
				mouseCell: null,
				mouseDown: false
			};
		}


		componentDidMount() {
			this.props.life.animating.subscribe(animating => this.setState({ animating }));
			this.props.life.board.subscribe(cells => this.setState({ cells }));
		}


		validCell(row, col) {
			return row >= 0 && row < this.boardHeight && col >= 0 && col < this.boardWidth;
		}


		mouseHandler = (event, cellSize) => {
			if (this.state.animating) {
				return;
			}

			const row = Math.floor(event.nativeEvent.offsetY / cellSize);
			const col = Math.floor(event.nativeEvent.offsetX / cellSize);
			const valid = this.validCell(row, col);

			if (event.type === 'mouseenter') {
				this.setState({
					mouseCell: { row, col },
					mouseDown: event.nativeEvent.buttons === 1
				});

			} else if (event.type === 'click' && valid) {
				this.handleClick(row, col);

			} else if (event.type === 'mousedown') {
				this.setState({ mouseDown: true });

			} else if (event.type === 'mouseup' || event.type === 'mouseleave') {
				this.handleUp(event.type);

			} else if (event.type === 'mousemove' && valid && this.state.mouseCell) {
				this.handleMove(row, col);
			}
		}


		// handles placing of preset or flipping of a single cell
		handleClick(row, col) {
			if (!this.props.preset) {
				this.props.toggleCells(new CellSet([row, col]));
				return;
			}

			const toToggle = new CellSet();

			this.props.preset.forEach(([r, c]) => {
				r += row;
				c += col;

				if (this.validCell(r, c) && !this.state.cells[r][c]) {
					toToggle.add([r, c]);
				}
			});

			this.props.toggleCells(toToggle, true);
		}


		// if there are any cells that have been modified, this mouse up event represents
		// the end of a user drag selection, modified cells must be updated in the model
		handleUp(type) {
			const update = { mouseDown: false };

			if (this.state.modifiedCells.size) {
				update.modifiedCells = new CellSet();
				const cellsCopy = this.state.modifiedCells.copy();
				this.props.toggleCells(cellsCopy, false);
			}

			type === 'mouseleave' ? update.mouseCell = null : null;

			this.setState(update);
		}


		// if preset exists, update mouse position in state to ensure proper rendering of preset
		// if not and user is in a drag, add cell to modifiedCells if not already present
		handleMove(row, col) {
			const cell = [row, col];
			const locStr = cell.join(':');
			const stateLocStr = this.state.mouseCell.row + ':' + this.state.mouseCell.col;

			if (this.props.preset && locStr !== stateLocStr) {
				this.setState({ mouseCell: { row, col } });
			} else if (this.state.mouseDown && !this.state.modifiedCells.hasCell(cell)) {
				this.state.modifiedCells.add(cell);
				this.forceUpdate();
			}
		}


		// creates an array of cell strings representing the current preset being placed at
		// the current mouse position
		getAdjustedPreset() {
			if (this.state.animating || !this.props.preset || !this.state.mouseCell) {
				return null;
			}

			const presetCells = new CellSet();

			this.props.preset.forEach((cell) => {
				cell[0] += this.state.mouseCell.row;
				cell[1] += this.state.mouseCell.col;

				if (this.validCell(...cell)) {
					presetCells.add(cell);
				}
			});

			return presetCells;
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

