import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './mystyle/General.scss';

class UserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        }

        this.invite = this.invite.bind(this);
        this.setInvitedUser = this.setInvitedUser.bind(this);
    }

    componentWillMount() {
        //window.fetch('http://127.0.0.1:3001/user_list', {
        //    method: 'GET',
        //    headers: {
        //        "Content-Type": "application/json"
        //    },
        //    credentials: "same-origin"
        //}).then(res => { return res.json() })
        //    .then((data) => {
        //        //                    console.log(data);
        //        const arr = data;
        //        this.setState({ users: arr }, () => {
        //            console.log(this.state.users);
        //        });
        //    });
        //this.setState({ users: this.props.userSearchResult});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userSearchResult !== this.props.userSearchResult) {
            this.setState({ users: nextProps.userSearchResult });
        }
    }

    invite(e) {
        e.preventDefault();
        this.props.inviteUser();
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
                        <Button bsSize="xsmall" style={{ display: user.joined ? 'none' : 'block', float: 'right' }} onClick={this.invite} onMouseOver={(e) => this.setInvitedUser(e, user.username)}>invite</Button>
                        <span style={{ display: user.joined ? 'block' : 'none', float: 'right' }}>joined</span>
                    </div>
                )}
            </div>
        );
    }
}

export default UserList;