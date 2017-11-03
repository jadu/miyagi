import * as React from 'react';
import { Route, Redirect, NavLinkProps } from 'react-router-dom';
import AuthenticationService from '../services/AuthenticationService';
import { ReactElement } from 'react';

export interface ProtectedRoutesProps {
    Component: any;
    authenticationService: AuthenticationService;
    [index: string]: any;
}

export default function ProtectedRoutes ({
    Component,
    authenticationService,
    ...rest
}: ProtectedRoutesProps) {
    const { authenticated } = authenticationService.getAuthenticatedUser();
    const target = React.cloneElement(<Component/>, {
        authenticationService: authenticationService
    });

    return <Route { ...rest } render={props => (
        authenticated
            ? target
            : <Redirect to={{ pathname: '/login', state : { from: props.location } }}/>
    )}/>
}
