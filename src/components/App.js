import React from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Authentication from './Authentication';
import Sentiment from './Sentiment';
import PrivateRoute from './PrivateRoute';
import AuthenticationService from './AuthenticationService';

const authenticationService = new AuthenticationService();

// authenticationService.setAuthenticated(true);

export default () => (
    <BrowserRouter>
        <div>
            <pre>index page</pre>
            <PrivateRoute
                exact={true}
                path="/"
                authenticationService={authenticationService}
                component={Sentiment}
            />
            <Route
                path="/login"
                render={({ ...props }) => <Authentication { ...props } authenticationService={authenticationService}/>}
            />
        </div>
    </BrowserRouter>
);
