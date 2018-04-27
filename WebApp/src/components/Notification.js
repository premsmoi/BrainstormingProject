import React, { Component } from 'react';
import Icon from 'react-icons-kit';
import { ic_notifications } from 'react-icons-kit/md';
import { Label, Dropdown, Glyphicon, MenuItem, Button } from 'react-bootstrap';
import './mystyle/Notification.scss';

class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            read: false,
            unreadNotification: 0,
            notifications: []
        };
        this.detectDropdown = this.detectDropdown.bind(this);
        this.countUnreadNotification = this.countUnreadNotification.bind(this);
        this.read = this.read.bind(this);
        this.acceptInvite = this.acceptInvite.bind(this);
        this.readReply = this.readReply.bind(this);
        this.declineInvite = this.declineInvite.bind(this);
    }

    countUnreadNotification() {
        var read = 0;
        this.state.notifications.map(function (noti) {
            if (noti.read === false) {
                read++;
            }
        });
        return read;
    }

    acceptInvite(e, noti) {
        e.preventDefault();
        this.props.acceptInvite(noti);

        this.readReply(noti);
    }

    declineInvite(e, noti) {
        e.preventDefault();
        this.readReply(noti);
    }

    componentWillMount() {
        this.setState({ unreadNotification: this.props.unreadNotification, notifications: this.props.notifications });
    }

    componentDidMount() {
        this.setState({ unreadNotification: this.props.unreadNotification, notifications: this.props.notifications });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.setState({ unreadNotification: nextProps.unreadNotification, notifications: nextProps.notifications });
        }
    }

    read() {
        var self = this;
        this.state.notifications.map(function (notification) {
            if (notification.read === false && notification.notificationType !== 'reply') {
                self.props.readNotification(notification);
            }
        });
    }

    readReply(noti) {
        if (noti.read === false) {
            this.props.readNotification(noti);
        }
        this.read();
    }

    detectDropdown(e) {
        e.preventDefault();
        const cn = e.target.parentNode.className;

        if (this.state.read === false) {
            this.setState({ read: true });
        } else {
            this.setState({ read: false });
            this.read();
        }
    }

    render() {
        return (
            <div>
                <Dropdown pullRight onClick={this.read} >
                    <div className="Nav-member" bsRole='toggle'>
                        <Glyphicon className='margin' glyph="envelope" />
                        <span>Notification</span>
                        <Label>{this.state.unreadNotification}</Label>
                    </div>

                    <Dropdown.Menu className="super-colors noti-menu">
                        {this.state.notifications.map((noti, index) => {
                            if (noti.notificationType === 'reply') {
                                return (<MenuItem eventKey={index.toString()} key={index.toString()} className={(noti.read === false) ? 'noti-item unread' : 'noti-item read'}>
                                    {noti.detail}
                                    <Button onClick={(e) => this.acceptInvite(e, noti)}>Accept</Button>
                                    <Button onClick={(e) => this.declineInvite(e, noti)}>Decline</Button>
                                </MenuItem>);
                            }
                            else {
                                return (<MenuItem eventKey={index.toString()} key={index.toString()} className={(noti.read === false) ? 'noti-item unread' : 'noti-item'}>
                                    {noti.detail}
                                </MenuItem>);
                            }
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }
}

export default Notification;