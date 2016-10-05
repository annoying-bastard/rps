const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;


function choiceChecker(userChoice, res){
	//console.log(userChoice);
	switch(userChoice){
		case "rock":
			break;
		case "paper":
			break;
		case "scissors":
			break;
		default:
			res.end('<a href="/?choice=rock">rock</a><br /><a href="/?choice=paper">paper</a><br /><a href="/?choice=scissors">scissors</a>');
	}
}

//choiceChecker(userChoice);

var generateComputerChoice = function(){
	var random = Math.random();
	//console.log(random);
	if (random <= 0.33) {
		return "rock";
	} else if(random <= 0.66){
		return "paper";
	} else {
		return "scissors";
	}
}

var compare = function(choice1, choice2, res){
	if(choice1 === choice2){
		res.end("The result is a tie! <br /> <a href='/'>play again</a>");
	} else if (choice1 === "rock"){
		if (choice2 === "scissors"){
			res.end("Rock wins! <br /> <a href='/'>play again</a>");
		} else {
			res.end("paper wins! <br /> <a href='/'>play again</a>");
		}
	} else if (choice1 === "paper"){
		if (choice2 === "rock"){
			res.end("Paper wins! <br /> <a href='/'>play again</a>");
		} else {
			res.end("Scissors win! <br /> <a href='/'>play again</a>");
		}
	} else if (choice1 === "scissors"){
		if (choice2 === "paper"){
			res.end("Scissors win! <br /> <a href='/'>play again</a>");
		} else { 
			res.end("Rock wins! <br /> <a href='/'>play again</a>");
		}
	}

}



//compare(userChoice, computerChoice);


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  const userChoice = url.parse(req.url, true).query.choice;
  
  choiceChecker(userChoice, res);
  //console.log(computerChoice);
  var computerChoice = generateComputerChoice();
  //console.log(computerChoice);
  compare(userChoice, computerChoice, res);
 
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

process.on('error', function(err){
		console.log(err);
});




