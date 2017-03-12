import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

//@connect(
//    state => ({user: state.auth.user})
//)

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

        this.sendMessage = this.messageList.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }

    //聊天记录
    messageList(){
        let list = new Array(this.state.messages.length);
        this.state.messages.map((message, index)=>{
            list[index] = <li key="message.date">
                            {message.from}{message.message}
                        </li>;
        });
        return(
            <ul>
                {list}
            </ul>
        );
    }

    //功能区 发送图片 发送语音的
    functionalZone(){
        return(
            <ul>
                <li className="form-upload">
                    <a href="javascript:;">图片</a>
                    <input ref="pic" type="file" onChange={this.fileUpload}/>
                </li>

                <li className="form-upload">暂代</li>
            </ul>
        );

    }

    sendMessage(e){
        e.preventDefault();

    }

    fileUpload(e){
        console.log(e.target);
    }

    render(){
        return(
            <div>
                你好
                <form>
                    {this.messageList()}

                    {this.functionalZone()}

                    <button type="submit" onClick={this.sendMessage}></button>
                </form>
            </div>
        );

    }
}