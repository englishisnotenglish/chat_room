import React from 'react';

class EditImage extends React.Component{

    constructor(){
        super();
        this.state = {
            croppedImg: '',
            source: '',
            upload: 1,   //1为原图上传 2为裁剪过后上传
            isClick: false
        };
    }

    componentWillMount(){
        if($('#cropper').length <= 0){
            let scriptStr = '<script id="cropper" src="/js/cropper.min.js"></script>';
            $('body').append(scriptStr);
        }
        if($('#cropper_style').length <= 0){
            let scriptStr = '<link id="cropper_style" href="/css/cropper.min.css" rel="stylesheet">';
            $('head').append(scriptStr);
        }
        if($('#mybase64').length <= 0){
            let scriptStr = '<script id="mybase64" src="/js/mybase64.js"></script>';
            $('body').append(scriptStr);
        }
    }

    componentDidMount(){
        $('.avatar-btns').delegate('.col-md-9', 'click', function(e){
            let target = e.target.dataset;
            let method = target.method;
            let option = target.option;
            $('#img').cropper(method, option);
        });
        $('.loading').hide();
        this.init();
    }

    //当组件移除时删除绑定的所有事件
    componentWillUnmount(){
        $('#img').unbind();
    }

    //根据props初始界面
    init(e){
        let src = this.props.imgURL || '';
        let $img = $('#img');
        let state = this.state;
        if(src){
            state.upload = 2;
            $img.attr('src', H.cdn + src);
        }
        $img.cropper({
            viewModal: 2,
            crop: function (e) {
                var json = [
                    '{"x":' + e.x,
                    '"y":' + e.y,
                    '"height":' + e.height,
                    '"width":' + e.width,
                    '"rotate":' + e.rotate + '}'
                ];
                json = json.join();
            }
        });
        if(e) e.stopPropagation();
        //document.getElementById('img').onload = () =>{
        //    img.cropper({
        //        viewModel: 2,
        //        crop: () => {
        //            let state = this.state;
        //            let largeSrc = '',
        //                midSrc = '',
        //                smSrc = '';
        //            let $img = $('#img');
        //            largeSrc = $img.cropper('getCroppedCanvas');
        //            state.croppedImg = largeSrc;
        //            largeSrc = largeSrc.toDataURL('image/png');
        //            midSrc = $img.cropper('getCroppedCanvas').toDataURL('image/png');
        //            smSrc = $img.cropper('getCroppedCanvas').toDataURL('image/png');
        //            $('.preview-lg').html('<img src=' + largeSrc + '>');
        //            $('.preview-md').html('<img src=' + midSrc + '>');
        //            $('.preview-sm').html('<img src=' + smSrc + '>');
        //        }
        //    });
        //};
    }

    //获得剪切的图片
    getCroppedCanvas(e){
        let state = this.state,
            height = e.height,
            width = e.width;
        //let largeSrc = '',
        //    midSrc = '',
        //    smSrc = '';
        let $img = $('#img');
        state.croppedImg = $img.cropper('getCroppedCanvas', {width: width, height: height});
        //largeSrc = largeSrc.toDataURL('image/png');
        //midSrc = $img.cropper('getCroppedCanvas', {width:width/2, height: height/2}).toDataURL('image/png');
        //smSrc = $img.cropper('getCroppedCanvas', {width:width/4, height: height/4}).toDataURL('image/png');
        //$('.preview-lg').html('<img src=' + largeSrc + '>');
        //$('.preview-md').html('<img src=' + midSrc + '>');
        //$('.preview-sm').html('<img src=' + smSrc + '>');
    }

    //上传图片
    uploadFile(){
        let file = document.getElementById('avatarInput').files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        $('#img').cropper('destroy');
        $('#img').remove();
        reader.onload = (e) => {
            this.setState({
                source: e.target.result
            }, this.update);
        };
    }

    //上传后更新界面
    update(){
        let $img = '';
        let img = new Image();
        let src = H.cdn + this.props.imgURL;
        $(img).attr('id', 'img');
        $img = $('#img');
        img.src = this.state.source || src;
        $('.avatar-wrapper').append(img);

        $img.cropper({
            viewModal: 2
        });
    }

    closeModal(){
        this.props.closeModal && this.props.closeModal();
    }

    crop(e){
        let state = this.state;
        state.upload = 2;
        this.init(e);
    }

