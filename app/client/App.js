/**
 * 
 *	Initializes the react app and renders it to the DOM
 *
**/

import React from 'react';
import { render } from 'react-dom';

import GameOfLife from './components/GameOfLife';


render(<GameOfLife/>, document.getElementById('root'));

