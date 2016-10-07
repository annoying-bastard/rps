const http = require('http');
const url = require('url');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');

const port = 3000;
const hostname = '127.0.0.1';
const savedGameMode = '';
const app = express();

app.use((req, res, next) => {
	next();
})

app.use(cookieParser());

var getGameMode = function(queryResult, req, res) {
	if (req.cookies.gamemode === 'bestoffive' || req.cookies.gamemode === 'bestofthree') {
		return req.cookies.gamemode;
	} else if (queryResult === 'bestoffive' || queryResult === 'bestofthree'){
		res.cookie('gamemode', queryResult);
		return queryResult;
	}
}

var htmlChoice = fs.readFileSync('./index.html', 'utf8');
var htmlResult = fs.readFileSync('./result.html', 'utf8');
var htmlGameMode = fs.readFileSync('./gamemodechanger.html', 'utf8');


var computerStreak = 0;
var playerStreak = 0;


var gameLogic = {

compare: function(choice1, choice2){
	var result = null;
	if(choice1 === choice2){
		result = 2;
	} else if (choice1 === "rock"){
		if (choice2 === "scissors"){
			result = 0;
		} else {
			result = 1;
		}
	} else if (choice1 === "paper"){
		if (choice2 === "rock"){
			result = 0;
		} else {
			result = 1;
		}
	} else if (choice1 === "scissors"){
		if (choice2 === "paper"){
			result = 0;
		} else {
			result = 1;
		}
	}
	return result;
},

generateComputerChoice: function(){
	var random = Math.random();
	if (random <= 0.33) {
		return "rock";
	} else if(random <= 0.66){
		return "paper";
	} else {
		return "scissors";
	}
},

resultTextGenerator: function(result, computerChoice, userChoice){
	var text = '';
	if (result === 1){
	 		text = 'Computer wins with their ' + computerChoice + ' against your ' +userChoice + '!';
	 		computerStreak++;
	 		playerStreak = 0;
	 	} else if(result === 0){
	 		text = 'You reck the computer with your epic ' + userChoice + ' against their puny ' + computerChoice + '!' ;
	 		computerStreak = 0;
	 		playerStreak++;
	 	} else {
	 		text = 'It\'s a tie! Game is hard...';
	 		computerStreak = 0;
	 		playerStreak = 0;
	 	}
	 return text;
 },

 streakTextGenerator: function(playerStreak, computerStreak){

 	var streakText = '';
 	 	if (playerStreak > 1) {
 	 		streakText = 'You have a streak of ' + playerStreak +' wins!'
 	 	} else if (computerStreak > 1){
 	 		streakText = 'You\'re being dominated by the comput0rs streak of ' + computerStreak + ' wins!'
 	 	}

 	 return streakText;
 }

}





var getUserChoice = function(queryResult) {

	if (queryResult === 'rock' ||
 	 		queryResult === 'paper'||
 			queryResult === 'scissors') {

 		return queryResult;

 	}

}
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.get('/', (req, res) => {

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

	const queryResult = req.query.choice;
	const gameMode = getGameMode(queryResult, req, res);
	console.log(gameMode);
	const userChoice = getUserChoice(queryResult);
	console.log(app.on);


  if(userChoice != undefined){
	 	const computerChoice = gameLogic.generateComputerChoice();
	 	var result = gameLogic.compare(userChoice, computerChoice);
	 	var text = gameLogic.resultTextGenerator(result, computerChoice, userChoice);
 		var streakText = gameLogic.streakTextGenerator(playerStreak, computerStreak);
	 	var finalHtmlResult = htmlResult
	 		.replace('{{result}}', text)
	 		.replace('{{streak}}', streakText);

	 	res.end(finalHtmlResult);

	}else if (gameMode != undefined){

		res.end(htmlChoice);
		userChoice = url.parse(req.url, true).query.choice;

	} else if (gameMode === undefined) {
		res.end(htmlGameMode);

	}

});


app.all('*', (req, res) => {
	res.status(404).send('piss off');
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
