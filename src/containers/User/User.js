import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

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
            </div>
        );
    }

}