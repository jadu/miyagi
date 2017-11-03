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
import pooIcon from '../../assets/poo.png';
import { Link } from 'react-router-dom';
import TheManHimself from './TheManHimself';
import Options from './Options';

export default class Miyagi extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            extract: '',
            extractId: '',
            user: this.props.authenticationService.getAuthenticatedUser().user,
            options: [
                { id: 'incomplete_redaction', label: 'This extract contains content that should be redacted', checked: false }
            ]
        };

        this.suggestionMap = {
            positive: { handler: this.makeSuggestion.bind(this), icon: positiveIcon, value: 'Positive', shortcut: 49, keypress: 1 },
            neutral: { handler: this.makeSuggestion.bind(this), icon: neutralIcon, value: 'Neutral', shortcut: 50, keypress: 2 },
            negative: { handler: this.makeSuggestion.bind(this), icon: negativeIcon, value: 'Negative', shortcut: 51, keypress: 3 },
            not_sure: { handler: this.makeSuggestion.bind(this), icon: unicornIcon, value: 'Not Sure', shortcut: 52, keypress: 4 },
            impossible: { handler: this.makeSuggestion.bind(this), icon: pooIcon, value: 'Impossible', shortcut: 53, keypress: 5 }
        };

        this.options = [

        ]

        this.getExtract();
    }

    getExtract () {
        reqwest({
            url: 'miyapi/extract',
            method: 'get'
        }).then(this.updateExtractFromResponse.bind(this));
    }

    makeSuggestion (key) {
        const options = [...this.state.options].map(option => ({ id: option.id, value: option.checked }));
        const data = { _id: this.state.extractId, value: key, user_id: this.state.user, options: options };

        return new Promise (resolve => {
            reqwest({
                url: 'miyapi/extract',
                method: 'post',
                data: data
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

    handleOptionChange (event) {
        const { checked } = event.target;
        const id = event.target.getAttribute('id');
        const newOptionState = this.state.options.map(option => Object.assign({} , option));

        newOptionState.find(option => option.id === id).checked = checked;
        this.setState({ options: newOptionState });
    }

    render () {
        const suggestions = Object.keys(this.suggestionMap)
            .map(option =>
                <Suggestion
                    shortcut={this.suggestionMap[option].shortcut}
                    key={option}
                    icon={this.suggestionMap[option].icon}
                    value={this.suggestionMap[option].value}
                />
            );
        const options = this.state.options.map(opt => (
            <div key={opt.id} className="option">
                <input ref={opt.id} id={opt.id} type="checkbox" name={opt.id} className="option__input" checked={opt.checked} onChange={this.handleOptionChange.bind(this)}/>
                <label htmlFor={opt.id} className="option__label">{ opt.label }</label>
            </div>
        ));

        return (
            <div className="miyagi">
                <p className="extract__help">Read the extract below and let Miyagi know what you think the sentiment of the message is. There is no right or wrong answer, if you are unsure we'll send you another one. Be sure to read our <Link to="/introduction" className="link link--inline">Introduction to Miyagi</Link> before you begin.</p>
                <Extract text={this.state.extract}/>
                <Suggestions onSuggestion={this.handleSuggestion.bind(this)}>
                    { suggestions }
                </Suggestions>
                <Options>
                    { options }
                </Options>
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
