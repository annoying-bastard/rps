module.exports = {

  playerStreak: 0,
  computerStreak: 0,

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

  compare: function(computerChoice, userChoice){
    var result = null;
    if(computerChoice === userChoice){
      result = 2;
    } else if (computerChoice === "rock"){
      if (userChoice === "scissors"){
        result = 0;
      } else {
        result = 1;
      }
    } else if (computerChoice === "paper"){
      if (userChoice === "rock"){
        result = 0;
      } else {
        result = 1;
      }
    } else if (computerChoice === "scissors"){
      if (userChoice === "paper"){
        result = 0;
      } else {
        result = 1;
      }
    }
    return result;
  },

  resultTextGenerator: function(result, computerChoice, userChoice){
  	var text = '';
  	if (result === 0){
  	 		text = 'Computer wins with their ' + computerChoice + ' against your ' +userChoice + '!';
  	 	} else if(result === 1){
  	 		text = 'You reck the computer with your epic ' + userChoice + ' against their puny ' + computerChoice + '!' ;
  	 	} else {
  	 		text = 'It\'s a tie! Game is hard...';
  	 	}
  	 return text;
   },

  streakTextGenerator: function(result, session){
     if (result === 0){
       session.computerStreak++;
       session.playerStreak = 0;
       console.log('computer wins');
     } else if (result === 1) {
       session.computerStreak = 0;
       session.playerStreak++;
       console.log('player wins');
     } else {
       session.computerStreak = 0;
       session.playerStreak = 0;
       console.log('tie');
     }
     	console.log(session.playerStreak, session.computerStreak);
   	 	if (session.playerStreak > 1) {
   	 		return 'You have a streak of ' + session.playerStreak +' wins!'
   	 	} else if (session.computerStreak > 1){
   	 		return 'You\'re being dominated by the comput0rs streak of ' + session.computerStreak + ' wins!'
   	 	}
   },

   createGame: function(gameMode, result, session){
     new Game (gameMode, result,session);
   },
}
