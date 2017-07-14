/** 
initializes the react app and renders it to the DOM
**/

import GameOfLife from './components/GameOfLife';
import React from 'react';
import { render } from 'react-dom';

render(<GameOfLife/>, document.getElementById('root'));