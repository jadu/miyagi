import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class ProtectedRoutes extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const { Component, authenticationService, ...rest } = this.props;
        const { authenticated } = this.props.authenticationService.getAuthenticatedUser();

        return <Route { ...rest } render={props => (
            authenticated
                ? <Component authenticationService={authenticationService}/>
                : <Redirect to={{ pathname: '/login', state : { from: props.location } }}/>
        )}/>
    }
}
