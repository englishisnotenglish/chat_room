import Express from 'express';
import Https from 'https';
import fs from 'fs';
import httpProxy from 'http-proxy';
import path from 'path';
import compression from 'compression';
import React from 'react';
import ReactDOM from 'react-dom/server';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import config from './config';
import PrettyError from 'pretty-error';
import { match } from 'react-router';
import { syncHistoryWithStore} from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer} from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from './routes';

//set api server
const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
var privateKey  = fs.readFileSync(path.resolve(__dirname, '../static/private.pem'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname, '../static/file.crt'), 'utf8');
var credentials = {key: privateKey, cert: certificate};
const server = new Https.Server(credentials, app);
const proxy = httpProxy.createProxyServer({
    target: targetUrl,
    ws: true
});

app.use(compression());
app.use(Express.static(path.join(__dirname, '..', 'static')));

app.use('/api', (req, res) => {
    proxy.web(req, res, {target: targetUrl});
});

app.use('/ws', (req, res) => {
    proxy.web(req, res, {target: targetUrl + '/ws'});
});

server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
});

//代理的错误监听
proxy.on('error', (error, req, res) => {
    let json;
    if (error.code !== 'ECONNRESET') {
        console.error('proxy error', error);
    }
    if (!res.headersSent) {
        res.writeHead(500, {'content-type': 'application/json'});
    }

    json = {error: 'proxy_error', reason: error.message};
    res.end(JSON.stringify(json));
});

app.use((req, res) => {
    if(__DEVELOPMENT__){
        // Do not cache webpack stats: the script file would change since
        // hot module replacement is enabled in the development env
        webpackIsomorphicTools.refresh();
    }

    const client = new ApiClient(req);
    const memoryHistory = createHistory(req.originalUrl);
    const store = createStore(memoryHistory, client);
    const history = syncHistoryWithStore(memoryHistory, store);

    function hydrateOnClient(){
        res.send('<!doctype html>\n' +
            ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
    }

    if(__DISABLE_SSR__){
        hydrateOnClient();
        return;
    }

    //这个是匹配地址
    match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
            res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
            console.error('ROUTER ERROR:', pretty.render(error));
            res.status(500);
            hydrateOnClient();
        } else if (renderProps) {
            loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
                const component = (
                    <Provider store={store} key="provider">
                        <ReduxAsyncConnect {...renderProps} />
                    </Provider>
                );

                res.status(200);

                global.navigator = {userAgent: req.headers['user-agent']};

                res.send('<!doctype html>\n' +
                    ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
            });
        } else {
            res.status(404).send('Not found');
        }
    });
});

//开启服务在端口
if (config.port) {
    server.listen(config.port, (err) => {
        if (err) {
            console.error(err);
        }
        console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
        console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
    });
} else {
    console.error('==>     ERROR: No PORT environment variable has been specified');
}




