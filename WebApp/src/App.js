import React, { Component } from 'react';
import { Route, BrowserRouter,Redirect } from 'react-router-dom';
import HeadNav from './components/HeadNav';
import BoardView from './components/Board';
import NoteView from './components/Note';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Auth from './components/Auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            Auth.isAuthenticated ? (
                <Component {...props} />
            ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
        }
    />
);

class App extends Component {


    render() {
        return (
            <BrowserRouter>
                <div className='App'>
                    <Route path="/" component={HeadNav}>
                    </Route>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/board" component={BoardView} />
                    <Route path='/view/:board_id' component={NoteView} />
                    <Route path="/home" component={Home} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;