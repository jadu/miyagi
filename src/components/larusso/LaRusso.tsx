import * as React from 'react';
import * as reqwest from 'reqwest';
import { LaRussoMeta } from '../../interfaces/LaRusso';
import LaRussoMetadata from './LaRussoMetadata';

export interface LaRussoState {
    meta?: LaRussoMeta;
};

export default class LaRusso extends React.Component<{}, LaRussoState> {
    constructor (
        props
    ) {
        super(props);
        this.state = {};
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
        if (this.state.meta !== undefined) {
            return <LaRussoMetadata version={this.state.meta.version} build={this.state.meta.build}/>
        } else {
            return '';
        }
    }

    render () {
        return (
            <div className="larusso">
                { this.renderMetaData() }
            </div>
        );
    }
}
