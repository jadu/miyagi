import React from 'react';
import Suggestions from './Suggestions';
import Button from './Button';
import Extract from './Extract';
import reqwest from 'reqwest';

export default class Miyagi extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            extract: '',
            extractId: ''
        };

        this.suggestionMap = {
            positive: { handler: this.makeSuggestion.bind(this), icon: '😀', value: 'Positive' },
            neutral: { handler: this.makeSuggestion.bind(this), icon: '😐', value: 'Neutral' },
            negative: { handler: this.makeSuggestion.bind(this), icon: '😠', value: 'Negative' },
            not_sure: { handler: this.makeSuggestion.bind(this), icon: '🦄', value: 'Not Sure' }
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
        reqwest({
            url: 'http://localhost:4567/miyapi/extract',
            method: 'post',
            data: JSON.stringify({ _id: this.state.extractId, value: key })
        }).then(this.updateExtractFromResponse.bind(this));
    }

    updateExtractFromResponse (response) {
        const extract = JSON.parse(response);

        this.setState({
            extract: extract.extract.text,
            extractId: extract.extract._id
        });
    }

    handleSuggestion (key) {
        this.suggestionMap[key].handler(key);
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
