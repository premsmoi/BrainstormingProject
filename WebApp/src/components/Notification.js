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
            //notifications: [{ notificationType: "normal", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestNoti", read: false, date: "25-01-2556" }, { notificationType: "reply", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestReplyNoti", read: false, date: "25-01-2556" }, { notificationType: "reply", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestReplyNoti", read: false, date: "25-01-2556" }, { notificationType: "reply", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestReplyNoti", read: false, date: "25-01-2556" }, { notificationType: "reply", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestReplyNoti", read: false, date: "25-01-2556" }, { notificationType: "reply", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestReplyNoti", read: false, date: "25-01-2556" }, { notificationType: "reply", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestReplyNoti", read: false, date: "25-01-2556" }, { notificationType: "reply", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestReplyNoti", read: false, date: "25-01-2556" }, { notificationType: "reply", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestReplyNoti", read: false, date: "25-01-2556" }, { notificationType: "reply", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestReplyNoti", read: false, date: "25-01-2556" }, { notificationType: "reply", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestReplyNoti", read: false, date: "25-01-2556" }, { notificationType: "normal", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestNoti", read: false, date: "25-01-2556" }, { notificationType: "normal", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestNoti", read: false, date: "25-01-2556" }, { notificationType: "normal", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "TestNoti", read: false, date: "25-01-2556" }, { notificationType: "normal", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "VeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLong", read: false, date: "25-01-2556" }, { notificationType: "normal", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "VeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLong", read: false, date: "25-01-2556" }, { notificationType: "normal", boardName: "Test", boardId: "5ad4150ea779a349659475fb", user: "Emerald01", detail: "VeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLongVeryVeryVeryVeryLong", read: false, date: "25-01-2556" }]
        };
        this.detectDropdown = this.detectDropdown.bind(this);
        this.countUnreadNotification = this.countUnreadNotification.bind(this);
        this.read = this.read.bind(this);
        this.acceptInvite = this.acceptInvite.bind(this);
    }

    countUnreadNotification() {
        var read = 0;
        this.state.notifications.map(function (noti) {
            if (noti.read === false) {
                read++;
                //console.log(read);
            }
        });
        //console.log('read: '+read);
        return read;
    }

    acceptInvite(e, noti) {
        e.preventDefault();
        this.props.acceptInvite(noti);
        //console.log(noti);
    }

    componentWillMount() {
        //this.setState({ notifications: this.props.notifications });
        this.setState({ unreadNotification: this.props.unreadNotification, notifications: this.props.notifications})
        //var self=this;
        //this.setState({ unreadNotification: this.countUnreadNotification() });
    }

    componentDidMount() {
        //this.setState({ notifications: this.props.notifications });
        this.setState({ unreadNotification: this.props.unreadNotification, notifications: this.props.notifications })
        //var self=this;
        //this.setState({ unreadNotification: this.countUnreadNotification() });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.setState({ unreadNotification: nextProps.unreadNotification, notifications: nextProps.notifications });
        }
    }

    read() {
        var self = this;
        this.state.notifications.map(function (notification) {
            if (notification.read === false) {
                self.props.readNotification(notification);
            }
        })
    }

    detectDropdown(e) {
        e.preventDefault();
        const cn = e.target.parentNode.className;
        if (cn.indexOf("open") === -1 && this.state.read === false) {
            this.setState({read: true});
            console.log(this.state.unreadNotification);
        }
        if (cn.indexOf("open") !== -1 && this.state.read === true && this.state.unreadNotification > 0) {
            if (this.state.unreadNotification > 0) {
                this.read();
                console.log("done");
            }
            this.setState({read: false});
        }
    }

    //<MenuItem eventKey="1">Action</MenuItem>
    //<MenuItem eventKey="2">Another action</MenuItem>
    //<MenuItem eventKey="3" active>
    //    Active Item
    //                    </MenuItem>
    //<MenuItem divider />
    //<MenuItem eventKey="4">Separated link</MenuItem>


    //<MenuItem eventKey={index.toString()} key={index.toString()} className={noti.notificationType === 'reply' ? "reply" : "normal"}>
    //{noti.detail}
    //</MenuItem>
    //<MenuItem divider />

    //    {
    //    this.state.notifications.map((noti, index) => {
    //        if (noti.notificationType === 'reply') {
    //            return (<MenuItem eventKey={index.toString()} key={index.toString()}>
    //                {noti.detail}
    //                <Button>Accept</Button>
    //                <Button>Decline</Button>
    //            </MenuItem>);
    //        }
    //        else {
    //            return (<MenuItem eventKey={index.toString()} key={index.toString()}>
    //                {noti.detail}
    //            </MenuItem>);
    //        }
    //    })
    //}
    render() {
        return (
            <div>
                <Dropdown bsStyle='default' onClick={this.detectDropdown} >
                    <Dropdown.Toggle>
                        <Glyphicon glyph="envelope" />
                        <Label>{this.state.unreadNotification}</Label>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="super-colors noti-menu">
                        {this.state.notifications.map((noti, index) => {
                            if (noti.notificationType === 'reply') {
                                return (<MenuItem eventKey={index.toString()} key={index.toString()} className={(noti.read === false) ? 'noti-item unread' : 'noti-item'}>
                                    {noti.detail}
                                    <Button onClick={(e) => this.acceptInvite(e, noti)}>Accept</Button>
                                    <Button>Decline</Button>
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