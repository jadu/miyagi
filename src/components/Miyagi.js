import React from 'react';
import Suggestions from './Suggestions';
import Suggestion from './Suggestion';
import Extract from './Extract';
import reqwest from 'reqwest';
import Help from './Help';
import neutralIcon from '../../assets/neutral.png';
import negativeIcon from '../../assets/angry.png';
import positiveIcon from '../../assets/positive.png';
import unicornIcon from '../../assets/unicorn.png';
import { Link } from 'react-router-dom';
import TheManHimself from './TheManHimself';

export default class Miyagi extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            extract: '',
            extractId: '',
            user: this.props.authenticationService.getAuthenticatedUser().user
        };

        this.suggestionMap = {
            positive: { handler: this.makeSuggestion.bind(this), icon: positiveIcon, value: 'Positive', shortcut: 49, keypress: 1 },
            neutral: { handler: this.makeSuggestion.bind(this), icon: neutralIcon, value: 'Neutral', shortcut: 50, keypress: 2 },
            negative: { handler: this.makeSuggestion.bind(this), icon: negativeIcon, value: 'Negative', shortcut: 51, keypress: 3 },
            not_sure: { handler: this.makeSuggestion.bind(this), icon: unicornIcon, value: 'Not Sure', shortcut: 52, keypress: 4 }
        };

        this.getExtract();
    }

    getExtract () {
        reqwest({
            url: 'miyapi/extract',
            method: 'get'
        }).then(this.updateExtractFromResponse.bind(this));
    }

    makeSuggestion (key) {
        return new Promise (resolve => {
            reqwest({
                url: 'miyapi/extract',
                method: 'post',
                data: { _id: this.state.extractId, value: key, user_id: this.state.user }
            }).then(async res => {
                await this.updateExtractFromResponse(res);
                resolve();
            });
        });
    }

    async updateExtractFromResponse (response) {
        const extract = JSON.parse(response);

        await this.setState({
            extract: extract.extract.text,
            extractId: extract.extract._id
        });
    }

    async handleSuggestion (key) {
        await this.suggestionMap[key].handler(key);
    }

    render () {
        const options = Object.keys(this.suggestionMap)
            .map(option =>
                <Suggestion
                    shortcut={this.suggestionMap[option].shortcut}
                    key={option}
                    icon={this.suggestionMap[option].icon}
                    value={this.suggestionMap[option].value}
                />
            );

        return (
            <div className="miyagi">
                <p className="extract__help">Read the extract below and let Miyagi know what you think the sentiment of the message is. There is no right or wrong answer, if you are unsure we'll send you another one. Be sure to read our <Link to="/introduction" className="link link--inline">Introduction to Miyagi</Link> before you begin.</p>
                <Extract text={this.state.extract}/>
                <Suggestions onSuggestion={this.handleSuggestion.bind(this)}>
                    { options }
                </Suggestions>
                <Help
                    shortcuts={Object.keys(this.suggestionMap).map(
                        suggestion => ({
                            code: this.suggestionMap[suggestion].keypress,
                            action: this.suggestionMap[suggestion].value
                        })
                    )}
                />
                <TheManHimself/>
            </div>
        )
    }
}
