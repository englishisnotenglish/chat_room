/*
* 每日推送*/

import React from 'react';
import Refresh from '../../components/refresh/refresh.js';
import ReceiveUserList from './ReceiveUserList.js';
import DailyNewsLog from './DailyNewsLog.js';
import TodayArticle from './TodayArticle.js';

class DepartmentManagementCtrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],   //用户列表数据;
            privilege: null,  //当前用户的所有权限;
            infoPanel: {    //附体部分状态及标题;
                infoPanelIsShow: false,
                infoPanelTitle: ''
            },
            pageStatus: 1,   //当前页面，1：今日推文，2：可推用户名单，3：推文日志;
            areaData: [],     //区域的数据;
            currentArea: null   //当前区域;
        };
        this.hideInfoPanel = this.hideInfoPanel.bind(this);
        this.changePage = this.changePage.bind(this);
        this.refresh = this.refresh.bind(this);
        this.isHavePrivilege = this.isHavePrivilege.bind(this);
        this.createPage = this.createPage.bind(this);
    }

    componentDidMount() {

        //当前用户的所有权限获取;
        let tabData = this.props.currentTabData,
            userNavigate = this.props.userNavigate;
        if(this.props.userNavigate && this.props.userNavigate != '') {
            if(userNavigate[tabData.parentId] && userNavigate[tabData.parentId][tabData.id]){
                this.setState({privilege: this.props.userNavigate[tabData.parentId][tabData.id]});
            }
        }

        H.server.other_customArea_list({}, (res) => {
            if(res.code == 0) {
                this.setState({
                    areaData: res.data,
                    currentArea: res.data[0]
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

    //对当前页面的设置;
    changePage(n) {
        let param = this.state.defaultParam,
            newParam = Object.assign(param, n);
        this.setState({defaultParam: newParam}, () => {
            this.getDataList();
        });
    }

    //刷新;
    refresh() {
        this.setPageStatus(1);
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

    //设置页面类型,如明日推文，可推用户名单，推文日志;
    setPageStatus(status) {
        this.setState({
            pageStatus: status,
            currentArea: this.state.areaData[0]
        });
    }

    //判断应该显示哪个页面;
    createPage() {
        if(!this.state.currentArea) return '';
        let xml = '';
        switch (this.state.pageStatus) {
            case 1:
                xml = (<TodayArticle currentArea={this.state.currentArea} currentTabData={this.props.currentTabData} userNavigate={this.props.userNavigate}/>);   //显示明日推文页面;
                break;
            case 2:
                xml = (<ReceiveUserList currentArea={this.state.currentArea} />);   //显示可推用户名单;
                break;
            case 3:
                xml = (<DailyNewsLog currentArea={this.state.currentArea} />);    //推文日志;
                break;
        }
        return xml;
    }

    //切换地区;
    switchArea(areaData) {
        this.setState({currentArea: areaData});
    }

    render() {
        return (
            <div className="section-warp">
                <div className="section-filter">
                    <Refresh refreshEv={this.refresh}/>
                    <form className="form-inline">
                        <div className="filter-row">
                            <div className="btn-group">
                                <btn className={this.state.pageStatus == 1 ? 'btn btn-lg btn-default' : 'btn btn-lg'} onClick={this.setPageStatus.bind(this, 1)}>今日推文</btn>
                                <btn className={this.state.pageStatus == 2 ? 'btn btn-lg btn-default' : 'btn btn-lg'} onClick={this.setPageStatus.bind(this, 2)}>可推用户名单</btn>
                                <btn className={this.state.pageStatus == 3 ? 'btn btn-lg btn-default' : 'btn btn-lg'} onClick={this.setPageStatus.bind(this, 3)}>推文日志</btn>
                            </div>
                        </div>
                        <div className="filter-row">
                            <div className="btn-group">
                                {
                                    this.state.areaData.map((data, index) => {
                                        return (
                                            <btn key={index}
                                                 className={data == this.state.currentArea ? 'btn btn-sm btn-default' : 'btn btn-sm'}
                                                 onClick={this.switchArea.bind(this, data)}
                                            >{data.area_name}</btn>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </form>
                </div>

                {this.createPage()}
            </div>
        );
    }
}

export default DepartmentManagementCtrl;