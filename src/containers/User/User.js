import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

@connect(state => ({
        user: state.login.user
    }))

export default class User extends Component{
    constructor(){
        super();
        this.style = require('./user.scss');
    }

    static propTypes = {
        user: PropTypes.object
    };

    //refresh
    render(){
        return(
            <div>
                <p>欢迎{this.props.user && this.props.user.name}</p>
                <p>年龄：21岁</p>
                <p>性别：男</p>
                <p>部门：开发</p>
                <p>登录权限：管理员</p>
            </div>
        );
    }

}