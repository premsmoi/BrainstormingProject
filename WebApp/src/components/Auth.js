import React, { Component } from 'react';

class Auth extends Component {
    // Initializing important variables
    constructor(props) {
        super(props);
        //this.domain = domain || 'http://localhost:3001'
        this.fetch = this.fetch.bind(this)
        this.login = this.login.bind(this)
        //this.getProfile = this.getProfile.bind(this)
    }

    login(username, password) {
        const self = this;
        // Get a token from api server using the fetch api
        return window.fetch('http://127.0.0.1:3001/login', {
            method: "POST",
            body: JSON.stringify({ username: username, password: password }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        }).then(response => {
            //this.setToken(res.token);
            //console.log(res.token);
            //return Promise.resolve(res);
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
        })
    }

    isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    //getProfile() {
    ////     Using jwt-decode npm package to decode the token
    //    return decode(this.getToken());
    //}


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }

    render() {
        return (<div />);
    }
}

export default Auth;
