
import React from 'react';

class Panel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            content: ''
        };
    }

    componentWillMount() {
        this.setState({
            content: this.props.content
        });
    }

    // 创建按钮组
    createButtons() {
        let bindData = this.props.bindData,
            operate = this.props.operate;
        let buttons = [];
        this.props.btnNames.map((name, index)=>{
            buttons.push(<button data-operate={operate?operate[index]:null} className="btn btn-default btn-lg pull-right"
                            key={index} data-index={bindData[index]} style={{marginLeft:'30px'}} >{name}</button>);
        });
        return buttons;
    }

    render() {

        return (
            <div className={"panel "+(this.props.panelClass?this.props.panelClass:"panel-default")}>
                {this.props.title?<div className="panel-heading">{this.props.title}</div>:''}
                <div className="panel-body">
                    {this.state.content}
                </div>
                {this.props.btnNames ?
                    <div className="panel-footer" style={{height: '55px'}}>
                        {this.createButtons()}
                    </div>:''
                }
            </div>
        );
    }
}

export default Panel;