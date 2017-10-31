import React from 'react';
import { Redirect } from 'react-router-dom';
import Button from './Button';

export default class Login extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            redirectToReferrer: false,
            error: ''
        };
    }

    handleLogin () {
        const anonymous = false;
        const value = this.refs.name.value.trim();

        console.log(value, anonymous)

        if (value || anonymous) {
            this.props.authenticationService.authenticate(anonymous ? null : value);
            this.setState({ redirectToReferrer: true, error: '' });
        } else {
            this.setState({ error: 'We need a value here' });
        }
    }

    handleAnonymousLogin (event) {
        event.preventDefault();
        this.handleLogin(true);
    }

    render () {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
          return (
            <Redirect to={from}/>
          )
        } else {
            return (
                <div className="authentication">
                    <p className="authentication__help">
                        You should only ever have to do this once. Enter your name to start contributing to our machine learning platform.
                        {/* If you would rather stay anonymous
                        <a className="link link--inline authentication__annon" href="/" onClick={this.handleAnonymousLogin.bind(this)}>
                            click here
                        </a> */}
                    </p>
                    { this.state.error && <p className="error">{this.state.error}</p> }
                    <div className="input-group">
                        <input ref="name" className="input" type="text" placeholder="Daniel LaRusso"/>
                        <Button
                            value="Get started"
                            onClick={this.handleLogin.bind(this)}
                            modifiers={['button--primary']}
                        />
                    </div>
                </div>
            )
        }
    }
}
