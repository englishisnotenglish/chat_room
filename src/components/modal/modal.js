import React from "react";

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: true
        };
        this.confirmHandler = this.confirmHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
    }

    //确认按钮的回调事件;
    confirmHandler() {
        this.props.confirmCallback && this.props.confirmCallback();
    }

    //取消按钮的回调事件;
    cancelHandler() {
        this.props.cancelCallback && this.props.cancelCallback();
    }

    render() {
        let confirmBtn = '',
            cancelBtn = '';
        if(this.props.confirm) {
            confirmBtn = (<button className="modal-btn active" onClick={this.confirmHandler}>{this.props.confirm}</button>);
        }
        if(this.props.cancel) {
            cancelBtn = (<button className="modal-btn" onClick={this.cancelHandler}>{this.props.cancel}</button>);
        }
        return (
            <div className={this.state.status ? 'modal-wrap show' : 'modal-wrap'} >
                <div className="modal-mask-react"></div>
                <div className="modal-container" style={{width: this.props.width ? this.props.width : '350px'}}>
                    <div className="modal-head-react">
                        <i className="glyphicon close-icon" onClick={this.cancelHandler}></i>
                        {this.props.header ? this.props.header : '弹窗'}
                    </div>
                    <div className="modal-body-react">
                        {this.props.children}
                    </div>
                    <div className="modal-foot-react">
                        {confirmBtn}
                        {cancelBtn}
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;