import React, { Component } from 'react';
import './mystyle/Login.scss';
import './mystyle/General.scss';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Auth from './Auth';
//import { withCookies, Cookies } from 'react-cookie';
//import { instanceOf } from 'prop-types';

class Login extends Component {

    //    static propTypes = {
    //        cookies: instanceOf(Cookies).isRequired
    //    };

    constructor(props) {
        super(props);
        this.state = {

        };

        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        //this.Auth = new Auth();
    }

    componentWillMount() {
        //        const { cookies } = this.props;

        //        if(cookies.get('username')) {
        //            this.setState({username: cookies.get('username')});
        //        }
        //        window.localStorage.setItem('test','hello');
        //        console.log(window.localStorage.getItem('test'));
    }

    isAuthenticated() {
        //        const { cookies } = this.props;
        //        
        //        if(cookies.get('username')) {
        //            return true;
        //        }
    }

    login(e) {
        e.preventDefault();

        var self = this;
        var params = {};
        params['username'] = this.state.username;
        params['password'] = this.state.password;

        //this.Auth.login(this.state.username, this.state.password);

        window.fetch('http://127.0.0.1:3001/login', {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        }).then(function (response) {
            return response.json().then(function (text) {
                if (text.loginSuccess === true) {
                    console.log(text.user.username + ' -> Login');
                    const location = {
                        pathname: '/home',
                        state: { username: text.user.username, name: text.user.name }
                    };
                    self.props.history.push(location);
                } else
                    alert(text['message']);
            });
        });
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className="background">
                <div className="login-window">
                    <form>
                        <label className="block">
                            Username
                                <input name="username" className="text-box block wide" onChange={this.handleChange} value={this.state.username} type="text" />
                        </label>
                        <label className="block">
                            Password
                                <input name="password" className="text-box block wide" onChange={this.handleChange} value={this.state.password} type="password" />
                        </label>
                        <Link to={"/register"} >
                            Not a member? please register
                            </Link>
                        <Button className="block wide" bsStyle="primary" onClick={this.login}>Submit</Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
;