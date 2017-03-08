import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

@connect(
    state => ({user: state.auth.user})
)

export default class Chat extends Component{
    static propTypes = {
        user: PropTypes.object
    };

    constructor(props){
        super(props);
        this.state = {
            message: '', //单个信息
            messages: [] //信息列表
        };
    }
}