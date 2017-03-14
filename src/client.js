import 'babel-polyfill'
import React from 'react';
import ReactDom from 'react-dom';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import io from 'socket.io-client';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {ReduxAsyncConnect} from 'redux-async-connect';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

import getRoutes from './routes';

const client = new ApiClient();
const _browserHistory = useScroll(() => browserHistory)();
const content = document.getElementById('content');
const store = createStore(_browserHistory, client, window.__data);
const history = syncHistoryWithStore(_browserHistory, store);

//初始化socket
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
    <Router render={(props) =>
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

    if (!content || !content.firstChild || !content.firstChild.attributes || !content.firstChild.attributes['data-react-checksum']) {
        console.error('出问题了但是没有暂时不知道怎么解决');
    }

}

if (__DEVTOOLS__ && !window.devToolsExtension) {
    const DevTools = require('./containers/DevTools/DevTools');
    ReactDom.render(
        <Provider store={store} key="provider">
            <div>
                {component}
                <DevTools />
            </div>
        </Provider>,
        content
    );
}