    uploadNature(){
        let that = this;
        let url = document.getElementById('avatarInput').files[0];
        let extention = url.name.substring(url.name.lastIndexOf('.')+1).toLowerCase();    // 获取选中照片后缀
        let allowExtention = '.jpg,.bmp,.gif,.png,.jpeg';
        let key = 'Public/Uploads/newgoodsimg/'+H.Date.getFullYear()+H.Date.getMonth()+H.Date.getDate()+'/'+ (new Date).getTime() +''+Math.floor(Math.random()*10)+'.'+ extention;
        if(allowExtention.indexOf(extention) == -1) {
            H.Modal('仅支持'+allowExtention+'为后缀名的文件!');
            return ;
        }
        let POLICY_JSON = {
            'expiration': '2120-12-01T12:00:00.000Z',
            'conditions': [
                ['starts-with', key, ''],
                {'bucket': 'idongpin'},
                ['starts-with', url.type, ''],
                ['content-length-range', 0, 104857600]
            ]
        };
        $('.loading').show();
        let policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));

        H.server.other_oss_signature({signature_data: policyBase64}, (res) => {
            if(res.code == 0) {
                let signature = res.data.signature;
                H.server.other_oss_identity_data({}, (res) => {
                    if(res.code == 0) {
                        let access_id = res.data.access_id;
                        let fd = new FormData();
                        fd.append('key', key);  //上传到的路径信息;
                        fd.append('Content-Type', url.type);  //文件类型;
                        fd.append('Content-Length', Math.round(url.size * 100 / 1024) / 100);  //文件大小KB;
                        fd.append('Content-Encoding', 'compress');  //压缩方式，这里为无压缩;
                        fd.append('OSSAccessKeyId', access_id);
                        fd.append('policy', policyBase64);  //参与签名的头信息;
                        fd.append('signature', signature);  //签名;
                        fd.append('file', url);  //需上传的文件对像;
                        let xhr = new XMLHttpRequest();
                        xhr.addEventListener('load', () => {
                            H.Modal('成功');
                            that.props.setNewImgUrl && that.props.setNewImgUrl(that.props.imgObj, that.props.status, key);
                        }, false);
                        //请求error
                        xhr.addEventListener('error', function() {
                            that.setState({
                                isClick: !that.state.isClick
                            });
                            that.props.setNewImgUrl && that.props.setNewImgUrl(that.props.imgObj, that.props.status, key);
                            H.Modal('上传出现错误，您可以重新点击上传');
                        }, false);
                        //请求中断
                        xhr.addEventListener('abort', function() {
                            that.setState({
                                isClick: !that.state.isClick
                            });
                            that.props.setNewImgUrl && that.props.setNewImgUrl(that.props.imgObj, that.props.status, key);
                            H.Modal('上传中断，请检查网络后重新上传');
                        }, false);
                        //发送请求
                        xhr.open('POST', 'http://oss-cn-qingdao.aliyuncs.com/idongpin', true);
                        xhr.send(fd);
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }
    
    //修完图后提交
    submit(){
        let that = this;
        let file = document.getElementById('avatarInput').files[0];
        let croppedImg = this.state.croppedImg;
        let url = file ? file.name : this.props.imgURL ;
        let extention = url.substring(url.lastIndexOf('.')+1).toLowerCase();    // 获取选中照片后缀
        let allowExtention = '.jpg,.bmp,.gif,.png,.jpeg';
        let key = 'Public/Uploads/newgoodsimg/'+H.Date.getFullYear()+H.Date.getMonth()+H.Date.getDate()+'/'+ (new Date).getTime() +''+Math.floor(Math.random()*10)+'.'+ extention; //file.name + (new Date).getTime() + '-';
        if(!url){
            return;
        }
        if(!this.state.isClick){
            this.setState({
                isClick: !this.state.isClick
            });
        }else{
            return;
        }
        $('.loading').show();
        if(this.state.upload == 1){
            this.uploadNature();
            return;
        }
        if(allowExtention.indexOf(extention) == -1) {
            H.Modal('仅支持'+allowExtention+'为后缀名的文件!');
            return ;
        }
        let POLICY_JSON = {
            'expiration': '2120-12-01T12:00:00.000Z',
            'conditions': [
                ['starts-with', key, ''],
                {'bucket': 'idongpin'},
                ['starts-with', 'image/'+extention, ''],
                ['content-length-range', 0, 104857600]
            ]
        };
        let policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));

        H.server.other_oss_signature({signature_data: policyBase64}, (res) => {
            if(res.code == 0) {
                let signature = res.data.signature;
                H.server.other_oss_identity_data({}, (res) => {
                    if(res.code == 0) {
                        let access_id = res.data.access_id;
                        let fd = new FormData();
                        //alert(file.type);
                        fd.append('key', key);  //上传到的路径信息;
                        fd.append('Content-Type', 'image/' + extention);  //文件类型;
                        fd.append('Content-Encoding', 'compress');  //压缩方式，这里为无压缩;
                        fd.append('OSSAccessKeyId', access_id);
                        fd.append('policy', policyBase64);  //参与签名的头信息;
                        fd.append('signature', signature);  //签名;
                        croppedImg = $('#img').cropper('getCroppedCanvas');
                        croppedImg.toBlob(function (blob) {
                            let xhr = new XMLHttpRequest();
                            fd.append('Content-Length', Math.round(blob.size * 100 / 1024) / 100);  //文件大小KB;
                            fd.append('file', blob);  //需上传的文件对像;

                            //完成后的请求
                            xhr.addEventListener('load', () => {
                                H.Modal('成功');
                                that.props.setNewImgUrl && that.props.setNewImgUrl(that.props.imgObj, that.props.status, key);
                            }, false);
                            //请求error
                            xhr.addEventListener('error', function() {
                                that.setState({
                                    isClick: !that.state.isClick
                                });
                                that.props.setNewImgUrl && that.props.setNewImgUrl(that.props.imgObj, that.props.status, key);
                                H.Modal('上传出现错误，您可以重新点击上传');
                            }, false);
                            //请求中断
                            xhr.addEventListener('abort', function() {
                                that.setState({
                                    isClick: !that.state.isClick
                                });
                                that.props.setNewImgUrl && that.props.setNewImgUrl(that.props.imgObj, that.props.status, key);
                                H.Modal('上传中断，请检查网络后重新上传');
                            }, false);
                            //发送请求
                            xhr.open('POST', 'http://oss-cn-qingdao.aliyuncs.com/idongpin', true);
                            xhr.send(fd);
                        }, 'image/jpeg', 0.7);
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    /*
    * <div className="col-md-3">
     <div className="avatar-preview preview-lg"></div>
     <div className="avatar-preview preview-md"></div>
     <div className="avatar-preview preview-sm"></div>
     </div>
    *
    * */
    render(){
        return(
            <div className="crop-avatar" id="crop-avatar">
                <div className="modal show" id="avatar-modal" >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-img-content container">
                            <div className="avatar-form" >
                                <div className="modal-img-header">
                                    <button type="button" className="close" data-dismiss="modal" onClick={this.closeModal.bind(this)}>&times;</button>
                                    <h4 className="modal-title" id="avatar-modal-label">修图</h4>
                                </div>
                                <div className="modal-img-body">
                                    <div className="avatar-body">

                                        <div className="avatar-upload">
                                            <input type="hidden" className="avatar-src" name="avatar_src" />
                                                <input type="hidden" className="avatar-data" name="avatar_data" />
                                                    <label htmlFor="avatarInput">Local upload</label>
                                                    <input type="file" className="avatar-input" id="avatarInput" onChange={this.uploadFile.bind(this)}/>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-9">
                                                <div className="avatar-wrapper">
                                                    <img id="img" src=""/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row avatar-btns">
                                            <div className="col-md-9">
                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-default btn-sm" data-method="rotate" data-option="-90" title="Rotate -90 degrees">左旋</button>
                                                    <button type="button" className="btn btn-default btn-sm" data-method="rotate" data-option="-15">-15deg</button>
                                                    <button type="button" className="btn btn-default btn-sm" data-method="rotate" data-option="-30">-30deg</button>
                                                    <button type="button" className="btn btn-default btn-sm" data-method="rotate" data-option="-45">-45deg</button>
                                                </div>
                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-default btn-sm" data-method="rotate" data-option="90" title="Rotate 90 degrees">右旋</button>
                                                    <button type="button" className="btn btn-default btn-sm" data-method="rotate" data-option="15">15deg</button>
                                                    <button type="button" className="btn btn-default btn-sm" data-method="rotate" data-option="30">30deg</button>
                                                    <button type="button" className="btn btn-default btn-sm" data-method="rotate" data-option="45">45deg</button>
                                                </div>
                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-default btn-sm" onClick={this.crop.bind(this)}>裁剪</button>
                                                </div>
                                            </div>

                                            <div className="col-md-3">
                                                <button onClick={this.submit.bind(this)} className="btn btn-default btn-sm avatar-save">确定</button>
                                                <a className="glyphicon loading"></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditImage;