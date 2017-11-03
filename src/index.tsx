import * as React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { BrowserRouter, Route } from 'react-router-dom';
import './style/index.scss';

render(
    <App/>,
    document.getElementById('miyagi')
);
