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

        this.style = require('./chat.scss');

        this.sendMessage = this.messageList.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }

    componentDidMount(){
        console.log(socket);
        if (socket) {
            //socket.on('msg', this.onMessageReceived);
            socket.emit('msg', '你好');
            //setTimeout(() => {
            //    socket.emit('history', {offset: 0, length: 100});
            //}, 100);
        }
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
        const style = this.style;
        return(
            <ul>
                <li className={style['pic-upload']}>
                    <i className={style['pic']}>图片</i>
                    <input ref="file" className={style['upload']}  type="file" onChange={this.fileUpload}/>
                </li>

                <li className="form-upload">暂代</li>
            </ul>
        );
    }

    sendMessage(e){
        e.preventDefault();

    }

    fileUpload(){
        const file = this.refs.file.files[0];
        const type = file.type;
        if(/image/.test(type)){

        }else {
            //alert('请上传正确的图片格式');
        }
    }

    render(){
        return(
            <div>
                <form>
                    {this.messageList()}

                    {this.functionalZone()}

                    <textarea rows="3" cols="20"></textarea>

                    <button type="submit" onClick={this.sendMessage}>发送</button>
                </form>
            </div>
        );
    }
}