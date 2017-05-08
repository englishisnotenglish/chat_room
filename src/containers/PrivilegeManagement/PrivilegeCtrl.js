import React from 'react';
import Refresh from '../../components/refresh/refresh.js';

class PrivilegeManagementCtrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],   //用户列表数据;
            oneNav: [],
            twoNav: [],
            infoPanel: {    //附体部分状态及标题;
                infoPanelIsShow: false,
                infoPanelTitle: '',
                status: 1
            },
            infoItem: {  //需要提交的数据;
                parent_id: 1,
                privilege_name: '',
                privilege_tag: '',
                navigate_rank: 0,
                route: '',
                remark: ''
            }
        };
        this.getDataList = this.getDataList.bind(this);
        this.createDom = this.createDom.bind(this);
    }

    componentDidMount() {
        this.getDataList();
    }

    //获取获取;
    getDataList() {
        H.server.privilege_list({}, (res) => {
            if(res.code == 0) {
                let navigates = res.data.navigates,
                    oneNav = [],
                    twoNav = [],
                    initIndex = Object.keys(navigates[1])[0];
                for(var i of Object.keys(navigates[1])) {
                    oneNav.push(navigates[1][i]);
                }
                if(navigates[2][initIndex]) {
                    for(var n of Object.keys(navigates[2][initIndex])){
                        twoNav.push(navigates[2][initIndex][n]);
                    }
                }
                this.setState({data: res.data, oneNav: oneNav, twoNav: twoNav});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //隐藏附体部分;
    hideInfoPanel(){
        this.setState({
            infoPanel: {infoPanelIsShow: false, infoPanelTitle: '', status: 1}
        });
    }

    createDom() {
        let navigates = this.state.data.navigates,
            privilege = this.state.data.execute_privilege,
            oneXml = [];
        for(var oneObj of navigates[1]) {
            let i = oneObj.id;
            oneXml.push(<tr key={'hr_' + i} className="hr-tr"><td colSpan="4"></td></tr>);
            oneXml.push(
                <tr key={i} className="one">
                    <td>{oneObj.id}</td>
                    <td>{oneObj.name}</td>
                    <td>{oneObj.privilege_tag}</td>
                    <td>
                        <a onClick={this.modifyPrivilege.bind(this, oneObj.id)}>修改</a>
                    </td>
                </tr>
            );

            if(navigates[2] && navigates[2][i]) {
                for(var twoObj of navigates[2][i]){
                    let n = twoObj.id;
                    oneXml.push(
                        <tr key={i + '_' + n} className="two">
                            <td>{twoObj.id}</td>
                            <td>{twoObj.name}</td>
                            <td>{twoObj.privilege_tag}</td>
                            <td>
                                <a onClick={this.modifyPrivilege.bind(this, twoObj.id)}>修改</a>
                            </td>
                        </tr>
                    );
                    if(privilege != '' && privilege[i]){
                        if(privilege[i][n]) {
                            for(var itemObj of privilege[i][n]) {
                                let k = itemObj.id;
                                oneXml.push(
                                    <tr key={i + '_' + n + '_' + k}>
                                        <td>{itemObj.id}</td>
                                        <td>{itemObj.name}</td>
                                        <td>{itemObj.privilege_tag}</td>
                                        <td>
                                            <a onClick={this.modifyPrivilege.bind(this, itemObj.id)}>修改</a>
                                        </td>
                                    </tr>
                                );
                            }
                        }
                    }

                }
            }
        }
        return oneXml;
    }

    //点击添加权限按钮;
    addPrivilege() {
        this.setState({
            infoPanel: {infoPanelIsShow: true, infoPanelTitle: '添加权限', status: 1}
        });
    }

    //提交添加一级菜单按钮;
    addOnePrivilege() {
        let param = {
            parent_id: 0,
            privilege_name: $('#one_username').val(),
            privilege_tag: $('#one_tag').val(),
            navigate_rank: 1,
            route: $('#one_route').val(),
            remark: $('#one_remark').val()
        };
        H.server.privilege_add(param, (res) => {
            if(res.code == 0) {
                $('#one_username').val('');
                $('#one_tag').val('');
                $('#one_route').val('');
                $('#one_remark').val('');
                H.Modal(res.message);
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //提交添加二级菜单按钮;
    addTwoPrivilege() {
        let param = {
            parent_id: $('#two_parent').val(),
            privilege_name: $('#two_username').val(),
            privilege_tag: $('#two_tag').val(),
            navigate_rank: 2,
            route: $('#two_route').val(),
            remark: $('#two_remark').val()
        };
        H.server.privilege_add(param, (res) => {
            if(res.code == 0) {
                $('#two_username').val('');
                $('#two_tag').val('');
                $('#two_route').val('');
                $('#two_remark').val('');
                H.Modal(res.message);
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //提交添加功能权限按钮;
    addRankPrivilege() {
        let param = {
            parent_id: $('#rank_tow_parent').val(),
            privilege_name: $('#rank_username').val(),
            privilege_tag: $('#rank_tag').val(),
            navigate_rank: 0,
            route: $('#rank_route').val(),
            remark: $('#rank_remark').val()
        };
        H.server.privilege_add(param, (res) => {
            if(res.code == 0) {
                $('#rank_username').val('');
                $('#rank_tag').val('');
                $('#rank_route').val('');
                $('#rank_remark').val('');
                H.Modal(res.message);
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //修改权限;
    modifyPrivilege(id) {
        H.server.privilege_info({id: id}, (res) => {
            if(res.code == 0) {
                let data = res.data;
                data.id = id;
                this.setState({
                    infoItem: data,
                    infoPanel: {infoPanelIsShow: true, infoPanelTitle: '修改权限', status: 2}
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //修改功能权限时选择一级菜单找出对应该的二级菜单;
    oneSelChange(e) {
        let oneParentId = e.target.value,
            navigates = this.state.data.navigates,
            twoNav = [];
        for(var n of Object.keys(navigates[2][oneParentId])){
            twoNav.push(navigates[2][oneParentId][n]);
        }
        this.setState({twoNav: twoNav});
    }

    privilegeNameChange(e) {
        let info = this.state.infoItem;
        info.privilege_name = e.target.value;
        this.setState({infoItem: info});
    }

    urlChange(e) {
        let info = this.state.infoItem;
        info.url = e.target.value;
        this.setState({infoItem: info});
    }

    modifyPrivilegeCommit() {
        let param = {
            id: this.state.infoItem.id,
            privilege_name: this.state.infoItem.privilege_name,
            route: this.state.infoItem.url,
            remark: $('#modify_remark').val()
        };
        H.server.privilege_update(param, (res) => {
            if(res.code == 0) {
                H.Modal(res.message);
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //状态切换;
    privilegeStatusUpdate(status) {
        let param = {
            id: this.state.infoItem.id,
            status: status
        };
        H.server.privilege_status_update(param, (res) => {
            if(res.code == 0) {
                let data = this.state.infoItem;
                data.status = status;
                this.setState({infoItem: data});
                H.Modal(res.message);
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    render() {
        let infoPanelXml = '',
            height = this.state.infoPanel.status == 1 ? '550px' : '400px';
        if(this.state.infoPanel.status == 1) {
            infoPanelXml = (
                <div className="info-main-w" style={{height: '490px'}}>
                    <div className="infoPanel-form privilege-infoPanel">
                        <div className="item"><label></label>添加一级菜单</div>
                        <div className="item"><label>名称：</label>
                            <input id="one_username" type="text"/>
                        </div>
                        <div className="item"><label>代号：</label>
                            <input id="one_tag" type="text"/>
                        </div>
                        <div className="item"><label>路由：</label>
                            <input id="one_route" type="text"/>
                        </div>
                        <div className="item"><label>备注：</label>
                            <textarea id="one_remark"></textarea>
                        </div>
                        <div className="item"><label></label><input type="button" value="保存" onClick={this.addOnePrivilege.bind(this)} /></div>
                    </div>
                    <div className="infoPanel-form privilege-infoPanel">
                        <div className="item"><label></label>添加二级菜单</div>
                        <div className="item"><label>一级菜单：</label>
                            <select id="two_parent" className="form-control">
                                {
                                    this.state.oneNav.map((name, index) => {
                                        return (<option value={name.id} key={index} >{name.name}</option>);
                                    })
                                }
                            </select>
                        </div>
                        <div className="item"><label>名称：</label>
                            <input id="two_username" type="text"/>
                        </div>
                        <div className="item"><label>代号：</label>
                            <input id="two_tag" type="text"/>
                        </div>
                        <div className="item"><label>路由：</label>
                            <input id="two_route" type="text"/>
                        </div>
                        <div className="item"><label>备注：</label>
                            <textarea id="two_remark"></textarea>
                        </div>
                        <div className="item"><label></label><input type="button" value="保存" onClick={this.addTwoPrivilege.bind(this)} /></div>
                    </div>
                    <div className="infoPanel-form privilege-infoPanel">
                        <div className="item"><label></label>添加功能</div>
                        <div className="item"><label>一级菜单：</label>
                            <select id="rank_one_parent" className="form-control" onChange={this.oneSelChange.bind(this)}>
                                {
                                    this.state.oneNav.map((name, index) => {
                                        return (<option value={name.id} key={index} >{name.name}</option>);
                                    })
                                }
                            </select>
                        </div>
                        <div className="item"><label>二级菜单：</label>
                            <select id="rank_tow_parent" className="form-control">
                                {
                                    this.state.twoNav.map((name, index) => {
                                        return (<option value={name.id} key={index} >{name.name}</option>);
                                    })
                                }
                            </select>
                        </div>
                        <div className="item"><label>名称：</label>
                            <input id="rank_username" type="text"/>
                        </div>
                        <div className="item"><label>代号：</label>
                            <input id="rank_tag" type="text"/>
                        </div>
                        <div className="item"><label>路由：</label>
                            <input id="rank_route" type="text"/>
                        </div>
                        <div className="item"><label>备注：</label>
                            <textarea id="rank_remark"></textarea>
                        </div>
                        <div className="item"><label></label><input type="button" value="保存" onClick={this.addRankPrivilege.bind(this)} /></div>
                    </div>
                </div>
            );
        }else if(this.state.infoPanel.status == 2) {
            infoPanelXml = (
                <div className="info-main-w">
                    <div className="infoPanel-form">
                        <div className="item"><label>名称：</label>
                            <input type="text" value={this.state.infoItem.privilege_name} onChange={this.privilegeNameChange.bind(this)} />
                        </div>
                        <div className="item"><label>代号：</label>
                            <input type="text" value={this.state.infoItem.privilege_tag} disabled />
                        </div>
                        <div className="item"><label>路由：</label>
                            <input type="text" value={this.state.infoItem.url} onChange={this.urlChange.bind(this)} />
                        </div>
                        <div className="item"><label>备注：</label>
                            <textarea id="modify_remark" defaultValue={this.state.infoItem.remark}></textarea>
                        </div>
                        <div className="item"><label></label><input type="button" value="保存" onClick={this.modifyPrivilegeCommit.bind(this)} />
                            {
                                this.state.infoItem.status == 1 ?
                                    <button
                                        style={{padding: '6px 12px', backgroundColor: 'red', marginLeft: '10px', border: 'none'}}
                                            onClick={this.privilegeStatusUpdate.bind(this, 2)}>停用
                                    </button> :
                                    <button
                                        style={{padding: '6px 12px', backgroundColor: '#38b7f6', marginLeft: '10px', border: 'none'}}
                                        onClick={this.privilegeStatusUpdate.bind(this, 1)}>启用
                                    </button>
                            }
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="section-warp">
                <div className="section-filter">
                    <Refresh refreshEv={this.getDataList}/>
                    <form className="form-inline">
                        <div className="filter-row">
                            <btn className="btn btn-lg" onClick={this.addPrivilege.bind(this)}>添加</btn>
                        </div>
                    </form>
                </div>
                <div className="section-table privilege-table">
                    <table className="table table-bordered table-hover table-responsive">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>名称</th>
                            <th>代号</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.data.length == 0 ? '' : this.createDom()}
                        </tbody>
                    </table>
                </div>
                <div className="section-tr-info" style={{height: this.state.infoPanel.infoPanelIsShow ? height : ''}}>
                    <i className="info-close-btn" title="点击隐藏弹出层" onClick={this.hideInfoPanel.bind(this)}>close</i>
                    <div className="info-w">
                        <h3 className="info-title">
                            {this.state.infoPanel.infoPanelTitle}
                        </h3>
                        {infoPanelXml}
                    </div>
                </div>
            </div>
        );
    }
}

export default PrivilegeManagementCtrl;