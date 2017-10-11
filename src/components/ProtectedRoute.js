import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class ProtectedRoutes extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const { component: Component, authenticationService, ...rest } = this.props;
        const { search } = window.location;

        if (search) {
            authenticationService.authenticateWithParams(search);
        }

        return <Route { ...rest } render={props => (
            this.props.authenticationService.getAuthenticated()
                ? <Component { ...props }/>
                : <Redirect to={{ pathname: '/login', state : { from: props.location } }}/>
        )}/>
    }
}
