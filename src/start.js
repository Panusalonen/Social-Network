import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome';
import App from './app';
import Logo from './logo';
import { HashRouter, Route, Link, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import reducer from './reducers';
import {getSocket} from './socket';
const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

let elem;

if (location.pathname == '/welcome') {
    elem = <Welcome />;
} else {
    elem = (
        getSocket(store),
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(
    elem,
    document.querySelector('main')
);
