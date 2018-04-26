import {
  ip
} from './Configuration';

var appUser = null
var appBoard = null
var appWebSocket = null

export default class App{

	static setAppUser(user){
		appUser = user;
		console.log('set app user: '+JSON.stringify(user));
	}

	static getAppUser(){
		return appUser;
	}

	static setAppBoard(board){
		appBoard = board;
	}

	static getAppBoard(){
		return appBoard;
	}

	static startAppWebSocket(){
	    appWebSocket = new WebSocket('ws://' + ip, 'echo-protocol');

	    appWebSocket.onerror = (e) => {
		     // an error occurred
		     console.log(e.message);
	    };

	    setInterval(() => {
	    	var pingRequest = {
		        from: 'App'
		      }
      var requestString = JSON.stringify(pingRequest)
	    	appWebSocket.send(requestString)
	    }, 10000)

	}

	static getAppWebSocket(){
		return appWebSocket;
	}

}


