'use strict';
var express = require('express');

module.exports = function(app) {
	var boardList = require('../controllers/BoardController');
	
	app.get('/all_boards', boardList.list_all_boards);
	app.post('/create_board', boardList.create_a_board);
	app.post('/board_update_name', boardList.updateName);
	app.post('/get_board_list', boardList.getBoardList);
	app.post('/delete_board', boardList.deleteBoard)

}