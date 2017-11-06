import * as React from 'react';
import * as reqwest from 'reqwest';

export interface statisticsState {
    percentageComplete: number;
    suggestionsSubmitted: number;
    totalExtracts: number;
    loaded: boolean;
}

export default class Statistics extends React.Component<{}, {}> {
    public state: statisticsState;

    constructor () {
        super();
        this.state = {
            percentageComplete: 0,
            suggestionsSubmitted: 0,
            totalExtracts: 0,
            loaded: false
        };

        this.getStatistics();
    }

    getStatistics () {
        reqwest({
            url: 'miyapi/statistics',
            method: 'get'
        }).then(res => {
            const { percentageComplete, suggestionsSubmitted, totalExtracts } = JSON.parse(res);

            this.setState({
                percentageComplete,
                suggestionsSubmitted,
                totalExtracts,
                loaded: true
            });
        });
    }

    render () {
        return (
            <div className="statistics">
                <p><strong>Progress</strong> { this.state.loaded ? `${this.state.suggestionsSubmitted}/${this.state.totalExtracts}` : '' }</p>
                <p><strong>Percentage</strong> { this.state.loaded ? `${this.state.percentageComplete}%` : '' }</p>
            </div>
        );
    }
}
