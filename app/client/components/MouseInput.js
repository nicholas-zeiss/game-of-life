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
				modifiedCells: new Set(),
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
				const down = event.nativeEvent.buttons === 1;
				this.setState({
					mouseCell: { row, col },
					mouseDown: down
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
			const update = { mouseDown: false };

			if (this.state.modifiedCells.size) {
				update.modifiedCells = new Set();
				const cellsCopy = new Set(this.state.modifiedCells);
				this.props.toggleCells(cellsCopy, false);
			}

			type === 'mouseleave' ? update.mouseCell = null : null;

			this.setState(update);
		}


		handleMove = (row, col) => {
			const locStr = row + ':' + col;
			const stateLocStr = this.state.mouseCell.row + ':' + this.state.mouseCell.col;

			if (this.props.preset && locStr !== stateLocStr) {
				this.setState({ mouseCell: { row, col } });
			} else if (this.state.mouseDown && !this.state.modifiedCells.has(locStr)) {
				this.state.modifiedCells.add(locStr);
				this.forceUpdate();
			}
		}


		getAdjustedPreset() {
			if (this.state.animating || !this.props.preset || !this.state.mouseCell) {
				return null;
			}

			const presetCells = [];

			this.props.preset.forEach(([ row, col ]) => {
				row += this.state.mouseCell.row;
				col += this.state.mouseCell.col;

				if (this.validCell(row, col)) {
					presetCells.push([row, col]);
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

