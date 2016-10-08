const http = require('http');
const url = require('url');
const express = require('express');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const gameLogic = require('./gamelogic.js');
const startSession = require('./sessions.js')
const port = 3000;
const hostname = 'localhost';
const savedGameMode = '';
const app = express();
app.use(cookieParser());
app.use(startSession());
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');







// console.log(gameLogic);


var userInterface = {
	getUserChoice: function(queryResult) {

		if (queryResult === 'rock' ||
	 	 		queryResult === 'paper'||
	 			queryResult === 'scissors') {

	 		return queryResult;

	 	}
	},

	getGameMode: function(queryResult, req, res) {
		if (req.cookies.gamemode === 'bestoffive' || req.cookies.gamemode === 'bestofthree') {
			return req.cookies.gamemode;
		} else if (queryResult === 'bestoffive' || queryResult === 'bestofthree'){
			res.cookie('gamemode', queryResult);
			return queryResult;
		}
	}
}


app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.get('/', (req, res) => {

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

	const queryResult = req.query.choice;
	const gameMode = userInterface.getGameMode(queryResult, req, res);
	const userChoice = userInterface.getUserChoice(queryResult);
	console.log(req.session);

  if(userChoice != undefined){
	 	const computerChoice = gameLogic.generateComputerChoice();
	 	var result = gameLogic.compare(computerChoice, userChoice);
	 	var text = gameLogic.resultTextGenerator(result, computerChoice, userChoice);

		var streakText = gameLogic.streakTextGenerator(result, req.session);
	 	res.render('result', {result: text, streak: streakText});

	}else if (gameMode != undefined){

		res.render('choice');
		userChoice = url.parse(req.url, true).query.choice;

	} else if (gameMode === undefined) {
		res.render('gamemode');

	}

});


app.all('*', (req, res) => {
	res.status(404).send('piss off');
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
