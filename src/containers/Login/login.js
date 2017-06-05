import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as authActions from '../../redux/modules/login';
import {History} from 'react-router'

@connect(
    state => ({user: state.login.user}),
    authActions)

export default class Login extends Component{
    constructor(){
        super();
        this.style = require('./login.scss');
    }

    static propTypes = {
        user: PropTypes.object,
        login: PropTypes.func,
        load: PropTypes.func
    };

    handleSubmit = (e)=>{
        e.preventDefault();
        const name = this.refs.name.value,
            pwd = this.refs.pwd.value;

        this.props.login({
            name: name,
            pwd: pwd
        }).then((result) => {
            if(result){
                this.props.load();
                this.props.history.pushState(null, '/home');
            }
        });
    };

    //渲染
    render(){
        return(
        this.props.children ||
        <div className="login-page">
            <form className="form-signin">
                <h3 className="form-signin-heading"><i className="left"></i>内部OA系统<i className="right"></i></h3>
                <div className="input-wrap">
                    <h4 className="header">
                        登录 <span>·</span> LOG IN
                    </h4>
                    <div className="input-content">
                        <div className="form-group">
                            <label for="username">账户名：</label>
                            <div className="input-box">
                                <input ref="name" type="text" id="username" className="form-control" placeholder="账户名"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="password">密码：</label>
                            <div className="input-box">
                                <input ref="pwd" type="password" id="password" className="form-control" placeholder="密码"/>
                            </div>
                        </div>
                        <div id="prompt" className="prompt">密码错误！请重新填写</div>
                        <button className="loginBtn" onClick={this.handleSubmit}>登录</button>
                    </div>
                </div>
            </form>
            <footer className="copy">
                毕业设计项目，仅供学习和交流，不可以作为其他用途
            </footer>
        </div>
        );
    }
}