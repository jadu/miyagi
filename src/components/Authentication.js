import React from 'react';

export default class Authentication extends React.Component {
    render () {
        return (
            <div className="authentication">
                <div className="authentication__buttons">
                    <a href="https://slack.com/oauth/authorize?scope=identity.basic&client_id=105999935111.249047229058"><img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" /></a>
                    <button className="button authentication__button">I'd rather stay anonymous</button>
                </div>
            </div>
        )
    }
}
