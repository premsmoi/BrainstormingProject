import React, { Component } from 'react';
import Icon from 'react-icons-kit';
import { cog } from 'react-icons-kit/iconic';
import { Modal, Button, DropdownButton, MenuItem, ButtonToolbar } from 'react-bootstrap';
import './mystyle/bootstrap.scss';
import './mystyle/General.scss';
import './mystyle/Note.css';
import UserList from './UserList';
import NoteBox from './NoteBox';
import ColorPalette from './ColorPalette';
import TagInput from './TagInput';
import TagPicker from './TagPicker';
import Member from './Member';

class NoteView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardName: '',
            username: '',
            boardId: '',
            show: false,
            //            value: "",
            count: 0,
            color: "lightsalmon",
            //            board: [{id: '555', text: "z", x: 0, y: 0, color: "lightsalmon"}, {id: '666', text: "a", x: 1, y: 1, color: "lightblue"}, {id: '777', text: "b", x: 2, y: 2, color: "lightgreen"}]
            //            note: []
            note: {},
            update: false,
            tags: [],
            boardTags: [],
            boardSetting: false,
            invite: false,
            invitedUser: '',
            users: [],
            notes: [],
            noteTag: [],
            members: [],
            setTag: false,
            newNoteType: 'text',
            newImgData: "",
            position: [],
            boardMember: false,
            userSearchResult: []
            //            writer: ""
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
        this.getAllUsers = this.getAllUsers.bind(this);
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
        this.sendExitReq = this.sendExitReq.bind(this);
        this.showMember = this.showMember.bind(this);
        this.closeMember = this.closeMember.bind(this);
        this.searchUser = this.searchUser.bind(this);

        this.ws = new WebSocket('ws://54.169.35.33:8080/');
        var self = this;

        this.ws.onopen = function () {
            var req = {
                code: 'boardGetTags',
                boardId: self.props.match.params.board_id
            };
            var getTags = JSON.stringify(req);
            self.ws.send(getTags);

            var json = JSON.stringify({ from: 'Board', code: 'getNotes', boardId: self.props.match.params.board_id });
            self.ws.send(json);

            var tagClientRequest = {
                from: 'Board',
                code: 'tagBoard',
                username: self.state.username,
                boardId: self.props.match.params.board_id
            };
            var requestString = JSON.stringify(tagClientRequest);
            self.ws.send(requestString);
            console.log('req: ' + requestString);

            var enterBoardRequest = {
                from: 'Board',
                code: 'enterBoard',
                username: self.state.username,
                boardId: self.props.match.params.board_id,
            }
            var requestString = JSON.stringify(enterBoardRequest)
            self.ws.send(requestString)

            var getBoardRequest = {
                from: 'Board',
                code: 'getBoard',
                boardId: self.props.match.params.board_id,
            }
            var requestString = JSON.stringify(getBoardRequest)
            self.ws.send(requestString)
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
                console.log('I got board');
                self.setState({ board: message.body.board, timeRemaining: message.body.board.limitedTime });
            } else if (message.body.code === 'getNotes') {
                //var json = JSON.stringify({ from: 'Board', code: 'getNotes', boardId: self.props.match.params.board_id });
                //self.ws.send(json);
                self.setState({ notes: message.body.notes }, () => {
                    const position = [];
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
                var json = JSON.stringify({ from: 'Board', code: 'getNotes', boardId: self.props.match.params.board_id });
                self.ws.send(json);
            } else if (message.body.code == 'getBoardStartStatus') {
                console.log('I got board start status')
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
            } else if (message.body.code == 'exitBoardTrigger') {
                self.sendExitReq();
            }
        };
    }

    componentWillMount() {
        //console.log(this.props.location);
        const { boardName } = this.props.location.state;
        const { username } = this.props.location.state;
        const boardId = this.props.match.params.board_id;
        this.setState({ boardName: boardName, newBoardName: boardName, username: username, boardId: boardId });
    }

    componentDidMount() {
        //        console.log(this.props.match.params.board_id);
        //        this.getAllUsers();
        //console.log(this.props.location);
    }

    updateBoard() {
        var updateBoardReq = {
            from: 'BoardManager',
            code: 'updateBoard',
            boardId: this.state.board._id,
            updatedObj: {
                boardName: this.state.newBoardName
            }
        };
        var json = JSON.stringify(updateBoardReq);
        this.ws.send(json);
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
            from: 'BoardManager',
            code: 'boardDeleteTag',
            boardId: this.props.match.params.board_id,
            tag: tag
        }
        var json = JSON.stringify(boardDeleteTagReq);
        this.ws.send(json);
    }

    getAllUsers() {
        window.fetch('http://127.0.0.1:3001/user_list', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        })
            .then((response) => {
                console.log(response.body);
            })
    }

    sendExitReq() {
        var exitBoardRequest = {
            from: 'Board',
            code: 'exitBoard',
            username: this.state.username,
            boardId: this.props.match.params.board_id
        };
        var requestString = JSON.stringify(exitBoardRequest);
        console.log('exitBoard');
        this.ws.send(requestString);
    }

    searchUser(e) {
        e.preventDefault();
        var searchReq = {
            from: 'Board',
            code: 'searchUser',
            username: this.state.userSearch,
            boardId: this.state.boardId
        };
        var json = JSON.stringify(searchReq);
        this.ws.send(json);
    }

    setInvitedUser(user) {
        this.setState({ invitedUser: user });
        console.log(this.state.invitedUser);
    }

    closeInvite() {
        this.setState({ invite: false });
    }

    toggleAdd() {
        this.setState({ show: !this.state.show });
    }

    updateNote(note) {
        var updatedObj = {
            from: 'Board',
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
            from: 'BoardManager',
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
            positionXValue = positionXValue + 350;
        });
    }

    groupByColor(e) {
        e.preventDefault();
        console.log("color");

        var self = this;
        var color_list = ["lightsalmon", "lightblue", "lightgreen", "lightyellow", "lightgrey", "white"];
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
            positionXValue = positionXValue + 350;
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
            positionXValue = positionXValue + 350;

            if (positionXValue === 50 + (350 * 4)) {
                positionXValue = 50;
                positionYValue += 300;
            }
        });
    }

    inviteUser() {
        var inviteUserRequest = {
            from: 'Board',
            code: 'inviteUser',
            username: this.state.invitedUser,
            boardId: this.state.boardId,
            boardName: this.state.boardName,
        }
        var requestString = JSON.stringify(inviteUserRequest)
        console.log('Invite User Request')
        this.ws.send(requestString)
        //this.getMembers()
        this.setState({
            invitedUser: '',
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        //        fetch('http://localhost:3001/api/notes', {
        //            method: 'POST',
        //            headers: {
        //                'content-type': 'application/json'
        //            },
        //            body: {"boardId": "5a96ec25eebae3391dd8e726","writer": "punpun", "text": this.state.value, "color": this.state.colors, "x": 15, "y": 15},
        //        }).then(res => res.json())
        //                .catch(error => console.error('Error:', error))
        //                .then(response => console.log('Success:', response));

        //        this.setState(prevState => ({
        //                show: !prevState.show,
        //                note: {boardId:"5a96ec25eebae3391cc8e726",writer:"punpun",text:this.state.value,color:this.state.color,x:0,y:0},
        //                update: true
        //            }));



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
                    value: ""
                })
            }
        );

    }
    render() {
        return (
            <div>
                <script type="text/javascript" src="//d1l4stvdmqmdzl.cloudfront.net/3.9.6/mongoose.js">
                </script>
                <div className="flex flex-inline header">
                    <h1>{this.state.boardName}</h1>
                    <Icon icon={cog} onClick={this.showSetting} className='setting-button lrmargin' />

                    <div className="flex flex-inline flex-right">
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
                <div className="menu">
                    <Button className="menu-member" onClick={this.toggleAdd}>Add</Button>
                </div>

                <Modal show={this.state.boardSetting} onHide={this.closeSetting}>
                    <Modal.Header closeButton>
                        <Modal.Title>Board Setting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="block">
                            Board name:
                                <input name="newBoardName" value={this.state.newBoardName} className="text-box" type="text" onChange={this.handleChange} />
                                <Button onClick={this.updateBoard}>
                                Save
                                </Button>
                        </label>
                        <TagInput tags={this.state.tags} setTag={(tags) => this.setTag(tags)} boardAddTag={this.boardAddTag} boardDeleteTag={this.boardDeleteTag} />
                        <label className="block">
                            Time:
                                <input name="timeRemaining" value={this.state.timeRemaining} className="text-box" type="text" onChange={this.handleChange} />
                        </label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeSetting}>Save</Button>
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

                <NoteBox notes={this.state.notes} linkid={this.props.match.params.board_id} setColor={this.setColor} note={this.state.note} update={this.state.update} ws={this.ws} tags={this.state.tags} user={this.state.username} />
                <div>
                    <div className="input-idea" style={{ display: (this.state.show ? "block" : "none") }}>
                        <label className="block">
                            Your Idea:
                                <textarea name="value" className="text-box new-idea" value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <ColorPalette setColor={this.setColor} />
                        <TagPicker tags={this.state.tags} setNoteTag={this.setNoteTag} />
                        <button onClick={this.handleSubmit}>submit</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default NoteView;