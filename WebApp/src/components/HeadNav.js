import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './mystyle/HeadNav.css';

class HeadNav extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        fetch('http://127.0.0.1:3001/logout')
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
    }

    render() {
        return (
                <div className="Nav">
                <div className="Nav-member" onClick={this.logout} style={{ cursor: 'pointer'}}>Log out</div>
                </div>
                );
    }
}

export default HeadNav;