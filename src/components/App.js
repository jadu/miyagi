import React from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Login from './Login';
import Sentiment from './Sentiment';
import AuthenticationService from './AuthenticationService';
import ProtectedRoute from './ProtectedRoute';

const authenticationService = new AuthenticationService();

// authenticationService.setAuthenticated(true);

export default class App extends React.Component {
    handleSlackToken (token) {
        console.log('handling slack athenticaton: ', token);
    }

    render () {
        return (
            <BrowserRouter>
                <div className="app">
                    <pre>App</pre>
                    <Route path="/login" render={
                        props => <Login { ...props } authenticationService={authenticationService}/>
                    }/>
                    <ProtectedRoute exact path="/" component={Sentiment} authenticationService={authenticationService}/>
                </div>
            </BrowserRouter>
        );
    }
}
