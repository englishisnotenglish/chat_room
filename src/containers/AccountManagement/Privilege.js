import React from 'react';

class Privilege extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            privilege: null
        };
        this.privilegeXml = this.privilegeXml.bind(this);
    }

    componentDidMount() {
        let param = {
            user_id: this.props.userInfo.user_id
        };

        //获取指定用户的所有权限;
        H.server.user_privilege(param, (res) => {
            if(res.code == 0) {
                this.setState({privilege: res.data.user_tags ? res.data.user_tags : []});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

    }

    //关闭打开;
    toggle(id) {
        let node = $('#' + id);
        if(node.attr('class').indexOf('toggle-open') != -1) {
            node.removeClass('toggle-open');
            node.addClass('toggle-close');
        }else {
            node.removeClass('toggle-close');
            node.addClass('toggle-open');
        }
    }

    //选中取消;
    chooseChange(id, parentId, ancestorId) {
        let node = $('#' + id);
        if(node.attr('class').indexOf('selected') != -1) {
            node.removeClass('selected');
            if(parentId == 'open_all'){
                $('#' + parentId + ' > .navigates-item .choose').removeClass('selected');
            }else {
                if($('#' + parentId + ' > ul > li > .navigates-item .selected').length == 0) {
                    if(parentId) {
                        $('#' + parentId + ' > .navigates-item .choose').removeClass('selected');
                    }
                }
                if(ancestorId && $('#' + ancestorId + ' > ul > li > .navigates-item .selected').length == 0) {
                    $('#' + ancestorId + ' > .navigates-item .choose').removeClass('selected');
                }
            }
            $('#choose_all').removeClass('selected');
            node.parent().siblings('ul').find('.choose').removeClass('selected');
        }else {
            node.addClass('selected');
            if(parentId && parentId != 'open_all') {
                $('#' + parentId + ' > .navigates-item .choose').addClass('selected');
            }
            if(ancestorId) {
                $('#' + ancestorId + ' > .navigates-item .choose').addClass('selected');
            }
            node.parent().siblings('ul').find('.choose').addClass('selected');
        }
    }

    privilegeXml() {
        let xml = [],
            one = this.props.privilegeAll.navigates[1],
            two = this.props.privilegeAll.navigates[2],
            privilege = this.props.privilegeAll.execute_privilege;
        for(var oneObj of one) {
            let twoXml = [],
                i = oneObj.id;
            if(two[i]){
                for( var twoObj of two[i] ) {
                    let itemXml = [],
                        n = twoObj.id;
                    if(privilege[i][n]){
                        for(var privilegeItem of privilege[i][n]) {
                            let k = privilegeItem.id;
                            itemXml.push(
                                <li key={'itemXml_' + k}>
                                    <div className="navigates-item">
                                        <div id={'choose' + i + n + k}
                                             className={this.state.privilege.indexOf(privilegeItem.privilege_tag) != -1 ? 'choose selected' : 'choose'}
                                             name={privilegeItem.privilege_tag}
                                             onClick={this.chooseChange.bind(this, 'choose' + i + n + k, 'open_' + i + n, 'open_' + i)}
                                        ></div>
                                        <span className="name">{privilegeItem.name}</span>
                                    </div>
                                </li>
                            );
                        }
                        twoXml.push(
                            <li id={'open_' + i + n} className="toggle-open" key={'towXml_' + n}>
                                <div className="cuttle-icon" onClick={this.toggle.bind(this, 'open_' + i + n)}></div>
                                <div className="navigates-item">
                                    <div id={'choose' + i + n}
                                         className={this.state.privilege.indexOf(twoObj.privilege_tag) != -1 ? 'choose selected' : 'choose'}
                                         name={twoObj.privilege_tag}
                                         onClick={this.chooseChange.bind(this, 'choose' + i + n, 'open_' + i, '')}
                                    ></div>
                                    <span className="name">{twoObj.name}</span></div>
                                <ul>
                                    {itemXml}
                                </ul>
                            </li>
                        );
                    }
                }
                xml.push(
                    <li id={'open_' + i} className="toggle-open" key={'oneXml_' + i}>
                        <div className="cuttle-icon" onClick={this.toggle.bind(this, 'open_' + i)}></div>
                        <div className="navigates-item">
                            <div id={'choose' + i}
                                 className={this.state.privilege.indexOf(oneObj.privilege_tag) != -1 ? 'choose selected' : 'choose'}
                                 name={oneObj.privilege_tag}
                                 onClick={this.chooseChange.bind(this, 'choose' + i, 'open_all', '')}
                            ></div>
                            <span className="name">{oneObj.name}</span></div>
                        <ul>
                            {twoXml}
                        </ul>
                    </li>
                );
            }
        }
        return xml;
    }

    render() {
        let Xml = '';
        if(this.state.privilege != null) {
            Xml = this.privilegeXml();
        }
        return (
            <div>
                <p>使用者：{this.props.userInfo.user_name}</p>
                <p><span style={{display: 'inline-block', color: 'red', marginLeft: '20px', marginRight: '8px'}}>*</span>选择权限</p>
                <ul id="account_privilege" className="treeview">
                    <li id='open_all' className="toggle-open">
                        <div className="cuttle-icon" onClick={this.toggle.bind(this, 'open_all')}></div>
                        <div className="navigates-item">
                            <div id='choose_all'
                                className="choose"
                                onClick={this.chooseChange.bind(this, 'choose_all', null, null)}
                            ></div>
                            <span className="name">全部</span></div>
                        <ul>
                            {Xml}
                        </ul>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Privilege;