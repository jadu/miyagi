import * as React from 'react';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom';
import Login from './Login';
import AuthenticationService from '../services/AuthenticationService';
import ProtectedRoute from './ProtectedRoute';
import Miyagi from './Miyagi';
import TopBar from './TopBar';
import TheManHimself from './TheManHimself';
import Introduction from './Introduction';
import Statistics from './Statistics';
import LaRusso from './larusso/LaRusso';

const authenticationService = new AuthenticationService(window);

authenticationService.init();

export default class App extends React.Component {
    render () {
        return (
            <BrowserRouter>
                <div className="root__container">
                    <Route render={
                        props => <TopBar { ...props } authenticationService={authenticationService}/>
                    }/>

                    <Switch>
                        <Route path="/login" render={
                            props => <Login { ...props } authenticationService={authenticationService}/>
                        }/>
                        <Route path="/introduction" render={Introduction}/>
                        <ProtectedRoute path="/larusso" Component={LaRusso} authenticationService={authenticationService}/>
                        <ProtectedRoute Component={Miyagi} authenticationService={authenticationService}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
