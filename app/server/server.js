/**
As this app has no back end we simply serve up our html, js, and css
**/

const express = require('express');
const path = require('path');
const app = express();


app.use(express.static(path.join(__dirname, '../../app')));

app.get('/', (req, res) => {
	res.render('index.html');
});


const port = process.env.PORT || 4050;

app.listen(port, () => console.log('Listening on port ', port));

