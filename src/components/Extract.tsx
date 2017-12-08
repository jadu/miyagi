import * as React from 'react';

function replaceCharacters (text, original, replacement) {
    const re = new RegExp(`\\${original}`, 'gi');

    return text.replace(re, replacement);
}

export interface ExtractProps {
    text: string;
}

export default function Extract ({ text }: ExtractProps) {
    const tombStoneOrText = text.length ? text : '\n\n';
    const parsedText = tombStoneOrText.split(/\n/g)
        .map((line, index) =>
            <p key={line.slice(0, 5) + index} className={`extract__copy${line.trim().length ? '' : ' tombstone'}`}>{ replaceCharacters(line, '*', '█') }</p>
        );


    console.log(parsedText);

    return (
        <div className="extract">
            <div className="extract__container">
                <div className="extract__text">
                    { parsedText }
                </div>
            </div>
        </div>
    )
}
