import React, { Component } from 'react';
import HeadNav from './HeadNav';
import { Button, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import './mystyle/UserPage.scss';

//const ip = 'localhost:3001';
const ip = '54.169.35.33:8080';

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            username: '',
            faculty: '',
            major: '',
            password: '',
            email: '',
            notifications: [],
            unreadNotification: 0,
        }

        this.goHome = this.goHome.bind(this);
        this.goUserPage = this.goUserPage.bind(this);
        this.logout = this.logout.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.readNotification = this.readNotification.bind(this);
        this.setUnreadNotification = this.setUnreadNotification.bind(this);
        this.countUnreadNotification = this.countUnreadNotification.bind(this);
        this.acceptInvite = this.acceptInvite.bind(this);
        this.getNotification = this.getNotification.bind(this);

        this.ws = new WebSocket('ws://' + ip + '/');
        var self = this;

        this.ws.onopen = function () {
            var req = {
                code: 'tagUser',
                username: self.props.location.state.username
            };
            var json = JSON.stringify(req);
            self.ws.send(json);

            var userReq = {
                code: 'getUser',
                username: self.state.username
            };
            const userReqJSON = JSON.stringify(userReq);
            self.ws.send(userReqJSON);

            self.getNotification();
            setInterval(self.getNotification(), 60000);
        }

        this.ws.onmessage = function (res) {
            var message = JSON.parse(res.data);
            console.log(message.body);
            if (message.body.code === 'getUser') {
                self.setState({ name: message.body.user.name, board: message.body.user.boards, email: message.body.user.email, currentBoard: message.body.user.currentBoard, faculty: message.body.user.faculty, major: message.body.user.major });
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
            }
        }
    }

    componentWillMount() {
        const username = localStorage.getItem("username") || this.props.location.state.username;
        const name = localStorage.getItem("name") || this.props.location.state.name;

        this.setState({ username: username, name: name });
    }

    goHome() {
        var self = this;
        this.ws.close();
        const location = {
            pathname: '/home',
            state: { username: self.state.username, name: self.state.name }
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

    logout() {
        this.ws.close();
        window.fetch('http://' + ip + '/logout')
            .then((response) => {
                const location = {
                    pathname: '/login'
                };
                this.props.history.push(location);
                return response.json()
            })
            .catch((error) => {
                throw error;
            });
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("name");
    }

    saveUser(e) {
        e.preventDefault();

        var self = this;
        var userUpdateReq = {
            code: 'updateUser',
            updatedObj: {
                username: self.state.username,
                name: self.state.name,
                faculty: self.state.faculty,
                major: self.state.major,
                email: self.state.email
            }
        };
        const userReqJSON = JSON.stringify(userUpdateReq);
        self.ws.send(userReqJSON);
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

    handleChange(e) {
        e.preventDefault();

        const { value } = e.target;
        const { name } = e.target;
        this.setState({ [name]: value });
        console.log(name);
    }

    render() {
        return (
            <div>
                <HeadNav goHome={this.goHome} goUserPage={this.goUserPage} logout={this.logout} notifications={this.state.notifications} unreadNotification={this.state.unreadNotification} readNotification={this.readNotification} setUnreadNotification={this.setUnreadNotification} getNotification={this.getNotification} acceptInvite={this.acceptInvite} ws={this.ws} />
                <div className='user-container'>
                    <form>
                        <h1>Profile</h1>
                        <FieldGroup
                            id="formControlsText"
                            type="text"
                            label="Username"
                            name="username"
                            value={this.state.username}
                            placeholder={this.state.username}
                            disabled
                            style={{ cursor: "default" }}
                            onChange={this.handleChange}
                        />
                        <FieldGroup
                            id="formControlsText"
                            type="text"
                            label="Name"
                            name="name"
                            value={this.state.name}
                            placeholder="Enter name"
                            onChange={this.handleChange}
                        />
                        <FieldGroup
                            id="formControlsEmail"
                            type="email"
                            label="Email address"
                            name="email"
                            value={this.state.email}
                            placeholder="Enter email"
                            onChange={this.handleChange}
                        />
                        <FieldGroup
                            id="formControlsEmail"
                            type="email"
                            label="Faculty"
                            name="faculty"
                            value={this.state.faculty}
                            placeholder="Enter faculty"
                            onChange={this.handleChange}
                        />
                        <FieldGroup
                            id="formControlsEmail"
                            type="email"
                            label="Major"
                            name="major"
                            value={this.state.major}
                            placeholder="Enter major"
                            onChange={this.handleChange}
                        />
                        <Button bsStyle='primary' onClick={this.saveUser} >Save</Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default UserPage;