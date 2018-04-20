import React, {Component} from 'react';
import './mystyle/Login.scss';
import './mystyle/General.scss';
import { withRouter } from 'react-router';
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

        window.fetch('http://54.169.35.33:8080/login', {
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
                        state: {username: text.user.username, name: text.user.name}
                    };
                    self.props.history.push(location);
                } else
                    alert(text['message']);
            });
        });
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return(
                <div className="background">
                    <div className="login-window">
                        <form>
                            <label className="block">
                                Username
                                <input name="username" className="text-box block wide" onChange={this.handleChange} value={this.state.username} type="text"/>
                            </label>
                            <label className="block">
                                Password
                                <input name="password" className="text-box block wide" onChange={this.handleChange} value={this.state.password} type="password"/>
                            </label>
                            <label>
                                <input type="checkbox"/>
                                Forgot password?
                            </label>
                            <button className="block wide" onClick={this.login}>Submit</button>
                        </form>
                    </div>
                </div>
                );
    }
}

export default Login;
;