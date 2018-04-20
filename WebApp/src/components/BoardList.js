import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './mystyle/Board.css';
import axios from 'axios';

class BoardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boards: [],
            username: ''
        };
        this.fetchBoard = this.fetchBoard.bind(this);
        this.accessBoard = this.accessBoard.bind(this);
    }

    fetchBoard() {
        //        axios.get('http://localhost:3001/api/boards')
        //                .then(res => {
        //                    this.setState({boards: res.data});
        //                });

        //fetch('http://localhost:3001/all_boards', {
        //    method: 'GET',
        //    headers: {
        //        'Content-Type': 'application/json'
        //    }
        //}).then(res => res.json()).then((result) => {
        //this.setState({ boards: result });
        //console.log(result);
        //});

        //var self = this;
        //fetch('http://localhost:3001/get_board_list', {
        //    method: 'POST',
        //    headers: {
        //        'Content-Type': 'application/json'
        //    },
        //    body: JSON.stringify({idList: self.props.board})
        //}).then(res => { res.json(); console.log(res); }).then((result) => {
        //    //this.setState({ boards: result });
        //    console.log(result);
        //});
    }

    accessBoard(e, name, id) {
        console.log(this.props);
        const location = {
            pathname: '/view/' + id,
            state: { boardName: name, boardId: id }
        };
        //        this.props.history.push(location);
    }

    componentWillMount() {
        console.log(this.props.boards);
        this.setState({ boards: this.props.boards });
    }

    componentDidMount() {
        //this.fetchBoard();
    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps.boards);
        if (nextProps !== this.props) {
            this.setState({ boards: nextProps.boards, username: nextProps.username });
        }
    }

    //{this.state.boards.map((obj) => <Link to={"/view/"+obj._id.toString()} key={obj._id} id={obj._id.toString()} className="idea-box">{obj.boardName}</Link>)}
    //
    render() {
        return (
            <div className="container">
                {this.state.boards.map((obj) =>
                    <Link to={{ pathname: "/view/" + obj._id.toString(), state: {boardName: obj.boardName, username: this.state.username} }} key={obj._id} id={obj._id.toString()} className="board-box" onClick={(e) => this.accessBoard(e, obj.boardName, obj._id.toString())}>
                        <div>{obj.boardName}</div>
                        <button className='flex-right' onClick={(e) => { this.props.deleteBoard(e, obj._id) }}>delete</button>
                    </Link>)}
            </div>
        );
    }
}

export default BoardList;