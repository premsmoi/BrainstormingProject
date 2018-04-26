import React, { Component } from 'react';

class Facebook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: false
        }
        this.goHome = this.goHome.bind(this);
    }
    
    componentDidMount() {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '903924136477708',
                cookie: true,
                xfbml: true,
                version: 'v2.1'
            });

            window.FB.AppEvents.logPageView();

            window.FB.getLoginStatus(function (response) {
                //statusChangeCallback(response);
                console.log(response);

                if (response.status === "connected") {
                    //window.FB.login();

                }
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    goHome() {
        window.FB.getLoginStatus(function (response) {
            //statusChangeCallback(response);
            console.log(response);
        });
    }

    render() {
        return (
            <div class="fb-login-button" scope="public_profile,email" data-width="300px" data-max-rows="1" data-size="large" data-button-type="login_with" onlogin={this.goHome} data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false"></div>
            );
    }
}

export default Facebook;