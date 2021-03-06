const express = require('express');
const app = express();
const http = require('http');
const url = require('url');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const gameLogic = require('./gamelogic.js');
const startSession = require('./sessions.js')
const port = 3000;
const savedGameMode = ''
const server = app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const io = require('socket.io')(server);


app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/socket.io', express.static('node_modules/socket.io-client/dist'));
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


app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

	const queryResult = req.query.choice;
	const userName = req.session.userName;
	const lang = userInterface.getLanguage(queryResult, req, res);
	const gameMode = userInterface.getGameMode(queryResult, req, res);
	const userChoice = userInterface.getUserChoice(queryResult);

	if (!lang){
		res.render('language', {userName: req.session.userName});
	} else if (userName === '') {
		res.render('username', {userName: req.session.userName});
	} else if(userChoice != undefined){
	 	const computerChoice = gameLogic.generateComputerChoice();
	 	var result = gameLogic.compare(computerChoice, userChoice);
	 	var text = gameLogic.resultTextGenerator(result, computerChoice, userChoice);
		var streakText = gameLogic.streakTextGenerator(result, req.session);

		if (lang === 'enEN') {
			res.render('result', {result: text, streak: streakText, userName: req.session.userName});
		} else if (lang === 'deSWG', {layout: 'maindeSWG'}) {
			res.render('resultSWG', {result: text, streak: streakText, userName: req.session.userName});
		}
	} else if (gameMode != undefined){
		var game = new Game(gameMode, result, req.session.id, 0);

		if (lang === 'enEN') {
			res.render('choice', {userName: req.session.userName});
		} else if (lang === 'deSWG') {
			res.render('choiceSWG', {layout: 'maindeSWG', userName: req.session.userName});
		}
	} else if (gameMode === undefined) {
		if (lang === 'enEN') {
			res.render('gamemode', {userName: req.session.userName});
		} else if (lang === 'deSWG') {
			res.render('gamemodeSWG', {layout: 'maindeSWG', userName: req.session.userName});
		}
	}
});

io.on('connection', function(socket){
	// console.log(socket);
	// console.log(io.emit('new user'));
});

app.post("/", (req, res) => {
	req.session.userName = req.body.user.name;
	res.render('success', {userName: req.session.userName});
})

app.all('*', (req, res) => {
	res.status(404).send('piss off');
})
