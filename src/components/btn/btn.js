/**
 * Created by Administrator on 2016/2/1.
 * 按钮
 */
import React from 'react';

/*按钮组件;*/
class Btn extends React.Component {

    render() {
        return (
            <button className={"btn " + this.props.otherClass} onClick={this.props.btnEvent.bind(this)} >{this.props.name}</button>
        )
    }
}

export default Btn;