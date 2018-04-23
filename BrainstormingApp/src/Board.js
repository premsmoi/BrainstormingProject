var board = null;

export default class Board {
	
	static setBoard = (newBoard) => {
		board = newBoard;
	};

	static getBoard = () => board;

}