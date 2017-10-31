import React from 'react';

export default function TopBar ({
    authenticationService
}) {
    const { authenticated, user } = authenticationService.getAuthenticatedUser();

    return (
        <div className="topbar">
            <h1 className="topbar__logo">Miyagi</h1>
            { authenticated && <p className="topbar__user">{user}</p> }
        </div>
    );
};
