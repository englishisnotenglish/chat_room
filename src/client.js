import 'babel-polyfill'
import React from 'react';
import ReactDom from 'react-dom';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import io from 'socket.io-client';
import {Provide} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import {synHistoryWithStore} from 'react-router-redux';
import {ReduxAsyncConnect} from 'react-async-connect';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

import getRoutes from './routes';

const client = new ApiClinet();
const _browserHistory = userScroll(() => browserHistory);
const content = document.querySelector('#content');
const store = createStore(_browserHistory, client, window.__data);
const history = synHistoryWithStore(_browserHistory, store);

function initSocket(){
    const socket = io('', {path: '/ws'});
    socket.on('news', (data) => {
        console.log(data);
        socket.emit('my other event', { my: 'data from client' });
    });

    socket.on('msg', (data) => {
        console.log(data);
    });
    return socket;
}

global.socket = initSocket();

const component = (
    <Router render={
        <ReduxAsyncConnect {...props} helpers={{client}} filter={item => !item.deferred} />
    } history={history}>
        {getRoutes(store)}
    </Router>
);

ReactDom.render(
    <Provider store={store} key="provider">
        {component}
    </Provider>,
    content
);

//环境的配置
if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger

    if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
        console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
    }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
    const DevTools = require('./containers/DevTools/DevTools');
    ReactDOM.render(
        <Provider store={store} key="provider">
            <div>
                {component}
                <DevTools />
            </div>
        </Provider>,
        content
    );
}


