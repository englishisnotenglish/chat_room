/*
* 可推送用户名单*/

import React from 'react';
import PageCtrlBar from '../../components/page/paging.js';

class ReceiveUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultParam: {  //获取列表提交的参数;
                page: 1,
                size: 40
            },
            totalPage: 1,   //总页数;
            AreaData: null,
            list: []   //数据列表;
        };
        this.getDataList = this.getDataList.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    componentWillMount() {
        this.getDataList();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.currentArea != this.state.AreaData) {
            this.setState({
                AreaData: nextProps.currentArea,
                defaultParam: {  //获取列表提交的参数;
                    page: 1,
                    size: 40
                }
            }, () => {
                this.getDataList();
            });
        }
    }

    getDataList() {
        let param = {
            area_id: this.props.currentArea.area_id,
            page: this.state.defaultParam.page,
            size: this.state.defaultParam.size
        };
        H.server.operate_dailyNews_receiveUser_list(param, (res) => {
            if(res.code == 0) {
                this.setState({
                    totalPage: Math.ceil(res.data.total/param.size),
                    list: res.data.user_info
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //对当前页面的设置;
    changePage(n) {
        let param = this.state.defaultParam,
            newParam = Object.assign(param, n);
        this.setState({defaultParam: newParam}, () => {
            this.getDataList();
        });
    }

    render() {
        return (
            <div className="section-table">
                <table className="table table-bordered table-hover table-responsive">
                    <thead>
                    <tr>
                        <th>用户ID</th>
                        <th>手机号</th>
                        <th>OpenID</th>
                        <th>微信名</th>
                        <th>店铺名</th>
                        <th>类型</th>
                        <th>记录时间</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.list.map((data, index) => {
                            return (
                                <tr key={index}>
                                    <td>{data.user_id}</td>
                                    <td>{data.user_tel}</td>
                                    <td>{data.wechat_openid}</td>
                                    <td>{data.wechat_name}</td>
                                    <td>{data.shop_name}</td>
                                    <td>{data.shop_type}</td>
                                    <td>{data.interact_time}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
                <PageCtrlBar pageNum={this.state.defaultParam.page}  maxPage={this.state.totalPage} clickCallback={this.changePage}/>
            </div>
        );
    }
}

export default ReceiveUserList;