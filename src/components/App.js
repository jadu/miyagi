import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Authentication from './Authentication';

export default () => (
    <BrowserRouter>
        <Route path="/" component={Authentication}/>
    </BrowserRouter>
)
