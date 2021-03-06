import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {isLogin} from './redux/modules/login';
import {Login, App, User, AccountManage, Privilege, GeneralGoods, DailyTweets} from './containers';

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
                <Route path="/home/user" component={User} />
                <Route path="/home/management" component={AccountManage} />
                <Route path="/home/privilege" component={Privilege} />
                <Route path="/home/generalGoods" component={GeneralGoods} />
                <Route path="/home/dailyTweets" component={DailyTweets} />
            </Route>
        </Route>
    );
}
