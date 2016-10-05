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
		result = 'The result is a tie!';
	} else if (choice1 === "rock"){
		if (choice2 === "scissors"){
			result = 'Rock wins!'
		} else {
			result = 'Paper wins!'
		}
	} else if (choice1 === "paper"){
		if (choice2 === "rock"){
			result = 'Paper wins!'
		} else {
			result = 'Scissors win!'
		}
	} else if (choice1 === "scissors"){
		if (choice2 === "paper"){
			result = 'Scissors win!'
		} else { 
			result = 'Paper wins!'
		}
	}
	return result;
}






const server = http.createServer((req, res) => {

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  const userChoice = url.parse(req.url, true).query.choice;
 
  	if(userChoice != undefined){	 	
	 	var computerChoice = generateComputerChoice();
	 	var result = compare(userChoice, computerChoice);
	 	htmlResult = htmlResult.replace('{{result}}', result);
	 	res.end(htmlResult);
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




