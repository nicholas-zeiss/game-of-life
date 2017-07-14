const express = require('express');
const path = require('path');
const app = express();

//simply renders our index.html
//as the app is rendered client side and has no backend we simply send up the static index file
app.use(express.static(path.join(__dirname, '../../app')));

app.get('/', (req, res) => {
	res.render('index.html');
});

const port = 6050;

app.listen(port, () => console.log('Listening on port ', port));