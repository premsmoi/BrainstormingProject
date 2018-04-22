import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './mystyle/General.scss';

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            invited: false
        }

        this.invite = this.invite.bind(this);
        this.setInvitedUser = this.setInvitedUser.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userSearchResult !== this.props.userSearchResult) {
            this.setState({ users: nextProps.userSearchResult });
        }
    }

    invite(e) {
        e.preventDefault();
        this.props.inviteUser();
        this.setState({invited: true});
    }

    setInvitedUser(e, username) {
        e.preventDefault();
        this.props.setInvitedUser(username);
    }

    render() {
        return (
            <div className="block">
                {this.state.users.map((user, index) =>
                    <div key={user.username} className="list relative">{user.username}
                        <Button bsSize="xsmall" style={{ display: user.joined ? 'none' : (this.state.invited === true ? 'none' : 'block'), float: 'right' }} onClick={this.invite} onMouseOver={(e) => this.setInvitedUser(e, user.username)}>invite</Button>
                        <span style={{ display: user.joined ? 'block' : 'none', float: 'right' }}>joined</span>
                        <span style={{ display: this.state.invited === true ? 'block' : 'none', float: 'right' }}>invite sent</span>
                    </div>
                )}
            </div>
        );
    }
}

export default UserList;