import * as React from 'react';
import * as reqwest from 'reqwest';
import { LaRussoMeta, LaRussoPrediction } from '../../interfaces/LaRusso';
import LaRussoMetadata from './LaRussoMetadata';
import TextArea from './TextArea';
import Button from '../Button';

export interface LaRussoState {
    meta?: LaRussoMeta;
    submitting: boolean;
    positivePrediction?: number;
    negativePrediction?: number;
};

export default class LaRusso extends React.Component<{}, LaRussoState> {
    constructor (
        props
    ) {
        super(props);
        this.state = {
            submitting: false
        };
    }

    componentWillMount () {
        reqwest({
            url: 'larapi/meta',
            method: 'get'
        }).then((meta: string) => {
            const metadata = JSON.parse(meta);

            this.setState((state: LaRussoState) => state.meta = metadata);
        });
    }

    renderMetaData () {
        const loaded: boolean = this.state.meta !== undefined;

        return (
            <div className={`load ${loaded ? 'load--loaded' : 'load--loading'}`}>
                { loaded
                        ? <LaRussoMetadata version={this.state.meta.version} build={this.state.meta.build}/>
                        : <LaRussoMetadata version="..." build="..."/> }
            </div>
        )
    }

    renderPrediction () {
        const { positivePrediction, negativePrediction } = this.state;

        if (positivePrediction && negativePrediction) {
            return <pre>Positive: { positivePrediction } | Negative: { negativePrediction }</pre>;
        } else {
            return '';
        }
    }

    predict (event: Event) {
        const data = new FormData(event.target as HTMLFormElement);
        const extract = data.get('extract');

        event.preventDefault();
        this.setState((state: LaRussoState) => state.submitting = !state.submitting);
        reqwest({
            url: 'larapi/predict',
            type: 'json',
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ extract })
        }).then((prediction: LaRussoPrediction) => {
            this.setState({
                positivePrediction: prediction.positive,
                negativePrediction: prediction.negative
            });
        });
    }

    render () {
        return (
            <div className="larusso">
                { this.renderMetaData() }
                <form onSubmit={this.predict.bind(this)}>
                    <TextArea placeholder="Your text here...." name="extract" disabled={this.state.submitting}/>
                    <Button value="Analyse" modifiers={['button--primary']}/>
                </form>
                { this.renderPrediction() }
            </div>
        );
    }
}
