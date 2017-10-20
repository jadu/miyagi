import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class ProtectedRoutes extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const { component: Component, authenticationService, ...rest } = this.props;
        const auth = this.props.authenticationService.getAuthenticated();

        console.log(`checking authentication | ${auth}`);

        return <Route { ...rest } render={props => (
            auth
                ? <Component { ...props }/>
                : <Redirect to={{ pathname: '/login', state : { from: props.location } }}/>
        )}/>
    }
}
