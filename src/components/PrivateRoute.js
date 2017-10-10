import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute ({ component: Component, ...rest }) {
    console.log('entered private route...');

    return <Route { ...rest } render={ props => {
        return rest.authenticationService.getAuthenticated()
            ? <Component {...props}/>
            : <Redirect
                to={{
                    pathname: '/login',
                    state: { from: props.location }
                }}/>
    }}/>
}
