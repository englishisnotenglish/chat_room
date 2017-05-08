import React from 'react';
import Refresh from '../../components/refresh/refresh.js';
import PageCtrlBar from '../../components/page/paging.js';
import Modal from '../../components/modal/modal.js';
import Privilege from './Privilege.js';

class AccountManagementCtrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],   //用户列表数据;
            privilege: null,  //当前用户的所有权限;
            privilegeAll: null, //所有权限;
            totalPage: 1,   //总页数;
            infoPanel: {    //附体部分状态及标题;
                infoPanelIsShow: false,
                infoPanelTitle: ''
            },
            infoItem: {  //当前被操作的用户信息;
                user_id: 1,
                user_name: '',
                login_name: '',
                department_id: 0,
                login_password: '',
                privileges: null
            },
            departmentList: [],  //部门列表数据;
            userStatus: 1,  //判断添加还是修改操作员的状态,添加为1，修改为2
            defaultParam: {  //获取列表提交的参数;
                page: 1,
                size: 40
            },
            modalState: 0  //弹窗类型;
        };
        this.getDataList = this.getDataList.bind(this);
        this.hideInfoPanel = this.hideInfoPanel.bind(this);
        this.selChange = this.selChange.bind(this);
        this.modifySub = this.modifySub.bind(this);
        this.changePage = this.changePage.bind(this);
        this.userPrivilege = this.userPrivilege.bind(this);
        this.getDepartmentList = this.getDepartmentList.bind(this);
        this.refresh = this.refresh.bind(this);
        this.getPrivilegeList = this.getPrivilegeList.bind(this);
    }

    componentDidMount() {
        this.getDataList();
        this.getPrivilegeList();

        //当前用户的所有权限获取;
        let tabData = this.props.currentTabData,
            userNavigate = this.props.userNavigate;
        if(this.props.userNavigate && this.props.userNavigate != '') {
            if(userNavigate[tabData.parentId] && userNavigate[tabData.parentId][tabData.id]){
                this.setState({privilege: this.props.userNavigate[tabData.parentId][tabData.id]});
            }
        }
    }

    //所有权限获取;
    getPrivilegeList() {
        H.server.privilege_list({}, (res)=>{
            if(res.code == 0) {
                this.setState({privilegeAll: res.data});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    getDepartmentList() {
        //获取部门列表;
        H.server.department_list({page: 1, size: 99}, (res) => {
            if(res.code == 0) {
                this.setState({departmentList: res.data.departments});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //获取数据列表;
    getDataList() {
        let server = H.server,
            param = this.state.defaultParam;
        server.user_list(param, (res) => {
            if(res.code == 0) {
                this.setState({
                    data: res.data.users,
                    totalPage: Math.ceil(res.data.total/param.size)
                });
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
            infoPanel: {infoPanelIsShow: false, infoPanelTitle: ''}
        });
    }

    //修改用户按钮;
    modify(value) {
        let info = {
            user_id: value.id,
            user_name: value.name,
            login_name: value.login_name,
            department_id: value.department_id,
            login_password: ''
        };
        this.getDepartmentList();
        this.setState({
            infoItem: info,
            infoPanel: {infoPanelIsShow: true, infoPanelTitle: value.name + '的信息修改'},
            userStatus: 2
        });
    }

    //操作员添加或修改接口;
    modifySub() {
        if(this.state.infoItem.user_name == '' || this.state.infoItem.user_name == null) {
            H.Modal('使用都姓名必须填写');
            return;
        }

        if(!H.isPhone(this.state.infoItem.login_name)) {
            H.Modal('手机号不正确');
            return;
        }

        //修改接口;
        if(this.state.userStatus == 2) {
            H.server.user_info_update(this.state.infoItem, (res) => {
                if(res.code == 0) {
                    this.getDataList();
                    H.Modal(res.message);
                }else if(res.code == 10106) {
                    H.overdue();
                }else {
                    H.Modal(res.message);
                }
            });
        }else if(this.state.userStatus == 1) {
            if(this.state.infoItem.login_password == '' || this.state.infoItem.login_password == null) {
                H.Modal('登录密码不能为空');
                return;
            }
            let param = {
                user_name: this.state.infoItem.user_name,
                login_name: this.state.infoItem.login_name,
                login_password: this.state.infoItem.login_password,
                department_id: this.state.infoItem.department_id
            };
            H.server.user_add(param, (res) => {
                if(res.code == 0) {
                    this.getDataList();
                    H.Modal(res.message);
                }else if(res.code == 10106){
                    H.overdue();
                }else {
                    H.Modal(res.message);
                }
            });
        }
    }

    //创建用户按钮;
    createUser() {
        let info = {
            user_id: 1,
            user_name: '',
            login_name: '',
            department_id: 1,
            login_password: ''
        };
        this.getDepartmentList();
        this.setState({
            infoItem: info,
            infoPanel: {infoPanelIsShow: true, infoPanelTitle: '创建用户'},
            userStatus: 1
        });

    }

    //部门下拉选择;
    selChange() {
        let info = this.state.infoItem;
        info.department_id = this.refs.selectNode.value;
        this.setState({infoItem: info});
    }

    //修改用户信息时用户名改变事件;
    userNameChange(e) {
        let info = this.state.infoItem;
        info.user_name = e.target.value;
        this.setState({infoItem: info});
    }

    //修改用户信息时登录账户改变事件;
    loginNameChange(e) {
        let info = this.state.infoItem;
        info.login_name = e.target.value;
        this.setState({infoItem: info});
    }

    //修改用户信息时登录密码改变事件;
    loginPwdChange(e) {
        let info = this.state.infoItem;
        info.login_password = e.target.value;
        this.setState({infoItem: info});
    }

    //对用户进行启用、关闭、删除操作;
    statusUpdate(userId, status) {
        let param = {
            user_id: userId,
            status: status
        };
        H.server.user_status_update(param, (res) => {
            if(res.code == 0) {
                H.Modal(res.message);
                this.getDataList();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //点击权限打开该用户的权限修改弹窗;
    modifyPermissions(value) {
        let info = {
            user_id: value.id,
            user_name: value.name,
            login_name: value.login_name,
            department_id: value.department_id,
            login_password: ''
        };
        this.setState({
            infoItem: info,
            modalState: 1
        });
    }

    //修改权限提交
    modifyPermissionsSub() {
        let chooseArr = $('#account_privilege .selected'),
            param = {
                user_id: this.state.infoItem.user_id,
                privilege_tags: ''
            };
        for(let i = 0 ; i < chooseArr.length ; i++) {
            if(i == chooseArr.length-1){
                param.privilege_tags += chooseArr.eq(i).attr('name');
            }else {
                param.privilege_tags += chooseArr.eq(i).attr('name') + ',';
            }
        }

        H.server.user_privilege_update(param, (res) => {
            if(res.code == 0) {
                this.getDataList();
                this.setState({modalState: 0});
                H.Modal(res.message);
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

    //点击部分按钮查看这个用户的所拥有的权限;
    queryUserPrivilege(value) {
        let info = this.state.infoItem;
        info.privileges = value;
        this.setState({
            infoItem: info,
            modalState: 2
        });
    }

    //点击部分按钮查看这个用户的所拥有的权限;
    userPrivilege() {
        let navigates = this.state.infoItem.privileges.navigates,
            executePrivilege = this.state.infoItem.privileges.execute_privilege,
            oneXml = [];
        if(navigates == '' || !navigates) return;
        for(var oneObj of navigates[1]) {
            let twoXml = [],
                i = oneObj.id;
            if(navigates[2] || navigates[2][i]) {
                for(var twoObj of navigates[2][i]) {
                    let itemXml = [],
                        n = twoObj.id;
                    if(executePrivilege || executePrivilege[i][n]) {
                        for(var itemObj of executePrivilege[i][n]) {
                            let k = itemObj.id;
                            itemXml.push(
                                <div key={'itemxml' + k} style={{paddingRight: '20px', display: 'inline-block'}}>{itemObj.name}</div>
                            );
                        }
                    }
                    twoXml.push(
                        <div key={'twoxml' + n} style={{marginLeft: '20px', lineHeight: '2'}}>{twoObj.name}
                            <div style={{marginLeft: '20px'}}>
                                {itemXml}
                            </div>
                        </div>
                    );
                }
            }
            oneXml.push(
                <div key={'onexml' + i}>{oneObj.name}{twoXml}</div>
            );
        }
        return oneXml;
    }

    //刷新;
    refresh() {
        this.getDataList();
        this.getPrivilegeList();
        this.setState({
            infoPanel: {    //附体部分状态及标题初始化;
                infoPanelIsShow: false,
                infoPanelTitle: ''
            }
        });
    }

    //判断是否有这个功能;
    isHavePrivilege(name) {
        let privilege = this.state.privilege;
        for (let i in privilege) {
            if(privilege[i].name == name) {
                return true;
            }
        }
        return false;
    }

    render() {
        let modalXml = '';
        if(this.state.modalState != 0) {
            switch (this.state.modalState) {
                case 1:
                    modalXml = (
                        <Modal
                            width="535"
                            header="权限设置"
                            confirm="保存"
                            cancel="取消"
                            confirmCallback={this.modifyPermissionsSub.bind(this)}
                            cancelCallback={() => {
                                this.setState({modalState: 0});
                            }}
                        >
                            <Privilege privilegeAll={this.state.privilegeAll} userInfo={this.state.infoItem} />
                        </Modal>
                    );
                    break;
                case 2:
                    modalXml = (
                        <Modal
                            width="535"
                            header="操作权限"
                            confirm="确定"
                            confirmCallback={() => {
                                this.setState({modalState: 0});
                            }}
                            cancelCallback={() => {
                                this.setState({modalState: 0});
                            }}
                        >
                            {this.userPrivilege()}
                        </Modal>
                    );
                    break;
            }
        }
        return (
            <div className="section-warp">
                <div className="section-filter">
                    <Refresh refreshEv={this.refresh}/>
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.isHavePrivilege('创建') ? <btn className="btn btn-lg" onClick={this.createUser.bind(this)} >创建</btn> : ''}
                        </div>
                    </form>
                </div>
                <div className="section-table">
                    <table className="table table-bordered table-hover table-responsive">
                        <thead>
                            <tr>
                                <th>账户ID</th>
                                <th>使用者</th>
                                <th>部门</th>
                                <th>登录账号</th>
                                <th>绑定微信</th>
                                <th>操作权限</th>
                                <th>状态</th>
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.data.map((value, index) => {
                                    let str = '',
                                        dom1 = '',
                                        dom2 = '',
                                        dom3 = '',
                                        dom4 = '',
                                        privilege = this.state.privilege;
                                    switch (value.status) {
                                        case 1:
                                            str = '正常';
                                            break;
                                        case 2:
                                            str = '已停用';
                                            break;
                                        case 3:
                                            str = '删除';
                                            break;
                                    }

                                    if(value.name != 'root' && value.status != 3) {
                                        for (let i in privilege) {
                                            if(privilege[i].name == '启用' && value.name != 'admin') {
                                                if(value.status == 1) {
                                                    dom1 = (<a onClick={this.statusUpdate.bind(this, value.id, 2)}>关闭</a>);
                                                }else if(value.status == 2){
                                                    dom1 = (<a onClick={this.statusUpdate.bind(this, value.id, 1)}>启用</a>);
                                                }
                                            }else if(privilege[i].name == '修改') {
                                                dom2 = (<a onClick={this.modify.bind(this, value)}>修改</a>);
                                            }else if(privilege[i].name == '权限' && value.name != 'admin') {
                                                dom3 = (<a onClick={this.modifyPermissions.bind(this, value)}>权限</a>);
                                            }else if(privilege[i].name == '删除' && value.name != 'admin') {
                                                dom4 = (<a onClick={this.statusUpdate.bind(this, value.id, 3)}>删除</a>);
                                            }
                                        }
                                    }
                                    return (
                                        <tr key={index}>
                                            <td>{value.id}</td>
                                            <td>{value.name}</td>
                                            <td>{value.department_name}</td>
                                            <td>{value.login_name}</td>
                                            <td>绑定微信</td>
                                            <td>{
                                                value.privileges.privilege_scope == '部分' ? (
                                                    <a onClick={this.queryUserPrivilege.bind(this, value.privileges)}>部分</a>
                                                ) : '全部'
                                            }</td>
                                            <td>{str}</td>
                                            <td>{value.create_time}</td>
                                            <td>{dom1}{dom2}{dom3}{dom4}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    <PageCtrlBar pageNum={this.state.defaultParam.page}  maxPage={this.state.totalPage} clickCallback={this.changePage}/>
                </div>
                <div className={ this.state.infoPanel.infoPanelIsShow ? 'section-tr-info show' : 'section-tr-info' }>
                    <i className="info-close-btn" title="点击隐藏弹出层" onClick={this.hideInfoPanel}>close</i>
                    <div className="info-w">
                        <h3 className="info-title">
                            {this.state.infoPanel.infoPanelTitle}
                        </h3>
                        <div className="info-main-w">
                            <div className="infoPanel-form">
                                <div className="item"><label>使用者：</label>
                                    <input type="text" value={this.state.infoItem.user_name} onChange={this.userNameChange.bind(this)}
                                           disabled={this.state.infoItem.user_name == 'admin' ? true : false} />
                                </div>
                                <div className="item"><label>登录账号：</label>
                                    <input type="text" value={this.state.infoItem.login_name} onChange={this.loginNameChange.bind(this)} />
                                </div>
                                <div className="item"><label>登录密码：</label>
                                    <input type="password" value={this.state.infoItem.login_password} onChange={this.loginPwdChange.bind(this)} />
                                </div>
                                <div className="item"><label>所属部门：</label>
                                    <select value={this.state.infoItem.department_id} className="form-control" onChange={this.selChange} ref="selectNode"
                                            disabled={this.state.infoItem.user_name == 'admin' ? true : false}>
                                        {
                                            this.state.departmentList.map((name, index) => {
                                                return (<option value={name.id} key={index} >{name.name}</option>);
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="item"><label></label><input type="button" value="保存" onClick={this.modifySub} /></div>
                            </div>
                        </div>
                    </div>
                </div>
                {modalXml}
            </div>
        );
    }
}

export default AccountManagementCtrl;