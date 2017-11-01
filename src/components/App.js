import * as React from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Login from './Login';
import Sentiment from './Sentiment';
import AuthenticationService from './AuthenticationService';
import ProtectedRoute from './ProtectedRoute';
import Miyagi from './Miyagi';
import TopBar from './TopBar';
import TheManHimself from './TheManHimself';

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

                    <ProtectedRoute exact path="/" Component={Miyagi} authenticationService={authenticationService}/>
                    {/* <Miyagi/> */}

                    <TheManHimself/>
                </div>
            </BrowserRouter>
        );
    }
}
