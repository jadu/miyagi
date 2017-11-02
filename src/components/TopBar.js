import React from 'react';
import { Link } from 'react-router-dom';

export default function TopBar ({
    authenticationService
}) {
    const { authenticated, user } = authenticationService.getAuthenticatedUser();

    window.auth = authenticationService;

    return (
        <div className="topbar">
            <Link to="/" className="topbar__logo"><h1>Miyagi</h1></Link>
            { authenticated && <p className="topbar__user">{user}</p> }
        </div>
    );
};
