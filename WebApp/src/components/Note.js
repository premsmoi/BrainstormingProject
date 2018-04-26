import React, { Component } from 'react';
import Icon from 'react-icons-kit';
import { cog } from 'react-icons-kit/iconic';
import { Modal, Button, DropdownButton, MenuItem, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import './mystyle/General.scss';
import './mystyle/Note.css';
import UserList from './UserList';
import NoteBox from './NoteBox';
import ColorPalette from './ColorPalette';
import TagInput from './TagInput';
import TagPicker from './TagPicker';
import Member from './Member';
import HeadNav from './HeadNav';
import { setInterval } from 'timers';

const ip = 'localhost:3001';
//const ip = '54.169.35.33:8080';

class NoteView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardName: '',
            username: '',
            boardId: '',
            show: false,
            color: "red",
            note: {},
            update: false,
            tags: [],
            boardSetting: false,
            invite: false,
            invitedUser: '',
            notes: [],
            noteTag: [],
            members: [],
            setTag: false,
            newNoteType: 'text',
            newImgData: "",
            position: [],
            boardMember: false,
            userSearchResult: [],
            userVotedNotes: [],
            notifications: [],
            unreadNotification: 0,
            name: '',
            timeRemaining: 0,
            board: {},
            start: false
        };
        this.toggleAdd = this.toggleAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getNote = this.getNote.bind(this);
        this.setColor = this.setColor.bind(this);
        this.showSetting = this.showSetting.bind(this);
        this.closeSetting = this.closeSetting.bind(this);
        this.showInvite = this.showInvite.bind(this);
        this.inviteUser = this.inviteUser.bind(this);
        this.closeInvite = this.closeInvite.bind(this);
        this.setInvitedUser = this.setInvitedUser.bind(this);
        this.updateBoard = this.updateBoard.bind(this);
        this.boardAddTag = this.boardAddTag.bind(this);
        this.boardGetTags = this.boardGetTags.bind(this);
        this.boardDeleteTag = this.boardDeleteTag.bind(this);
        this.setNoteTag = this.setNoteTag.bind(this);
        this.setTag = this.setTag.bind(this);
        this.groupByTag = this.groupByTag.bind(this);
        this.groupByColor = this.groupByColor.bind(this);
        this.spreadNote = this.spreadNote.bind(this);
        this.updateNote = this.updateNote.bind(this);
        this.showMember = this.showMember.bind(this);
        this.closeMember = this.closeMember.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.voteNote = this.voteNote.bind(this);
        this.unvoteNote = this.unvoteNote.bind(this);
        this.logout = this.logout.bind(this);
        this.goHome = this.goHome.bind(this);
        this.startTiming = this.startTiming.bind(this);
        this.goUserPage = this.goUserPage.bind(this);
        this.readNotification = this.readNotification.bind(this);
        this.setUnreadNotification = this.setUnreadNotification.bind(this);
        this.countUnreadNotification = this.countUnreadNotification.bind(this);
        this.acceptInvite = this.acceptInvite.bind(this);
        this.getNotification = this.getNotification.bind(this);
        this.getTimeRemaining = this.getTimeRemaining.bind(this);

        this.ws = new WebSocket('ws://' + ip + '/');
        var self = this;

        this.ws.onopen = function () {
            var req = {
                code: 'boardGetTags',
                boardId: self.props.match.params.board_id
            };
            var getTags = JSON.stringify(req);
            self.ws.send(getTags);

            var json = JSON.stringify({ code: 'getNotes', boardId: self.props.match.params.board_id });
            self.ws.send(json);

            var tagClientRequest = {
                code: 'tagBoard',
                username: self.state.username,
                boardId: self.props.match.params.board_id
            };
            var requestString = JSON.stringify(tagClientRequest);
            self.ws.send(requestString);
            console.log('req: ' + requestString);

            var enterBoardRequest = {
                code: 'enterBoard',
                username: self.state.username,
                boardId: self.props.match.params.board_id,
            }
            var requestString = JSON.stringify(enterBoardRequest)
            self.ws.send(requestString)

            var getBoardRequest = {
                code: 'getBoard',
                boardId: self.props.match.params.board_id,
            }
            var requestString = JSON.stringify(getBoardRequest)
            self.ws.send(requestString)

            var getUserVotedNoteRequest = {
                code: 'getUserVotedNotes',
                username: self.state.username,
                boardId: self.props.match.params.board_id,
            }
            var requestString = JSON.stringify(getUserVotedNoteRequest)
            self.ws.send(requestString)

            self.getNotification();
            self.getTimeRemaining();

            setInterval(this.getTimeRemaining, 300000);
        };

        this.ws.onmessage = function (event) {
            var message = JSON.parse(event.data);
            if (message.body.code === 'getTags') {
                self.setState({ tags: message.body.tags }, () => {
                    //                    console.log(self.state.notes);
                });
            } else if (message.body.code === 'updatedNotes') {
                self.setState({ notes: message.body.notes }, () => {
                    //                    console.log(self.state.notes);
                });
            } else if (message.body.code == 'getBoard') {
                console.log(message.body.board);
                self.setState({ board: message.body.board, boardName: message.body.board.boardName, newBoardName: message.body.board.boardName });
                if (message.body.board.start === true) {
                    setInterval(self.getTimeRemaining, 1000);
                    self.setState({ start: true });
                }
            } else if (message.body.code === 'getNotes') {
                //var json = JSON.stringify({ from: 'Board', code: 'getNotes', boardId: self.props.match.params.board_id });
                //self.ws.send(json);
                self.setState({ notes: message.body.notes }, () => {
                    const position = [];
                    console.log(message.body.notes);
                    self.state.notes.map((note) => {
                        position.push(0);
                    });
                    self.setState({ position: position });
                });
            } else if (message.body.code === 'getTags') {
                self.setState({ tags: message.body.tags });
            } else if (message.body.code == 'getMembers') {
                self.setState({
                    members: message.body.members
                })
                console.log(message.body.members);
            } else if (message.body.code == 'getNotesTrigger') {
                var json = JSON.stringify({ code: 'getNotes', boardId: self.props.match.params.board_id });
                self.ws.send(json);
            } else if (message.body.code == 'getBoardStartStatus') {
                console.log('I got board start status')
                console.log(message.body.status);
                self.setState({
                    startedBoard: message.body.status
                });
            } else if (message.body.code == 'getTimer') {
                console.log('I got timer')
                self.setState({
                    timeRemaining: message.body.timeRemaining
                })
            } else if (message.body.code == 'getUserSearchResult') {
                self.setState({ userSearchResult: message.body.userList })
                console.log(message.body.userList)
            } else if (message.body.code == 'getVotedNotes') {
                self.setState({ userVotedNotes: message.body.votedNotes });
                console.log(message.body.votedNotes);
            } else if (message.body.code === 'getNotification') {
                self.setState({ notifications: message.body.notifications }, () => {
                    self.setState({
                        unreadNotification: self.countUnreadNotification()
                    });
                });
                console.log(self.countUnreadNotification());
            } else if (message.body.code === 'getNotificationTrigger') {
                console.log('I got notification trigger')
                self.getNotification()
            } else if (message.body.code === 'getTimeRemaining') {
                console.log(message.body.timeRemaining);
                self.setState({ timeRemaining: message.body.timeRemaining });
            }
        };
    }

    componentWillMount() {
        const boardName = '' || this.props.location.state.boardName;
        const username = localStorage.getItem("username") || this.props.location.state.username;
        const name = localStorage.getItem("name") || this.props.location.state.name;
        const boardId = this.props.match.params.board_id;
        this.setState({ boardName: boardName, newBoardName: boardName, username: username, boardId: boardId, name: name });
    }

    logout() {
        this.ws.close();
        window.fetch('http://' + ip + '/logout')
            .then((response) => {
                const location = {
                    pathname: '/login'
                };
                this.props.history.push(location);
                //console.log(response);
                return response.json()
            })
            .catch((error) => {
                throw error;
            });
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("name");
    }

    goHome() {
        this.ws.close();
        const location = {
            pathname: '/home',
            state: { username: this.state.username, name: this.state.name }
        };
        this.props.history.push(location);
    }

    goUserPage() {
        this.ws.close();
        const location = {
            pathname: '/profile',
            state: { username: this.state.username, name: this.state.name }
        };
        this.props.history.push(location);
    }

    updateBoard() {
        var updateBoardReq = {
            code: 'updateBoard',
            boardId: this.state.board._id,
            updatedObj: {
                boardName: this.state.newBoardName
            }
        };
        var json = JSON.stringify(updateBoardReq);
        this.ws.send(json);
        this.setState({ boardName: this.state.newBoardName });
    }

    getNotification() {
        var notiReq = {
            code: 'getNotification',
            username: this.state.username
        };
        const notiReqJSON = JSON.stringify(notiReq);
        this.ws.send(notiReqJSON);
    }

    countUnreadNotification() {
        var count = 0;
        console.log(this.state.notifications);
        this.state.notifications.map(function (notification) {
            if (!notification.read) {
                count++;
            }
        });
        console.log('count: ' + count);
        return count;
    }

    acceptInvite(notification) {
        var acceptInviteRequest = {
            code: 'acceptInvite',
            username: this.state.username,
            boardId: notification.boardId,
            boardName: notification.boardName,
        };
        var requestString = JSON.stringify(acceptInviteRequest);
        this.ws.send(requestString);
    }

    readNotification(notification) {
        var readNotificationRequest = {
            code: 'readNotification',
            id: notification._id,
            username: this.state.username,
        };
        var requestString = JSON.stringify(readNotificationRequest);
        this.ws.send(requestString);
    }

    setUnreadNotification(a) {
        this.setState({ unreadNotification: a });
    }

    showSetting() {
        this.setState({ boardSetting: true });
    }

    closeSetting() {
        this.setState({ boardSetting: false });
    }

    showInvite() {
        this.setState({ invite: true });
    }

    showMember() {
        this.setState({ boardMember: true });
    }

    closeMember() {
        this.setState({ boardMember: false });
    }

    boardGetTags() {
        var boardGetTagsReq = {
            code: 'boardGetTags',
            boardId: this.props.match.params.board_id
        };
        var json = JSON.stringify(boardGetTagsReq);
        this.ws.send(json);
    }

    boardDeleteTag(tag) {
        var boardDeleteTagReq = {
            code: 'boardDeleteTag',
            boardId: this.props.match.params.board_id,
            tag: tag
        }
        var json = JSON.stringify(boardDeleteTagReq);
        this.ws.send(json);
    }

    searchUser(e) {
        e.preventDefault();
        var searchReq = {
            code: 'searchUser',
            username: this.state.userSearch,
            boardId: this.state.boardId
        };
        var json = JSON.stringify(searchReq);
        this.ws.send(json);
    }

    voteNote(a) {
        var voteNoteReq = {
            code: 'voteNote',
            username: this.state.username,
            boardId: this.state.boardId,
            votedNoteId: a
        };
        var json = JSON.stringify(voteNoteReq);
        this.ws.send(json);
    }

    unvoteNote(a) {
        var unvoteNoteReq = {
            code: 'unvoteNote',
            username: this.state.username,
            boardId: this.state.boardId,
            unvotedNoteId: a
        };
        var json = JSON.stringify(unvoteNoteReq);
        this.ws.send(json);
    }

    startTiming(e) {
        e.preventDefault();
        if (this.state.start === false) {
            var startBoard = {
                code: 'updateBoard',
                boardId: this.state.boardId,
                updatedObj: {
                    start: true,
                    limitedTime: this.state.timeRemaining,
                    timeRemaining: this.state.timeRemaining
                }
            }
            var json = JSON.stringify(startBoard);
            this.ws.send(json);
            this.setState({ start: true });

            setInterval(this.getTimeRemaining, 1000);
        } else {
            var stopBoard = {
                code: 'updateBoard',
                boardId: this.state.boardId,
                updatedObj: {
                    start: false,
                    limitedTime: this.state.timeRemaining,
                    timeRemaining: this.state.timeRemaining
                }
            }
            var json = JSON.stringify(stopBoard);
            this.ws.send(json);

            this.setState({ start: false });
        }
    }

    getTimeRemaining() {
        var self = this;
        var getTimeRemaining = {
            code: 'getTimeRemaining',
            boardId: self.state.boardId
        }
        var json = JSON.stringify(getTimeRemaining);
        this.ws.send(json);

        if (this.state.start === true) {
            if (this.state.timeRemaining === 0) {
                this.setState({ start: false });
            }
        }
    }

    setInvitedUser(user) {
        this.setState({ invitedUser: user });
        console.log(this.state.invitedUser);
    }

    closeInvite() {
        this.setState({ invite: false, userSearch: '' });
    }

    toggleAdd() {
        this.setState({ show: !this.state.show });
    }

    updateNote(note) {
        var updatedObj = {
            code: 'updateNote',
            updatedObj: {
                id: note._id.toString(),
                x: note.x,
                y: note.y,
                updated: new Date().getTime(),
            },
            //            tags: this.state.newNoteTags,
            updated: new Date().getTime(),
        }
        var requestString = JSON.stringify(updatedObj);
        this.ws.send(requestString);
    }

    boardAddTag(tag) {
        var boardAddTagReq = {
            code: 'boardAddTag',
            boardId: this.props.match.params.board_id,
            tag: tag
        };
        var json = JSON.stringify(boardAddTagReq);
        this.ws.send(json);
    }

    handleChange(event) {
        //        this.setState({value: event.target.value});
        //                this.setState({writer:)

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    getNote() {
        return this.state.note;
    }
    setColor(a) {
        this.setState({ color: a });
        //        this.state.color = a;
    }
    setTag(a) {
        this.setState({ tags: a });
        console.log(this.state.tags);
    }

    setNoteTag(a) {
        this.setState({ noteTag: a });
        console.log(this.state.noteTag);
    }

    groupByTag(e) {
        e.preventDefault();
        console.log("tag");

        var self = this;
        var newNoteList = this.state.notes;
        var position = this.state.position;
        var positionXValue = 50;
        var positionYValue = 50;
        var count = 0;

        this.state.tags.map((tag, i) => {
            this.state.notes.map((note, index) => {
                if (note.tags.indexOf(tag) > -1 && position[index] === 0) {
                    console.log(tag);
                    position[index] = 1;

                    newNoteList[index].x = positionXValue;
                    newNoteList[index].y = positionYValue;

                    self.updateNote(newNoteList[index]);

                    positionYValue = positionYValue + 50;
                }
            });
            //self.setState({ notes: newNoteList });
            positionYValue = 50;
            positionXValue = positionXValue + 200;
        });
    }

    groupByColor(e) {
        e.preventDefault();
        console.log("color");

        var self = this;
        var color_list = ["red", "pink", "green", "blue", "yellow"];
        var newNoteList = this.state.notes;
        var positionXValue = 50;
        var positionYValue = 50;

        var count = 0;

        color_list.map((color, i) => {
            this.state.notes.map((note, index) => {
                if (note.color === color) {
                    newNoteList[index].x = positionXValue;
                    newNoteList[index].y = positionYValue;

                    self.updateNote(newNoteList[index]);

                    positionYValue = positionYValue + 50;
                }
            });
            //self.setState({ notes: newNoteList });
            positionYValue = 50;
            positionXValue = positionXValue + 200;
        });
    }

    spreadNote(e) {
        e.preventDefault();
        console.log("spread");

        var self = this;
        var newNoteList = this.state.notes;
        var positionXValue = 50;
        var positionYValue = 50;
        this.state.notes.map((note, index) => {
            newNoteList[index].x = positionXValue;
            newNoteList[index].y = positionYValue;

            self.updateNote(newNoteList[index]);
            positionXValue = positionXValue + 200;

            if (positionXValue === 50 + (200 * 4)) {
                positionXValue = 50;
                positionYValue += 150;
            }
        });
    }

    inviteUser() {
        var inviteUserRequest = {
            code: 'inviteUser',
            username: this.state.invitedUser,
            boardId: this.state.boardId,
            boardName: this.state.boardName,
        }
        var requestString = JSON.stringify(inviteUserRequest)
        console.log('Invite User Request')
        this.ws.send(requestString)
        this.setState({
            invitedUser: ''
        })
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState(prevState => ({
            show: !prevState.show,
            note: {
                boardId: this.props.match.params.board_id, writer: this.state.username, text: this.state.value, color: this.state.color, x: 100, y: 200, noteType: this.state.newNoteType, img: {
                    data: this.state.newImgData,
                    contentType: 'img/jpg'
                }, tags: this.state.noteTag, updated: new Date().getTime()
            },
            update: true
        })
            , () => {
                // if you need the updated state value, use this.state in this callback
                // note: make sure you use arrow function to maintain "this" context
                this.setState({
                    update: false,
                    value: "",
                    noteTag: [],
                    color: '#FFF'
                })
            }
        );

    }
    render() {
        return (
            <div>
                <HeadNav goHome={this.goHome} goUserPage={this.goUserPage} logout={this.logout} notifications={this.state.notifications} unreadNotification={this.state.unreadNotification} readNotification={this.readNotification} setUnreadNotification={this.setUnreadNotification} getNotification={this.getNotification} acceptInvite={this.acceptInvite} ws={this.ws} />
                <div className="flex flex-inline header">
                    <h1>{this.state.boardName}</h1>
                    <Icon icon={cog} onClick={this.showSetting} className='setting-button lrmargin' />

                    <div className="flex flex-inline flex-right">
                        <label style={{ marginBottom: '0', display: (this.state.board.facilitator === this.state.username) ? '' : 'none' }}>
                            Time remaining:
                        <input className='text-box time' name='timeRemaining' value={this.state.timeRemaining} style={{ marginBottom: '0' }} type='text' onChange={this.handleChange} disabled={this.state.start}></input>
                            <Button bsStyle={this.state.start === true ? "warning" : "info"} className="lrmargin" bsSize="small" onClick={this.startTiming} style={{ display: (this.state.board.facilitator === this.state.username) ? 'inline-block' : 'none' }}>
                                {this.state.start === true ? "Stop" : "Start"}
                            </Button>
                        </label>

                        <label style={{ marginBottom: '0', display: (this.state.board.facilitator === this.state.username) ? 'none' : '' }}>
                            Time remaining:
                        <input className='text-box time' name='timeRemaining' value={this.state.timeRemaining} style={{ marginBottom: '0' }} type='text' onChange={this.handleChange} disabled></input>
                        </label>

                        <ButtonToolbar className="lrmargin" >
                            <DropdownButton bsSize="small" title="Filter" pullRight id="dropdown-size-small" >
                                <MenuItem eventKey="1" onClick={this.groupByTag} >Grouping by tag</MenuItem>
                                <MenuItem eventKey="2" onClick={this.groupByColor} >Grouping by color</MenuItem>
                                <MenuItem eventKey="3" onClick={this.spreadNote} >Spread note</MenuItem>
                            </DropdownButton>
                        </ButtonToolbar>

                        <Button className="lrmargin" bsSize="small" onClick={this.showMember}>
                            Member
                        </Button>

                        <Button className="lrmargin" bsStyle="primary" bsSize="small" onClick={this.showInvite}>
                            Invite
                        </Button>
                    </div>
                </div>
                <Glyphicon className='create-button' onClick={this.toggleAdd} glyph="plus-sign" />

                <Modal show={this.state.boardSetting} onHide={this.closeSetting}>
                    <Modal.Header closeButton>
                        <Modal.Title>Board Setting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="block">
                            Board name:
                                <input name="newBoardName" value={this.state.newBoardName} className="text-box" type="text" onChange={this.handleChange} style={{ width: '70%' }} />
                            <Button bsStyle='primary' onClick={this.updateBoard}>
                                Save
                                </Button>
                        </label>
                        <TagInput tags={this.state.tags} setTag={(tags) => this.setTag(tags)} boardAddTag={this.boardAddTag} boardDeleteTag={this.boardDeleteTag} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeSetting}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.invite} onHide={this.closeInvite}>
                    <Modal.Header closeButton>
                        <Modal.Title>Invite</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="medium">
                        <label className="block">
                            Search:
                                <input name="userSearch" value={this.state.userSearch} className="text-box" type="text" onChange={this.handleChange} />
                            <Button className="lrmargin" bsSize="small" onClick={this.searchUser}>
                                Search
                                </Button>
                        </label>
                        <UserList setInvitedUser={this.setInvitedUser} inviteUser={this.inviteUser} userSearchResult={this.state.userSearchResult} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeInvite}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.boardMember} onHide={this.closeMember}>
                    <Modal.Header closeButton>
                        <Modal.Title>Member</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.members.map((member) => {
                            return (
                                <div key={member.username} className="list relative">{member.name}<span className={member.currentBoard === this.state.boardId ? "green-text" : "red-text"} style={{ float: 'right' }}>{member.currentBoard === this.state.boardId ? "online" : "offline"}</span></div>
                            );
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeMember}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <NoteBox notes={this.state.notes} linkid={this.props.match.params.board_id} setColor={this.setColor} note={this.state.note} update={this.state.update} ws={this.ws} tags={this.state.tags} user={this.state.username} userVotedNotes={this.state.userVotedNotes} voteNote={this.voteNote} unvoteNote={this.unvoteNote} />
                <Modal show={this.state.show} onHide={this.toggleAdd}>
                    <Modal.Header closeButton>
                        Create Note
                    </Modal.Header>
                    <Modal.Body>
                        <label className="block">
                            Your Idea:
                                <textarea name="value" className={"text-box new-idea " + this.state.color} value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <ColorPalette setColor={this.setColor} />
                        <TagPicker tags={this.state.tags} setNoteTag={this.setNoteTag} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleSubmit} bsStyle='success'>Create</Button>
                        <Button onClick={this.toggleAdd}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default NoteView;