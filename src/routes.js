import React from 'react';
import {IndexRoute, Route} from 'react-router';

import {Chat} from './containers';

export default (store) => {
    const requireLogin = (nextState, replace, cb) => {
        function checkAuth() {
            const { auth: { user }} = store.getState();
            if (!user) {
                // oops, not logged in, so can't be here!
                replace('/');
            }
            cb();
        }

        if (!isAuthLoaded(store.getState())) {
            store.dispatch(loadAuth()).then(checkAuth);
        } else {
            checkAuth();
        }
    };
    return (
        <Route path="/" component={Chat}>
        </Route>
    );
}
