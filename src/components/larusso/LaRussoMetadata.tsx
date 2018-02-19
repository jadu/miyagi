import * as React from 'react';
import { LaRussoMeta } from '../../interfaces/LaRusso';

const LaRussoMetadata: React.SFC<LaRussoMeta> = ({
    version,
    build
}) => {
    return (
        <div className="larusso-meta">
            <p className="larusso-meta__version"><strong>Version: </strong>{ version }</p>
            <p className="larusso-meta__build"><strong>Build: </strong>{ build }</p>
        </div>
    )
}

export default LaRussoMetadata;
