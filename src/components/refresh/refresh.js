/**
 * Created by Administrator on 2016/2/1.
 * 按钮
 */

import React from 'react';

/*按钮组件;*/
class Refresh extends React.Component {
    constructor(props) {
        super(props);
        this.handler = this.handler.bind(this);
    }

    handler(e) {
        e.preventDefault();
        this.props.refreshEv && this.props.refreshEv();
    }

    render() {
        return (
            <a id="refreshBtn" className="refresh-btn" onClick={this.handler}>
                <i className="glyphicon glyphicon-refresh"></i>刷新
            </a>
        )
    }
}

export default Refresh;