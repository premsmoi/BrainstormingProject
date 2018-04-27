import React, { Component } from 'react';
import { Button, Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import './mystyle/HeadNav.css';
import Notification from './Notification';

class HeadNav extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Nav">
                <div className="Nav-member" onClick={this.props.goHome}><Glyphicon className='margin' glyph="home" />Home</div>
                <Notification notifications={this.props.notifications} unreadNotification={this.props.unreadNotification} readNotification={this.props.readNotification} setUnreadNotification={this.props.setUnreadNotification} getNotification={this.props.getNotification} acceptInvite={this.props.acceptInvite} ws={this.props.ws} />
                <div className="Nav-member" onClick={this.props.goUserPage}><Glyphicon className='margin' glyph="user" />Profile</div>
                <div className="Nav-member" onClick={this.props.logout}><Glyphicon className='margin' glyph="off" />Log out</div>
            </div>
        );
    }
}

export default HeadNav;