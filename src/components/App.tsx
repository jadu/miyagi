import * as React from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Login from './Login';
import AuthenticationService from '../services/AuthenticationService';
import ProtectedRoute from './ProtectedRoute';
import Miyagi from './Miyagi';
import TopBar from './TopBar';
import TheManHimself from './TheManHimself';
import Introduction from './Introduction';
import Statistics from './Statistics';

const authenticationService = new AuthenticationService(window);

authenticationService.init();

export default class App extends React.Component {
    render () {
        return (
            <BrowserRouter>
                <div className="root__container">
                    <TopBar authenticationService={authenticationService}/>

                    <Route path="/login" render={
                        props => <Login { ...props } authenticationService={authenticationService}/>
                    }/>

                    <Route path="/introduction" render={Introduction}/>
                    {/* <Route path="/statistics" render={props => <Statistics { ...props }/>}/> */}

                    <ProtectedRoute exact path="/" Component={Miyagi} authenticationService={authenticationService}/>
                </div>
            </BrowserRouter>
        );
    }
}
