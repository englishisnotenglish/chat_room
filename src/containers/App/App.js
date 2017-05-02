import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {History} from 'react-router'

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
            currentTab: ''
        }
        ;
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
        if(!this.state.tabs[id] || this.state.tabs[id]){
            this.state.tabs[id] = [id, name, null];
            const path = '/home/' + url;
            this.props.history.pushState(null, path);
        }
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
                        <a>
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
    closeTab = (id) => {
        const tabList = [];
        this.state.tabs[id] = [];
        const tabsXML = (
            <ul className="nav nav-tabs">
                {this.iteratorTabs(tabList)}
            </ul>
        );
        this.setState({
            tabsXML
        });
    };

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
                        <div className="clearfix">
                            {this.state.tabsXML}
                        </div>
                        {this.props.children}
                    </div>
                </div>

            </div>
        );
    }
}


