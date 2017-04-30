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
        this.props.children || (
            <div>
                <form className="auth_form border">
                    <div className="box-row">
                        <label><i className="fa fa-user-circle-o fa-2x"></i>&nbsp;</label>
                        <input type="text" name="name" autofocus="autofocus" ref="name"
                               className="form-control input-inline flex-1" required/>
                    </div>

                    <div className="box-row">
                        <label><i className="fa fa-lock fa-3x"></i>&nbsp;</label>
                        <input type="password" name="pwd" ref="pwd"
                               className="form-control input-inline flex-1" required/>
                    </div>

                    <div>
                        <button type="submit" onClick={this.handleSubmit}
                                className="btn btn-primary btn-block" >
                            登录
                        </button>
                    </div>
                </form>
            </div>)
        );
    }
}