module.exports = startSession;
const uuid = require('uuid');
const sessions = {};

function Session(id){
	this.id = id;
	this.playerStreak = 0;
	this.computerStreak = 0;
	this.userName = '';
}

function createSession(req, res) {
	const id = uuid.v1();
	res.cookie('id', id);
	const session = new Session(id);
	sessions[id] = session;
	req.session = session;
}

function startSession(options){
  return function sessionMiddleware(req, res, next)  {
  	if (!req.cookies.id) {
  		createSession(req, res);
  	} else {
  		const session = sessions[req.cookies.id];
  		if (session) {
  			req.session = session;
  		} else {
  			createSession(req, res);
  		}
  	}
    	next();
    }
  }
