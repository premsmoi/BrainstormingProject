import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './mystyle/Board.css';
import axios from 'axios';

class BoardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boards: [],
            username: ''
        };
        this.accessBoard = this.accessBoard.bind(this);
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

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps.boards);
        if (nextProps !== this.props) {
            this.setState({ boards: nextProps.boards, username: nextProps.username, name: nextProps.name });
        }
    }

    //{this.state.boards.map((obj) => <Link to={"/view/"+obj._id.toString()} key={obj._id} id={obj._id.toString()} className="idea-box">{obj.boardName}</Link>)}
    //
    render() {
        return (
            <div className="container">
                {this.state.boards.map((obj) =>
                    <Link to={{ pathname: "/view/" + obj._id.toString(), state: {boardName: obj.boardName, username: this.state.username, name: this.state.name} }} key={obj._id} id={obj._id.toString()} className="board-box" onClick={(e) => this.accessBoard(e, obj.boardName, obj._id.toString())}>
                        <div>{obj.boardName}</div>
                        <Button bsSize='xsmall' className='flex-right' style={{display: obj.facilitator === this.props.username ? "block" : "none"}} onClick={(e) => { this.props.deleteBoard(e, obj._id) }}>delete</Button>
                    </Link>)}
            </div>
        );
    }
}

export default BoardList;