import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            redirectToReferrer: false
        };
    }

    handleAnnonymousLogin () {
        this.props.authenticationService.authenticateWithAnnonymous();
        this.setState({ redirectToReferrer: true });
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
                    <div className="authentication__buttons">
                        <a href="https://slack.com/oauth/authorize?scope=identity.basic&client_id=105999935111.249047229058"><img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" /></a>
                        <button
                            onClick={this.handleAnnonymousLogin.bind(this)}
                            className="button authentication__button"
                        >I'd rather stay anonymous</button>
                    </div>
                </div>
            )
        }
    }
}
