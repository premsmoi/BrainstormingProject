import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './mystyle/General.scss';

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            invited: false,
            invite: []
        }

        this.invite = this.invite.bind(this);
        this.setInvitedUser = this.setInvitedUser.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userSearchResult !== this.props.userSearchResult) {
            this.setState({ users: nextProps.userSearchResult });

            const invite = [];
            nextProps.userSearchResult.map((user) => {
                invite.push(false);
            })
            this.setState({invite: invite});
        }
    }

    invite(e, i) {
        e.preventDefault();
        this.props.inviteUser();

        const invite = this.state.invite;
        invite[i] = true;
        this.setState({invite: invite});
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
                        <Button bsSize="xsmall" style={{ display: user.joined ? 'none' : (this.state.invite[index] === true ? 'none' : 'block'), float: 'right' }} onClick={(e) => this.invite(e,index)} onMouseOver={(e) => this.setInvitedUser(e, user.username)}>invite</Button>
                        <span style={{ display: user.joined ? 'block' : 'none', float: 'right' }}>joined</span>
                        <span style={{ display: this.state.invite[index] === true ? 'block' : 'none', float: 'right' }}>invite sent</span>
                    </div>
                )}
            </div>
        );
    }
}

export default UserList;