import React, { Component } from 'react';
import BoardList from './BoardList';
import Notification from './Notification';
import './mystyle/Home.scss';
import './mystyle/General.scss';
import { Button, Modal } from 'react-bootstrap';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            username: "",
            board: [],
            boards: [],
            createModal: false,
            notifications: [],
            unreadNotification: 0
        }
        //        this.show = this.show.bind(this);
        this.createBoard = this.createBoard.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.openCreateModal = this.openCreateModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.deleteBoard = this.deleteBoard.bind(this);
        this.getBoardList = this.getBoardList.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getNotification = this.getNotification.bind(this);
        this.countUnreadNotification = this.countUnreadNotification.bind(this);
        this.acceptInvite = this.acceptInvite.bind(this);
        this.readNotification = this.readNotification.bind(this);
        this.setUnreadNotification = this.setUnreadNotification.bind(this);
        this.logout = this.logout.bind(this);

        this.ws = new WebSocket('ws://54.169.35.33:8080/');
        var self = this;
        this.ws.onopen = function () {
            var req = {
                from: 'Home',
                code: 'tagUser',
                username: self.props.location.state.username
            };
            var json = JSON.stringify(req);
            self.ws.send(json);

            self.getUser();
            self.getNotification();
        }

        this.ws.onmessage = function (res) {
            var message = JSON.parse(res.data);
            if (message.body.code === 'getUser') {
                self.setState({ name: message.body.user.name, board: message.body.user.boards, email: message.body.user.email, currentBoard: message.body.user.currentBoard }, () => {
                    self.getBoardList();
                });
            } else if (message.body.code === 'getBoardList') {
                self.setState({ boards: message.body.boards }, () => {
                    console.log(self.state.boards);
                });
            } else if (message.body.code === 'getBoardListTrigger') {
                var board_id_list = [];
                self.state.board.map(function (board) {
                    board_id_list.push(board.boardId)
                });
                const boardReq = {
                    from: 'Home',
                    code: 'getBoardList',
                    board_id_list: board_id_list
                };
                const boardReqJSON = JSON.stringify(boardReq);
                self.ws.send(boardReqJSON);
            } else if (message.body.code === 'getNotification') {
                self.setState({ notifications: message.body.notifications }, () => {
                    self.setState({
                        unreadNotification: self.countUnreadNotification()
                    });
                });
                console.log(self.countUnreadNotification());
            } else if (message.body.code == 'getNotificationTrigger') {
                console.log('I got notification trigger')
                self.getNotification()
            }
        }
    }

    componentWillMount() {
        //        var req = {
        //                from: 'Home',
        //                code: 'tagUser',
        //                username: 'this.props.location.state.user'
        //            }
        //            var json = JSON.stringify(req);
        //            this.ws.send(json);
        this.setState({ username: this.props.location.state.username });
    }

    componentDidMount() {
        //console.log(this.props.location.state.username);
        //this.setState({ username: this.props.location.state.username });
    }

    openCreateModal() {
        this.setState({ createModal: true });
    }

    closeCreateModal() {
        this.setState({ createModal: false });
    }

    handleChange(e) {
        e.preventDefault();
        const value = e.target.value;
        const name = e.target.name;
        this.setState({ [name]: value })
    }

    deleteBoard(e, id) {
        e.preventDefault();
        console.log(id);
        var deleteReq = {
            from: 'Home',
            code: 'deleteBoard',
            boardId: id
        };
        var deleteReqJSON = JSON.stringify(deleteReq);
        this.ws.send(deleteReqJSON);
    }

    getUser() {
        var userReq = {
            from: 'Home',
            code: 'getUser',
            username: this.state.username
        };
        const userReqJSON = JSON.stringify(userReq);
        this.ws.send(userReqJSON);
    }

    getNotification() {
        var notiReq = {
            from: 'Home',
            code: 'getNotification',
            username: this.state.username
        };
        const notiReqJSON = JSON.stringify(notiReq);
        this.ws.send(notiReqJSON);
    }

    getBoardList() {
        var board_id_list = [];
        this.state.board.map(function (board) {
            board_id_list.push(board.boardId)
        });
        const boardReq = {
            from: 'Home',
            code: 'getBoardList',
            board_id_list: board_id_list
        };
        const boardReqJSON = JSON.stringify(boardReq);
        this.ws.send(boardReqJSON);
    }

    countUnreadNotification() {
        var count = 0
        console.log(this.state.notifications)
        this.state.notifications.map(function (notification) {
            if (!notification.read) {
                count++
            }
        })
        console.log('count: ' + count)
        return count
    }

    acceptInvite(notification) {
        var acceptInviteRequest = {
            from: 'Home',
            code: 'acceptInvite',
            username: this.state.username,
            boardId: notification.boardId,
            boardName: notification.boardName,
        }
        var requestString = JSON.stringify(acceptInviteRequest)
        //console.log('props: '+this.props)
        this.ws.send(requestString)
    }

    readNotification(notification) {
        var readNotificationRequest = {
            from: 'Home',
            code: 'readNotification',
            id: notification._id,
            username: this.state.username,
        }
        var requestString = JSON.stringify(readNotificationRequest)
        //console.log('props: '+this.props)
        this.ws.send(requestString)
    }

    setUnreadNotification(a) {
        this.setState({ unreadNotification: a });
    }

    createBoard(e) {
        e.preventDefault();
        var self = this;
        window.fetch('http://54.169.35.33:8080/create_board', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ creator: self.state.username, boardName: self.state.boardNameInput }),
            credentials: "same-origin"
        }).then((res) => res.json()).then((text) => {
            console.log(text);
            if (text.status === 1) {
                window.fetch('http://54.169.35.33:8080/user_add_board', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: self.state.username, newBoardId: text.newBoardId })
                }).then(res => res.json()).then((result) => {
                    //console.log(result);
                    self.getUser();
                    self.closeCreateModal();
                    self.setState({ boardNameInput: '' });
                });
            }
        });
    }

    logout() {
        fetch('http://54.169.35.33:8080/logout')
            .then((response) => {
                this.props.navigation.navigate('Login')
                //console.log(response);
                return response.json()
            })
            .catch((error) => {
                throw error;
            });
        this.ws.close()
    }

    render() {
        return (
            <div>
                <div className="flex flex-inline header">
                    <h1>Hello {this.state.username}</h1>
                    <Notification notifications={this.state.notifications} unreadNotification={this.state.unreadNotification} readNotification={this.readNotification} setUnreadNotification={this.setUnreadNotification} getNotification={this.getNotification} acceptInvite={this.acceptInvite} ws={this.ws} />
                </div>
                <div className="flex flex-inline sub-header">
                    <h4>My Board</h4>
                    <Button bsSize='small' bsStyle='primary' className='lrmargin' onClick={this.openCreateModal}>create board</Button>
                </div>
                <BoardList boards={this.state.boards} deleteBoard={this.deleteBoard} username={this.state.username} />
                <Modal show={this.state.createModal} onHide={this.closeCreateModal}>
                    <Modal.Header>Create Board</Modal.Header>
                    <Modal.Body>
                        <label>
                            Board name:
                            <input name='boardNameInput' type='text' className='text-box' onChange={this.handleChange} value={this.state.boardNameInput} />
                        </label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.createBoard} > Create</Button>
                        <Button onClick={this.closeCreateModal} > Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default Home;