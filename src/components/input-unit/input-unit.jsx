/*
* input 后面带有文件的组件*/

import React from 'react';

/*
* props参数说明：
* param = {
*   style: {}, input的宽度，如果为false表示input自身的宽度;
*   type: '', input类型，默认text;
*   text: '', 后面跟的文字;
*   value: '', input框的值;
*   placeholder: ''  input的placeholder的值;
*   textStyle: {}  后面跟的文字的颜色;
*   identify: {}   识别码;父级中一个fn被多个input使用时可能需要这个来区分，执行回调时加在参数中;
* }
* changeHandler: fn  input 值改变时执行;
* */

class InputUnit extends React.Component {
    constructor(props) {
        super(props);
    }

    changeHandler(e) {
        this.props.changeHandler && this.props.changeHandler(this.props.param.identify, e);
    }

    render() {
        let param = this.props.param;
        return (
            <div className="form-control input-unit">
                <input
                    type={param.type ? param.type : 'text'}
                    placeholder={param.placeholder}
                    style={param.style ? param.style : {width: '100px'}}
                    value={param.value ? param.value : ''}
                    onChange={this.changeHandler.bind(this)}
                />
                <span className="unit-item" style={param.textStyle}>{param.text}</span>
            </div>
        );
    }
}

export default InputUnit;