import * as React from 'react';

interface tombstoneProps {
    length: number;
}

export default function Tombstone ({ length }: tombstoneProps) {
    const tomb = [];

    for (let i = 0; i < length; i++) {
        tomb.push(<p key={i} className="extract__copy tombstone"></p>);
    }

    return <div>{ tomb }</div>;
}
