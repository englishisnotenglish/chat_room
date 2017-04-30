import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {isLogin} from './redux/modules/login';
import {Login, App, User, AccountManage} from './containers';

export default (store) => {
    const requireLogin = (nextState, replace, cb) => {

        const { login: { user }} = store.getState();
        if (!user) {
            //没有登录留在登录业
            replace('/');
            cb();
        }
        cb();
    };

    return (
        <Route path="/" component={Login}>
            <Route path="/home" component={App} onEnter={requireLogin}>
                <Route path="/home/user" component={User}/>
                <Route path="/home/department" component={AccountManage} />
            </Route>
        </Route>
    );
}
