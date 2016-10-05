const http = require('http');
const url = require('url');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

var html = fs.readFileSync('./index.html', 'utf8');
var htmlResult = fs.readFileSync('./result.html', 'utf8');





var generateComputerChoice = function(){
	var random = Math.random();

	if (random <= 0.33) {
		return "rock";
	} else if(random <= 0.66){
		return "paper";
	} else {
		return "scissors";
	}
}


var compare = function(choice1, choice2){
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
}

var computerStreak = 0;
var playerStreak = 0;


var resultTextGenerator = function(result, computerChoice, userChoice){
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

}
var streakTextGenerator = function(playerStreak, computerStreak){
	var streakText = '';
	 	if (playerStreak > 1) {
	 		streakText = 'You have a streak of ' + playerStreak +' wins!'
	 	} else if (computerStreak > 1){
	 		streakText = 'You\'re being dominated by the comput0rs streak of ' + computerStreak + ' wins!'
	 	}
	 return streakText;
}



const server = http.createServer((req, res) => {

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  const userChoice = url.parse(req.url, true).query.choice;
 
  	if(userChoice != undefined){	 	
	 	const computerChoice = generateComputerChoice();
	 	var result = compare(userChoice, computerChoice);
	 	var text = resultTextGenerator(result, computerChoice, userChoice);
 		var streakText = streakTextGenerator(playerStreak, computerStreak);
	 	var finalHtmlResult = htmlResult
	 		.replace('{{result}}', text)
	 		.replace('{{streak}}', streakText);

	 	res.end(finalHtmlResult);
	}else{
		res.end(html);
	}

 
 
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

process.on('error', function(err){
		console.log(err);
});




