import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

@connect(state => ({
        user: state.login.user
    }))

export default class AccountManage extends Component{
    constructor(){
        super();
        //this.style = require('./user.scss');
    }

    static propTypes = {

    };

    //refresh
    render(){
        return(
            <div>
                这是另一个东西
                <input type="text" />
            </div>
        );
    }
}