import React, { Component } from 'react';
import './mystyle/Login.scss';
import './mystyle/General.scss';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//const ip = 'localhost:3001';
const ip = '54.169.35.33:8080';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

        this.handleChange = this.handleChange.bind(this);
        this.register = this.register.bind(this);
        this.goHome = this.goHome.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    goHome(e) {
        e.preventDefault();
        window.fetch('http://' + ip + '/logout')
            .then((response) => {
                const location = {
                    pathname: '/login'
                };
                this.props.history.push(location);
                return response.json()
            })
            .catch((error) => {
                throw error;
            });
    }

    register() {
        var self = this;
        var params = {
            username: this.state.username,
            password: this.state.password,
            password2: this.state.password2,
            name: this.state.name,
            email: this.state.email,
        };
        window.fetch('http://' + ip + '/register', {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        })
            .then((res) => res.json()).then((body) => {
                if (body['status'] === 0) {
                    alert("Register incomplete! please try again");
                } else {
                    alert("Register complete");
                    const location = {
                        pathname: '/login'
                    };
                    self.props.history.push(location);
                    console.log(body);
                }
            })
            .catch((error) => {
                throw error;
            });
    }

    render() {
        return (
            <div className="background">
                <div className="login-window">
                    <form>
                        <label className="block">
                            Username
                                <input className="text-box block wide" name="username" value={this.state.username} onChange={this.handleChange} type="text" />
                        </label>
                        <label className="block">
                            Password
                                <input className="text-box block wide" name="password" value={this.state.password} onChange={this.handleChange} type="password" />
                        </label>
                        <label className="block">
                            Confirm Password
                                <input className="text-box block wide" name="password2" value={this.state.password2} onChange={this.handleChange} type="password" />
                        </label>
                        <label className="block">
                            Name
                                <input className="text-box block wide" name="name" value={this.state.name} onChange={this.handleChange} type="text" />
                        </label>
                        <label className="block">
                            Email
                                <input className="text-box block wide" name="email" value={this.state.email} onChange={this.handleChange} type="email" />
                        </label>
                        <Link to={"/login"} >
                            back to login
                            </Link>
                        <Button className="block wide" onClick={this.register}>Submit</Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;