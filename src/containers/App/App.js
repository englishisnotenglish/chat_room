import React, {Component} from 'react';
import {connect} from 'react-redux';
import {History} from 'react-router';

@connect(state => ({data: state.login.data,
user: state.login.user
}))

export default class App extends Component{

    constructor(){
        super();
        this.style = require('./app.scss');
        this.state = {
            levelTwoXML: '',
            tabs: {},
            currentTab: '',
            tabPanel: {}
        };
    }


    //创建一级菜单
    createLevelOne(){
        const items = [];
        const levelOne = this.props.data ? this.props.data.data.navigates['1'] : [];
        levelOne.map((item, index) => {
            items.push(
                <li key={index} data-id={item.id} onClick={this.openLevelTwo}>
                    <a href="javascript:;">{item.name}</a>
                </li>
            );
        });
        return(
            <ul className="nav nav-pills">
                {items}
            </ul>
        );
    }

    //创建二级菜单
    openLevelTwo = (e) => {
        const target = e.target.parentNode,
               id = target.dataset.id,
               items = [];
        const levelTwo = this.props.data.data.navigates['2'][id];
        levelTwo.map((item, index) => {
            items.push(<li key={index} data-id={item.id}
                           data-name={item.name} data-url={item.url}>
                <a onClick={this.openContent} href="javascript:;">{item.name}</a>
            </li>);
        });
        const levelTwoXML = (
            <ul className="nav nav-pills nav-stacked">
                {items}
            </ul>
        );
        this.setState({
            levelTwoXML
        });
    };

    //打开内容
    openContent = (e) => {
        const target = e.target.parentNode,
               id = target.dataset.id,
               name = target.dataset.name,
               url = target.dataset.url,
               tabList = [];
        if(!this.state.tabs[id] || !this.state.tabs[id][0]){
            this.state.tabs[id] = [id, name];
            const path = '/home/' + url;
            this.props.history.pushState(null, path);
        }
        this.state.currentTab = id;
        const tabsXML = (
            <ul className="nav nav-tabs">
                {this.iteratorTabs(tabList)}
            </ul>
        );
        this.setState({
            tabsXML
        });
    };

    //生成内容
    iteratorTabs(tabList){
        for (var key in this.state.tabs){
            const value = this.state.tabs[key];
            if(value[0]){
                tabList.push(
                    <li key={value[0]}>
                        <a onClick={this.changeTab.bind(this, value[0])}>
                            {value[1]}
                            <i onClick={this.closeTab.bind(this, value[0])}>&times;</i>
                        </a>
                    </li>
                );
            }
        }
        return tabList;
    }

    //关闭标签
    closeTab = (id, e) => {
        e.stopPropagation();
        const tabList = [];
        let prev = '',
            isLeft = false,
            isFound = false;
        this.state.tabs[id] = [];
        delete this.state.tabPanel[id];
        Object.keys(this.state.tabPanel).map((key, index) => {
            if(key === id){
                isFound = true;
            }
            if(key === id && index === 0){
                isLeft = true;
                isFound = true;
            }
            if(isLeft && index === 1){
                prev = key;
            }
            if(!isFound){
                prev = key;
            }
        });
        const tabsXML = (
            <ul className="nav nav-tabs">
                {this.iteratorTabs(tabList)}
            </ul>
        );
        this.setState({
            tabsXML,
            currentTab: prev
        });
    };

    //切换标签
    changeTab = (id) => {
        this.setState({
            currentTab: id
        });
    };

    //创建标签内容
    createTabPanel(){
        const currentTab = this.state.currentTab,
            tabPanels = [];
        if(currentTab && !this.state.tabPanel[currentTab]){
            this.state.tabPanel[currentTab] = this.props.children;
        }
        for(let key in this.state.tabPanel){
            tabPanels.push(<div className={currentTab === key ? 'active' : 'hide'}>
                {this.state.tabPanel[key]}
            </div>);
        }
        return tabPanels;

    }

    render(){
        return(
            <div>
                <div className="clearfix">
                    {this.createLevelOne()}
                </div>

                <div className="content-area">
                    <div className="level-two clearfix">
                        {this.state.levelTwoXML}
                    </div>

                    <div className="content">
                        <div className="tabs clearfix">
                            {this.state.tabsXML}
                        </div>

                        <div className="panels">
                            {this.createTabPanel()}
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}


