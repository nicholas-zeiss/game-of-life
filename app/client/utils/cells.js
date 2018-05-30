/**
 *
 *  Helpers for drawing cells
 *
**/

import colors from './colors';


export const addGlow = (ctx, glow, row, col, size) => {
	const cx = (col + .5) * size;
	const cy = (row + .5) * size;

	ctx.drawImage(glow, cx - size * 4, cy - size * 4);
};


export const drawCell = (ctx, alive, row, col, size) => {
	const x = col * size;
	const y = row * size;

	ctx.fillStyle = alive ? colors.liveCell : colors.deadCell;
	ctx.fillRect(x + 1, y + 1, size - 1, size - 1);			// +/- 1 preserves borders between cells
};


export const drawGlow = (ctx, radius, start, stop) => {
	const gradient = ctx.createRadialGradient(radius, radius, radius, radius, radius, 0);

	gradient.addColorStop(0, start);
	gradient.addColorStop(1, stop);

	ctx.clearRect(0, 0, 2 * radius, 2 * radius);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 2 * radius, 2 * radius);
};

