import React from 'react';
import Suggestions from './Suggestions';
import Button from './Button';
import Extract from './Extract';
import reqwest from 'reqwest';
import neutralIcon from '../../assets/neutral.png';
import negativeIcon from '../../assets/angry.png';
import positiveIcon from '../../assets/positive.png';
import unicornIcon from '../../assets/unicorn.png';

export default class Miyagi extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            extract: '',
            extractId: ''
        };

        this.suggestionMap = {
            positive: { handler: this.makeSuggestion.bind(this), icon: positiveIcon, value: 'Positive' },
            neutral: { handler: this.makeSuggestion.bind(this), icon: neutralIcon, value: 'Neutral' },
            negative: { handler: this.makeSuggestion.bind(this), icon: negativeIcon, value: 'Negative' },
            not_sure: { handler: this.makeSuggestion.bind(this), icon: unicornIcon, value: 'Not Sure' }
        };

        this.getExtract();
    }

    getExtract () {
        reqwest({
            url: 'http://localhost:4567/miyapi/extract',
            method: 'get'
        }).then(this.updateExtractFromResponse.bind(this));
    }

    makeSuggestion (key) {
        return new Promise (resolve => {
            reqwest({
                url: 'http://localhost:4567/miyapi/extract',
                method: 'post',
                data: { _id: this.state.extractId, value: key }
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
                <Button key={option} icon={this.suggestionMap[option].icon} value={this.suggestionMap[option].value}/>
            );

        return (
            <div className="miyagi">
                <Extract text={this.state.extract}/>
                <Suggestions onSuggestion={this.handleSuggestion.bind(this)}>
                    { options }
                </Suggestions>
            </div>
        )
    }
}
