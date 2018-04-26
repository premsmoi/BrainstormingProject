import React, { Component } from 'react';
import './mystyle/Login.scss';
import './mystyle/General.scss';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Auth from './Auth';
import Facebook from './Facebook';

//const ip = 'localhost:3001';
const ip = '54.169.35.33:8080';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentWillMount() {
        var self = this;

        if (window.localStorage.getItem("username")) {
            const location = {
                pathname: '/home',
                state: { username: window.localStorage.getItem("username"), name: window.localStorage.getItem("name") }
            };
            self.props.history.push(location);
        }
    }

    login(e) {
        e.preventDefault();

        var self = this;
        var params = {};
        params['username'] = this.state.username;
        params['password'] = this.state.password;

        //this.Auth.login(this.state.username, this.state.password);
        window.fetch('http://' + ip + '/login', {
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
                    localStorage.setItem("username", text.user.username);
                    localStorage.setItem("name", text.user.name);
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
                <div id="fb-root"></div>
                <div className="login-window">
                    <form>
                        <h2>Login</h2>
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