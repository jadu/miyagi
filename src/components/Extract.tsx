import * as React from 'react';
import Tombstone from './Tombstone';

export interface ExtractProps {
    text: string;
}

export default class Extract extends React.Component<ExtractProps> {
    replaceCharacters (text, original, replacement) {
        const re = new RegExp(`\\${original}`, 'gi');

        return text.replace(re, replacement);
    }

    render () {
        const parsedText = this.props.text.split(/\n/g)
            .map((line, index) =>
                <p key={line.slice(0, 5) + index} className="extract__copy">{ this.replaceCharacters(line, '*', '█') }</p>
            );

        return (
            <div className="extract">
                <div className="extract__container">
                    <div className="extract__text">
                        {
                            this.props.text.length
                                ? parsedText
                                : <Tombstone length={3}/>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
