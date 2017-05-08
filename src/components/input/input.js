/**
 * Created by Administrator on 2016/7/4.
 * Hu Xiaoyu
 */

import React from 'react';

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    componentWillMount() {
        this.setState({value: this.props.value});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
    }

    changeHandler(e) {
        let val = e.target.value;
        this.setState({value: val});
        this.props.handler && this.props.handler(val);
    }

    render() {
        return (
            <input
                id={this.props.id ? this.props.id : ''}
                className={this.props.class ? this.props.class : ''}
                type={this.props.type} value={this.state.value}
                placeholder={this.props.placeholder ? this.props.placeholder : ''}
                onChange={this.changeHandler.bind(this)}
                disabled={this.props.disabled ? true : false}
            />
        );
    }
}

export default Input;