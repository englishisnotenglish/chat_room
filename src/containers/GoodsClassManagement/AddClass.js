import React from 'react';
import GoodsClassSelect from './../GoodsClassSelect.js';

/*
* props参数说明：
* data: {}       所有分类数据,
* param: {}      显示的信息,
* setParam: fn   设置添加分类需要提交的参数,
* _dataArr: []   如果是修改时，原来的所属分类数组,
* disabled: bool select是否可用;
* */

class AddClass extends React.Component {
    constructor(props) {
        super(props);
        this.setTypeId = this.setTypeId.bind(this);
    }

    //添加分类时输入分类名时的change事件;
    changeClassName(e) {
        let param = this.props.param;
        param.type_name = e.target.value;
        this.props.setParam(param);
    }

    //添加分类时输入关键词时的change事件;
    changeKeyword(e) {
        let param = this.props.param;
        param.type_keywords = e.target.value;
        this.props.setParam(param);
    }


    //设置商品分类;
    setTypeId(id) {
        let param = this.props.param;
        param.parent_id = id;
        this.props.setParam(param);
    }

    //上传文件的input=[type=file] change事件;
    chooseImg(e) {
        var url = e.target.files[0];
        var extention = url.name.substring(url.name.lastIndexOf('.')+1).toLowerCase();    // 获取选中照片后缀
        var allowExtention = '.jpg,.bmp,.gif,.png,.jpeg';
        var key = 'Public/Uploads/goodsTypeIcon/'+ (new Date).getTime() +''+Math.floor(Math.random()*10)+'.'+ extention; //file.name + (new Date).getTime() + '-';
        if(allowExtention.indexOf(extention) == -1) {
            H.Modal('仅支持'+allowExtention+'为后缀名的文件!');
            return ;
        }
        var POLICY_JSON = {
            'expiration': '2120-12-01T12:00:00.000Z',
            'conditions': [
                ['starts-with', key, ''],
                {'bucket': 'idongpin'},
                ['starts-with', url.type, ''],
                ['content-length-range', 0, 104857600]
            ]
        };
        var policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));

        H.server.other_oss_signature({signature_data: policyBase64}, (res) => {
            if(res.code == 0) {
                var signature = res.data.signature;
                H.server.other_oss_identity_data({}, (res) => {
                    if(res.code == 0) {
                        var access_id = res.data.access_id;
                        var fd = new FormData();
                        //alert(file.type);
                        fd.append('key', key);  //上传到的路径信息;
                        fd.append('Content-Type', url.type);  //文件类型;
                        fd.append('Content-Length', Math.round(url.size * 100 / 1024) / 100);  //文件大小KB;
                        fd.append('Content-Encoding', 'compress');  //压缩方式，这里为无压缩;
                        fd.append('OSSAccessKeyId', access_id);
                        fd.append('policy', policyBase64);  //参与签名的头信息;
                        fd.append('signature', signature);  //签名;
                        fd.append('file', url);  //需上传的文件对像;

                        var xhr = new XMLHttpRequest();
                        //上传百分比的计算，目前没有用，因为OSS没有返回上传过程的数据;
                        //xhr.upload.addEventListener("progress", uploadProgress, false);
                        //完成后的请求
                        xhr.addEventListener('load', () => {
                            let param = this.props.param;
                            param.type_pic_url = key;
                            this.props.setParam(param);
                        }, false);
                        //请求error
                        xhr.addEventListener('error', function() {
                            H.Modal('上传出现错误，您可以重新点击上传');
                        }, false);
                        //请求中断
                        xhr.addEventListener('abort', function() {
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

    render() {
        return (
            <div className="add-goods-class">
                <div className="form-inline">
                    <label className="control-label">所属分类：</label>
                    <GoodsClassSelect
                        data={this.props.data}
                        typeId={this.props.param.parent_id}
                        setTypeId={this.setTypeId}
                        _dataArr={this.props._dataArr}
                        disabled={this.props.disabled}
                    />
                </div>
                <div className="form-inline">
                    <label className="control-label">分类名：</label>
                    <input id="goods_type_name" type="text" className="form-control" value={this.props.param.type_name} onChange={this.changeClassName.bind(this)}/>
                </div>
                <div className="form-inline">
                    <label>关键词：</label>
                        <textarea id="goods_type_keywords" className="form-control" value={this.props.param.type_keywords} onChange={this.changeKeyword.bind(this)}>
                        </textarea>
                </div>
                <div className="form-inline">
                    <label>小图片：</label>
                    <label key={Math.random() + ''} htmlFor={'chooseClassIcon'+(this.props.typeId || '')} className="choose-class-icon-warp">
                        <input id={'chooseClassIcon'+(this.props.typeId || '')} className="choose-class-icon" type="file" onChange={this.chooseImg.bind(this)}/>
                        {this.props.param.type_pic_url ? <img style={{verticalAlign: 'top'}} src={'http://img.idongpin.com/'+this.props.param.type_pic_url} width="100%" height="100%" /> : <span>上传图片</span>}
                    </label>
                </div>
            </div>
        );
    }
}

export default AddClass;