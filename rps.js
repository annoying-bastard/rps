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
app.engine('handlebars', exphbs({defaultLayout: 'mainenEN'}));
app.set('view engine', 'handlebars');
console.log(exphbs);






// console.log(gameLogic);


var userInterface = {
	getUserChoice: function(queryResult) {

		if (queryResult === 'rock' ||
	 	 		queryResult === 'paper'||
	 			queryResult === 'scissors') {

	 		return queryResult;

	 	}
	},

	getLanguage: function(queryResult, req, res) {
		var lang = req.cookies.lang;
		if (lang != undefined) {
			exphbs.defaultLayout = 'main' + lang;
			return lang;
		}
		if (queryResult === 'deSWG' || queryResult === 'enEN') {
			exphbs.defaultLayout = 'main' + queryResult;
			res.cookie('lang', queryResult);
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
	const lang = userInterface.getLanguage(queryResult, req, res);
	const gameMode = userInterface.getGameMode(queryResult, req, res);
	const userChoice = userInterface.getUserChoice(queryResult);
	console.log(req.cookies.lang, lang);

	if (!lang){
		res.render('language');
	} else if(userChoice != undefined){
	 	const computerChoice = gameLogic.generateComputerChoice();
	 	var result = gameLogic.compare(computerChoice, userChoice);
	 	var text = gameLogic.resultTextGenerator(result, computerChoice, userChoice);
		var streakText = gameLogic.streakTextGenerator(result, req.session);

		if (lang === 'enEN') {
			res.render('result', {result: text, streak: streakText});
		} else if (lang === 'deSWG', {layout: 'maindeSWG'}) {
			res.render('resultSWG', {result: text, streak: streakText});
		}
	}else if (gameMode != undefined){
		if (lang === 'enEN') {
			res.render('choice');
		} else if (lang === 'deSWG') {
			res.render('choiceSWG', {layout: 'maindeSWG'});
		}
	} else if (gameMode === undefined) {
		if (lang === 'enEN') {
			res.render('gamemode');
		} else if (lang === 'deSWG') {
			res.render('gamemodeSWG', {layout: 'maindeSWG'});
		}

	}

});


app.all('*', (req, res) => {
	res.status(404).send('piss off');
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
