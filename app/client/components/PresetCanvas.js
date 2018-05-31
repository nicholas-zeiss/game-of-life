

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
		this.props.cells.forEach(([r, c]) => drawCell(ctx, COLORS.liveCell, r, c, cellSize));
	}


	selectCells = () => this.props.select(this.props.cells);


	render() {
		return (
			<React.Fragment>
				<p style={{ marginLeft: '10px' }}>{ this.props.name }</p>
				<canvas
					ref={ this.canvasRef }
					height={ cellSize *	this.props.height }
					onClick={ this.selectCells }
					style={{ cursor: 'pointer' }}
					width={ cellSize *this.props.width }
				/>
			</React.Fragment>
		);
	}
}


export default Preset;

