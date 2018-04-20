import React, { Component } from 'react';
import './mystyle/HeadNav.css';

class HeadNav extends Component {
    render() {
        return (
                <div className="Nav">
                    <div className="Nav-member">Home</div>
                    <div className="Nav-member">Search</div>
                    <div className="Nav-member">Setting</div>
                    <div className="Nav-member">Notification</div>
                </div>
                );
    }
}

export default HeadNav;