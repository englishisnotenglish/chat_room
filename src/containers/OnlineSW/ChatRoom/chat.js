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
            messages: [], //信息列表
            recording: false
        };

        this.style = require('./chat.scss');
        this.record = null;
    }

    componentDidMount(){
        if (socket) {
            socket.on('msg', this.onMessageReceived);
        }
        //添加监听
        document.addEventListener( "plusready", this.onPlusReady, false );
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

                <li className="form-upload" onClick={this.startRecord}>语音</li>
                <li className="form-upload" onClick={this.stop}>停止语音</li>
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

    //语音的功能
    startRecord = () => {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia ({audio: true})
                .then(function(stream) {

                    // Create a MediaStreamAudioSourceNode
                    // Feed the HTMLMediaElement into it
                    var audioCtx = new AudioContext();
                    var source = audioCtx.createMediaStreamSource(stream);

                    // Create a biquadfilter
                    var biquadFilter = audioCtx.createBiquadFilter();
                    biquadFilter.type = "lowshelf";
                    biquadFilter.frequency.value = 1000;
                    biquadFilter.gain.value = 1;

                    // connect the AudioBufferSourceNode to the gainNode
                    // and the gainNode to the destination, so we can play the
                    // music and adjust the volume using the mouse cursor
                    source.connect(biquadFilter);
                    biquadFilter.connect(audioCtx.destination);

                    // Get new mouse pointer coordinates when mouse is moved
                    // then set new gain value
                })
                .catch(function(err) {
                    console.log('The following gUM error occured: ' + err);
                });
        } else {
            console.log('getUserMedia not supported on your browser!');
        }
    };

    stop = () => {
        this.setState({recording: false});
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