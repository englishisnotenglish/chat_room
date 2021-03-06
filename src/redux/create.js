import {createStore as _createStore, applyMiddleware, compose} from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import {routerMiddleware} from 'react-router-redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import loggerMiddleware from './middleware/loggerMiddleware'

export default function createStore(history, client, data){
    //根据路由展示分发不同的action
    const reduxRouterMiddleware = routerMiddleware(history);

    const middleware = [loggerMiddleware, createMiddleware(client), reduxRouterMiddleware, thunk];

    let finalCreateStore;

    if(__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__){
        const { persistState } = require('redux-devtools');
        const DevTools = require('../containers/DevTools/DevTools');
        finalCreateStore = compose(
            applyMiddleware(...middleware),
            window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
            persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
        )(_createStore);
    }else {
        finalCreateStore = applyMiddleware(...middleware)(_createStore);
    }

    const reducer = require('./modules/rootReducer');
    if(data){
        data.pagination = Immutable.fromJS(data.pagination);
    }

    const store = finalCreateStore(reducer, data);

    if(__DEVELOPMENT__ && module.hot){
        module.hot.accept('./modules/rootReducer', () => {
            store.replaceReducer(require('./modules/rootReducer'));
        });
    }

    return store;
}