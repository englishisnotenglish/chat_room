import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

//@connect(
//    state => ({user: state.auth.user})
//)

export default class Chat extends Component{

    //验证
    static propTypes = {
        user: PropTypes.object
    };

    constructor(props){
        super(props);
        this.state = {
            message: {
                date: '',
                from: '',
                message: '',
                type: ''
            }, //单个信息
            messages: [] //信息列表
        };

        this.style = require('./chat.scss');

    }

    componentDidMount(){
        if (socket) {
            socket.on('msg', this.onMessageReceived);
        }
    }

    componentWillUnmount() {
        if (socket) {
            socket.removeListener('msg', this.onMessageReceived);
        }
    }

    //聊天记录
    messageList(){
        let list = new Array(this.state.messages.length);
        const style = this.style;
        this.state.messages.map((message, index)=>{
            switch (message.type){
                case 'word':
                    list[index] = <li key={index}>
                                    {message.from}{message.message}
                                </li>;
                    break;
                case 'pic':
                    list[index] = <li key={index}>
                                    <img className={style['chat-pic']} src={message.message}/>
                                </li>;
                    break;

                case 'voice':
                    break;

            }
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

    //收到消息
    onMessageReceived = (message) => {
        const messages = this.state.messages;
        messages.push(message);
        this.setState({messages});
    };

    sendMessage = (event) => {
        event.preventDefault();

        const value = this.refs.textArea.value;
        let message = this.state.message;

        message.date = new Date();
        message.message = value;
        message.type = 'word';

        socket.emit('msg', this.state.message);

    };

    //图片上传
    fileUpload = () => {
        let pic;
        const file = this.refs.file.files[0],
               type = file.type;
        const imageFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        if(imageFilter.test(type)){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (event) => {
                let message = this.state.message;

                message.type = 'pic';
                message.date = new Date();
                message.message = event.target.result;

                socket.emit('msg', message);
            };
        }else {
            //alert('请上传正确的图片格式');
        }
        return pic;
    };

    render(){
        return(
            <div>
                <form onSubmit={this.sendMessage}>
                    {this.messageList()}

                    {this.functionalZone()}

                    <textarea ref="textArea" rows="3" cols="20"></textarea>

                    <button type="submit">发送</button>
                </form>
            </div>
        );
    }
}