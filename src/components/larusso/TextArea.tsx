import * as React from 'react';

export interface TextArea {
    name: string;
    disabled: boolean;
    placeholder: string;
}

const TextArea: React.SFC<TextArea> = ({
    name,
    disabled,
    placeholder
}) => {
    return <textarea placeholder={placeholder} disabled={disabled} name={name} className="textarea"></textarea>;
};

export default TextArea;
