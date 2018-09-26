/**
 *
 *	A simple pure component for rendering a preset cell structure to a canvas element without the glow effect. On click the preset
 *	is selected via callback.
 *
**/

import PropTypes from 'prop-types';
import React from 'react';

import { COLORS, drawCell } from '../utils/cells';


const cellSize = 10;


class Preset extends React.PureComponent {
	static propTypes = {
		cells: PropTypes.array.isRequired,
		height: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		select: PropTypes.func.isRequired,
		width: PropTypes.number.isRequired
	}

	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
	}


	componentDidMount() {
		const ctx = this.canvasRef.current.getContext('2d');

		this.props.cells.forEach(([r, c]) => (
			drawCell(ctx, COLORS.liveCell, r, c, cellSize)
		));
	}


	selectCells = () => this.props.select(this.props.cells);


	render() {
		return (
			<React.Fragment>
				<p style={{ marginLeft: '10px' }}>{ this.props.name }</p>
				<canvas
					ref={ this.canvasRef }
					height={ cellSize *	this.props.height }
					style={{ cursor: 'pointer' }}
					width={ cellSize *this.props.width }
					onClick={ this.selectCells }
				/>
			</React.Fragment>
		);
	}
}


export default Preset;

