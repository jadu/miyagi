import * as React from 'react';
import { Link } from 'react-router-dom';
import AuthenticationService from '../services/AuthenticationService';

interface TopBarProps {
    authenticationService: AuthenticationService;
}

export default function TopBar ({ authenticationService }: TopBarProps) {
    const { authenticated, user } = authenticationService.getAuthenticatedUser();

    return (
        <div className="topbar">
            <Link to="/" className="topbar__logo"><h1>Miyagi</h1></Link>
            { authenticated && <p className="topbar__user">{user}</p> }
        </div>
    );
};
