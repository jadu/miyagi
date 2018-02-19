import * as React from 'react';
import { Link } from 'react-router-dom';
import AuthenticationService from '../services/AuthenticationService';
import { LocationState } from 'history';

interface TopBarProps {
    authenticationService: AuthenticationService;
    location: LocationState;
}

const TopBar: React.SFC<TopBarProps> = ({
    authenticationService,
    location
}) => {
    const { authenticated, user } = authenticationService.getAuthenticatedUser();
    const larusso = location.pathname.slice(1) === 'larusso';

    return (
        <div className="topbar">
            <Link to={`${larusso ? '/' : '/larusso'}`} className="topbar__logo">
                { larusso
                    ? <h1 className="larusso-logo">LaRusso</h1>
                    : <h1 className="miyagi-logo">Miyagi</h1>
                }
            </Link>
            { authenticated && <p className="topbar__user">{user}</p> }
        </div>
    );
};

export default TopBar;
