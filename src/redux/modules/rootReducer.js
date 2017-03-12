import { combineReducers } from 'redux';
//import multireducer from 'multireducer';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
//import { pagination } from 'violet-paginator';

import chat from './chat';

export  default combineReducers({
    routing: routerReducer,
    reduxAsyncConnect,
    chat
});