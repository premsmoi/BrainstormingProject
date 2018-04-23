var username = null;
var boardList = null;

export default class User {
	
	static createUser = (newUser) => {
		username = newUser.username
		boardList = newUser.boards
	};

	static getUsername = () => username;

	static getBoardList = () => {
		return boardList;
	};

	static setBoardList = (newBoardList) => {
		boardList = newBoardList
	};



}