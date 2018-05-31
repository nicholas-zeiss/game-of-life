/**
 *
 *  Helpers for drawing cells
 *
**/


export const COLORS = {
	cellBorder: '#484848',
	deadCell: '#040404',
	gradientStart: 'rgba(67, 211, 0, 0)',
	gradientStop: 'rgba(67, 211, 0, .1)',
	liveCell: '#449e1b'
};


export const addGlow = (ctx, glow, row, col, size) => {
	const cx = (col + .5) * size;
	const cy = (row + .5) * size;

	ctx.drawImage(glow, cx - size * 4, cy - size * 4);
};


export const drawCell = (ctx, alive, row, col, size) => {
	const x = col * size;
	const y = row * size;

	ctx.fillStyle = alive ? COLORS.liveCell : COLORS.deadCell;
	ctx.fillRect(x + 1, y + 1, size - 1, size - 1);			// +/- 1 preserves borders between cells
};


export const drawGlow = (ctx, radius) => {
	const gradient = ctx.createRadialGradient(radius, radius, radius, radius, radius, 0);

	gradient.addColorStop(0, COLORS.gradientStart);
	gradient.addColorStop(1, COLORS.gradientStop);

	ctx.clearRect(0, 0, 2 * radius, 2 * radius);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 2 * radius, 2 * radius);
};

