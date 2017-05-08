import React from 'react';
/*
*按钮组
* btnNames: [],     //按钮的名字
* bindData: [],     //按钮绑定的数据
* clickCallBack: fn //按钮点击的回调
* style: ''         //按钮的的样式
* status: 1         //当前选择的按钮;
* activeStyle: string  //选择按钮的样式;
* */

/*<BtnGroup btnNames={btnNames} bindData={bindData} clickCallback={this.setCurrentArea.bind(this)}
          style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentAreaId}/>*/

class BtnGroup extends React.Component{
    constructor(){
        super();
    }

    static defaultProps = {
        style : '',
        bindData: [1, 2, 3, 4, 5, 6, 7, 8],
        status: 0
    };

    //创建按钮
    createButtons(){
        let bindData = this.props.bindData,
            style = this.props.style,
            status = this.props.status,
            activeStyle = this.props.activeStyle,
            operate = this.props.operate;
        let buttons = [];
        this.props.btnNames.map((name, index)=>{
            buttons.push(<a data-operate={operate?operate[index]:null} className={status != bindData[index]? style : activeStyle}
                            key={index} data-index={bindData[index]} href="javascript:;" >{name}</a>);
        });
        return buttons;
    }

    render(){
        return(
            <div style={{display: 'inline-block'}} onClick={this.props.clickCallback || null} className={this.props.identification} data-index={this.props.index}>
                {this.createButtons()}
            </div>
        );
    }
}
export default BtnGroup;
