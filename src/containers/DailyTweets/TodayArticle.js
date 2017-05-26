import React from 'react';

class TodayArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todayArticleList: [],   //今日推文列表;
            todayArticleType: [],   //推文类型;
            AreaData: null  //当前地区;
        };
        this.pic = require('../../images/default-article.png');
        this.getTodayArticle = this.getTodayArticle.bind(this);
    }

    componentWillMount() {
        this.getTodayArticle();
        //推文类型获取;
        H.server.other_todayArticle_type({}, (res) => {
            if(res.code == 0) {
                this.setState({todayArticleType: res.data});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        if($('#mybase64').length <= 0){
            let scriptStr = '<script id="mybase64" src="/js/mybase64.js"></script>';
            $('body').append(scriptStr);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.currentArea != this.state.AreaData) {
            this.setState({
                AreaData: nextProps.currentArea
            }, () => {
                this.getTodayArticle();
            });
        }
    }

    //今日推文列表获取;
    getTodayArticle() {
        let param = {
            area_id: this.props.currentArea.area_id
        };
        H.server.operate_todayArticle_list(param, (res) => {
            if(res.code == 0) {
                this.setState({todayArticleList: res.data});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
            H.editSave = false;
        });
    }

    //改变文章类型;
    changeArticleType(index, e) {
        let data = this.state.todayArticleList,
            val = e.target.value;
        for(let i in data) {
            if(data[i].article_type == val){
                H.Modal('每一条的类型不能重复');
                return;
            }
        }
        data[index].article_type = val;
        this.setState({todayArticleList: data});
    }

    //修改文章标题;
    changeArticleTitle(index, e) {
        let data = this.state.todayArticleList,
            val = e.target.value;
        data[index].article_title = val;
        this.setState({todayArticleList: data});
    }

    //推文置顶;
    placedTop(index) {
        let data = this.state.todayArticleList;
        let thisItemData = data[index];
        data.splice(index, 1);
        data.unshift(thisItemData);
        this.setState({todayArticleList: data});
    }

    //删除推文;
    tweetsDel(articleId, index) {
        if(H.editSave) return;
        H.editSave = true;
        if(articleId == 0) {
            let data = this.state.todayArticleList;
            data.splice(index, 1);
            this.setState({todayArticleList: data});
            return;
        }
        H.server.operate_todayArticle_delete({article_id: articleId}, (res) => {
            if(res.code == 0) {
                let data = this.state.todayArticleList;
                data.splice(index, 1);
                this.setState({todayArticleList: data});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
            H.editSave = false;
        });
    }

    //添加推文;
    addArticle() {
        let data = this.state.todayArticleList,
            type = this.state.todayArticleType;
        if(data.length == type.length) {
            H.Modal('最多'+this.state.todayArticleType.length+'条，每一条的类型不能重复');
            return;
        }

        let newArticle = {
                'area_id': this.props.currentArea.area_id,
                'article_id': 0,
                'article_type': 0,
                'article_title': '',
                'article_image': ''
            };
        data.push(newArticle);
        this.setState({todayArticleList: data});
    }

    //保存推文;
    saveArticle() {
        if(H.editSave) return;
        H.editSave = true;
        let param = {
            data: JSON.stringify(this.state.todayArticleList)
        };
        H.server.operate_todayArticle_edit(param, (res) => {
            if(res.code == 0) {
                H.Modal('保存成功');
                this.getTodayArticle();
            }else if(res.code == 10106) {
                H.overdue();
                H.editSave = false;
            }else {
                H.Modal(res.message);
                H.editSave = false;
            }
        });
    }

    //上传文件的input=[type=file] change事件;
    fileChange(index, e) {
        var url = e.target.files[0];
        var extention = url.name.substring(url.name.lastIndexOf('.')+1).toLowerCase();    // 获取选中照片后缀
        var allowExtention = '.jpg,.bmp,.gif,.png,.jpeg';
        var key = 'Public/Uploads/oa-article/'+ (new Date).getTime() +''+Math.floor(Math.random()*10)+'.'+ extention; //file.name + (new Date).getTime() + '-';
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
                            let data = this.state.todayArticleList;
                            data[index].article_image = key;
                            this.setState({todayArticleList: data});
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
            <div className="section-table">
                <div className="tweets-edit">
                    <h1 className="tweets-edit-title">推文编辑区</h1>
                    <div className="tweets-edit-wrap">
                        <div className="tweets-edit-ul-wrap">
                            <ul className="tweets-edit-ul">

                                {
                                    this.state.todayArticleList.map((data, index) => {
                                        if(index == 0) {
                                            return (
                                                <li key={index}>
                                                    <div className="first-tweets-img-wrap">
                                                        <img className="first-tweets-img" src={this.pic} width="100%" height="162" />
                                                        <input className="up-img" type="file" onChange={this.fileChange.bind(this, index)}/>
                                                    </div>
                                                    <div className="first-input-wrap">
                                                        <input type="text" className="first-input" value={data.article_title} onChange={this.changeArticleTitle.bind(this, index)}  />
                                                    </div>
                                                    <div className="article-type">
                                                        <select className="form-control" value={data.article_type} onChange={this.changeArticleType.bind(this, index)}>
                                                            <option key='0' value='0'>请选择</option>
                                                            {
                                                                this.state.todayArticleType.map((val, index1) => {
                                                                    return (<option key={data.article_id + '_' + index1} value={val.id}>{val.name}</option>);
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    <i className="tweets-del glyphicon glyphicon-minus" onClick={this.tweetsDel.bind(this, data.article_id, index)}></i>
                                                </li>
                                            );
                                        }else {
                                            return (
                                                <li key={index}>
                                                    <div className="tweets-input-trap">
                                                        <textarea className="tweets-input" rows="2" value={data.article_title} onChange={this.changeArticleTitle.bind(this, index)}></textarea>
                                                    </div>
                                                    <div className="tweets-img-wrap">
                                                        <img className="tweets-img" src={this.pic} width="55px" height="55px" />
                                                        <input className="up-img" type="file" onChange={this.fileChange.bind(this, index)}/>
                                                    </div>
                                                    <div className="article-type">
                                                        <select className="form-control" value={data.article_type} onChange={this.changeArticleType.bind(this, index)}>
                                                            <option key='0' value='0'>请选择</option>
                                                            {
                                                                this.state.todayArticleType.map((val, index1) => {
                                                                    return (<option key={data.article_id + '_' + index1} value={val.id}>{val.name}</option>);
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    <i className="placed-top glyphicon glyphicon-circle-arrow-up" onClick={this.placedTop.bind(this, index)}></i>
                                                    <i className="tweets-del glyphicon glyphicon-minus" onClick={this.tweetsDel.bind(this, data.article_id, index)}></i>
                                                </li>
                                            );
                                        }
                                    })
                                }
                            </ul>
                        </div>
                        <btn className="tweets-save-btn" onClick={this.saveArticle.bind(this)}>保存</btn>
                        <btn className="tweets-add-btn" onClick={this.addArticle.bind(this)}>添加</btn>
                    </div>
                </div>
            </div>
        );
    }
}

export default TodayArticle;