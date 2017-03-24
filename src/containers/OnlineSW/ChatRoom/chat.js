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
            shouldStop: false,  //是否停止
            stopped: false,     //是否停止了
            messages: [], //信息列表
            recording: false
        };

        this.style = require('./chat.scss');
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
                    //<button className={style['chat-voice-play']} onClick={this.playVoice}>播放</button>
                    //<button className={style['chat-voice-stop']} onClick={this.stopVoice}>停止</button>
                    list[index] = <li key={index}>
                        <audio src={URL.createObjectURL(new Blob(message.message))} controls="controls"/>
                    </li>;
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
                <li className="form-upload" onClick={this.recordStop}>停止语音</li>
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
                .then((stream) => {
                    const options = {mimeType: 'video/webm;codecs=vp9'};
                    const recordedChunks = [];
                    const mediaRecorder = new MediaRecorder(stream, options);

                    mediaRecorder.addEventListener('dataavailable', (e) => {
                        if (e.data.size > 0) {
                            recordedChunks.push(e.data);
                        }

                        console.log(this.state.shouldStop);
                        if(this.state.shouldStop === true && this.state.stopped === false) {
                            console.log('stopped');
                            mediaRecorder.stop();
                            this.state.stopped = true;
                        }
                    });

                    mediaRecorder.addEventListener('stop', () => {
                        let message = this.state.message;

                        message.type = 'voice';
                        message.date = new Date();
                        message.message = recordedChunks;

                        socket.emit('msg', message);
                    });

                    mediaRecorder.start();
                })
                .catch(function(err) {
                    console.log('The following gUM error occured: ' + err);
                });
        } else {
            console.log('getUserMedia not supported on your browser!');
        }
    };

    //停止录音
    recordStop = () => {
        this.setState({
            shouldStop: true
        });
        console.log('in');
    };

    //play the voice
    playVoice = () => {

    };

    //stop the voice
    stopVoice = () => {

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