import React from 'react';

export default function Help ({ shortcuts }) {
    return (
        <div className="help">
            <p className="help__heading">Keyboard Shortcuts</p>
            <div className="help__shortcuts">
            { shortcuts.map(shortcut => (
                <div key={shortcut.action} className="help__shortcut">
                    <div className="help__icon"><span className="help__code">{ shortcut.code }</span></div>
                    <div className="help__action">{ shortcut.action }</div>
                </div>
            )) }
            </div>
        </div>
    );
}
