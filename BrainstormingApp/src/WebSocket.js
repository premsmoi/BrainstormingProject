import {
  ip
} from './Configuration';

var ws = null;

export default class WebScoket{

	static startWebSocket(){
		if(ws == null){
			ws = new WebSocket('ws://' + ip, 'echo-protocol');
		}
	}

	static getWebSocket(){
		return ws;
	}
}