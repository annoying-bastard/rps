const http = require('http');
const url = require('url');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const gameLogic = require('./gamelogic.js');
const startSession = require('./sessions.js')
const port = 3000;
const hostname = 'localhost';
const savedGameMode = '';
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(startSession());
app.engine('handlebars', exphbs({defaultLayout: 'mainenEN'}));
app.set('view engine', 'handlebars');

var Game = function(gameMode, result, session, gameCap) {
	this.playerWins = 0;
	this.computerWins = 0;
	this.gameMode = gameMode;
	this.gameCap = gameCap;
	this.session = session;
}

Game.prototype.getGameEnd = function (gameCap, computerWins, playerWins){
 if (computerWins === gameCap) {
   return computerVictory;
 }else if (playerWins === gameCap){
   return playerVictory;
 }
}

Game.prototype.newGame = function (gameMode){
 this.gameMode = gameMode;
 if (gameMode = 'bestoffive') {
   this.gameCap = 5;
 } else if (gameMode = 'bestofthree') {
   this.gameCap = 3;
 }
}

Game.prototype.winCounter = function (result){
 if (result === 0){
   this.computerWins++;
 } else if (result === 1) {
   this.playerWins++;
 }
}

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
	const userName = req.session.userName;
	if (!lang){
		res.render('language');
	} else if (userName === '') {
		res.render('username');
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
	} else if (gameMode != undefined){
		var game = new Game(gameMode, result, req.session.id, 0);

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

app.post("/", (req, res) => {
	req.session.userName = req.body.user.name;
	res.render('success', {userName: req.session.userName})
})


app.all('*', (req, res) => {
	res.status(404).send('piss off');
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
