import React, {Component} from 'react';
import './mystyle/Login.scss';
import './mystyle/General.scss';
import axios from 'axios';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

        this.handleChange = this.handleChange.bind(this);
        this.register = this.register.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    register() {
        var params = {
            username: this.state.username,
            password: this.state.password,
            password2: this.state.password2,
            name: this.state.name,
            email: this.state.email,
        };

        console.log('Register for ' + JSON.stringify(params))

        //fetch('http://10.0.2.2:8080/register', {
        fetch('http://54.169.35.33:8080/register', {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        })
                .then((response) => {
                    var body = JSON.parse(response._bodyText);
                    console.log(body)
                    console.log(body['status'])
                    if (body['status'] === 0) {
                        var errMsg = ''
                        for (var i = 0; i < body['errors'].length; i++) {
                            errMsg = errMsg + body['errors'][i] + '\n';
                        }
                        alert(
                                'Alert',
                                errMsg,
                                [
                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                                ],
                                {cancelable: false}
                        )
                    } else {
            this.setState({visibleRegModal: false})
                        alert(
                                'Alert',
                                'Register complete',
                                [
                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                                ],
                                {cancelable: false}
                        )
                    }
                    return response.json()
                })
                .catch((error) => {
                    throw error;
                });

//        axios.post('http://127.0.0.1:3001/register', JSON.stringify(params))
//        axios.post({
//            method: 'post',
//            url: 'http://127.0.0.1:3001/post',
//            data: params,
//            headers: {"Content-Type": "application/json"},
//            transformRequest: [function (data, headers) {
//                    // Do whatever you want to transform the data
//                    data = JSON.stringify(data);
//                    return data;
//                }],
//        })
//                .then(function (response) {
//                    var body = JSON.parse(response._bodyText);
//                    console.log(body)
//                    console.log(body['status'])
//                    if (body['status'] === 0) {
//                        var errMsg = ''
//                        for (var i = 0; i < body['errors'].length; i++) {
//                            errMsg = errMsg + body['errors'][i] + '\n';
//                        }
//                        alert(
//                                'Alert',
//                                errMsg,
//                                [
//                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
//                                ],
//                                {cancelable: false}
//                        )
//                    } else {
////            this.setState({visibleRegModal: false})
//                        alert(
//                                'Alert',
//                                'Register complete',
//                                [
//                                    {text: 'OK', onPress: () => console.log('OK Pressed')},
//                                ],
//                                {cancelable: false}
//                        )
//                    }
//                    return response.json()
//                })
//                .catch(function (error) {
//                    console.log(error + " what");
//                });
    }

    render() {
        return(
                <div className="background">
                    <div className="login-window">
                        <form>
                            <label className="block">
                                Username
                                <input className="text-box block wide" name="username" value={this.state.username} onChange={this.handleChange} type="text"/>
                            </label>
                            <label className="block">
                                Password
                                <input className="text-box block wide" name="password" value={this.state.password} onChange={this.handleChange} type="password"/>
                            </label>
                            <label className="block">
                                Confirm Password
                                <input className="text-box block wide" name="password2" value={this.state.password2} onChange={this.handleChange} type="password"/>
                            </label>
                            <label className="block">
                                Name
                                <input className="text-box block wide" name="name" value={this.state.name} onChange={this.handleChange} type="text"/>
                            </label>
                            <label className="block">
                                Email
                                <input className="text-box block wide" name="email" value={this.state.email} onChange={this.handleChange} type="email"/>
                            </label>
                            <button className="block wide" onClick={this.register}>Submit</button>
                        </form>
                    </div>
                </div>
                );
    }
}

export default Register;