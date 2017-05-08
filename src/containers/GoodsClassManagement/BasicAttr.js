import React from 'react';
import AddClass from './AddClass.js';
import ConstraintForm from './ConstraintForm.js';

/*
* _type {
*   id: ,   //当前操作的分类ID;
*   typeDateArr: [],  //当前操作的分类;
*   isHasChild: bool //点击操作的当前分类是否有下级，为true表示有下级;
* }
* getGoodsClassData: fn  修改或者删除后需要重新获取新的分类数据列表;
* setTYPE: fu   //如果执行了删除分类，需要把当前这个分类的信息设置的Null;
* inputFormat: 商品属性可输入格式;
* */

class BasicAttr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {   //操作当前分类的基本信息;
                parent_id: 0,   //父级ID;
                type_name: '',   //分类名;
                type_keywords: '',  //关键名;
                type_pic_url: ''    //分类图标;
            },
            type: null,   //当前操作的分类;
            basicAttrData: {   //基本属性;
                'type_constraint': {
                    'format_type_id': 1,
                    'format_values': [
                        {
                            'value': '',
                            'unit': '',
                            'default': false,
                            'rule':'string'
                        }
                    ]
                },
                'spec_constraint': {
                    'format_type_id': 1,
                    'format_values': [
                        {
                            'value': '',
                            'unit': '',
                            'default': false,
                            'rule':'string'
                        }
                    ]
                }
            }
        };
        this.getTypeInfo = this.getTypeInfo.bind(this);
        this.getBasicAttr = this.getBasicAttr.bind(this);
        this.setTypeConstraint = this.setTypeConstraint.bind(this);
        this.setSpecConstraint = this.setSpecConstraint.bind(this);
        this.setParam = this.setParam.bind(this);
    }

    componentWillMount() {
        this.setState({type: this.props._type}, () => {
            this.getTypeInfo();
            this.getBasicAttr();
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps._type && nextProps._type != this.state.type) {
            this.setState({type: nextProps._type}, () => {
                this.getTypeInfo();
                this.getBasicAttr();
            });
        }
    }

    //获取分类的基本信息;
    getTypeInfo() {
        let param = {type_id: this.state.type.id};
        H.server.goods_type_info(param, (res) => {
            if(res.code == 0) {
                this.setState({
                    info: {   //添加商品时需要的参数;
                        parent_id: res.data.type_id,   //父级ID;
                        type_name: res.data.type_name,   //分类名;
                        type_keywords: res.data.type_keywords,  //关键名;
                        type_pic_url: res.data.type_pic_url    //分类图标;
                    }
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //获取分类的基本属性;
    getBasicAttr() {
        let param = {type_id: this.state.type.id};
        H.server.goods_type_basicAttr_get(param, (res) => {
            if(res.code == 0) {
                let data = {   //基本属性;
                    'type_constraint': {
                        'format_type_id': 1,
                        'format_values': [
                            {
                                'value': '',
                                'unit': '',
                                'default': false,
                                'rule':'string'
                            }
                        ]
                    },
                    'spec_constraint': {
                        'format_type_id': 1,
                        'format_values': [
                            {
                                'value': '',
                                'unit': '',
                                'default': false,
                                'rule':'string'
                            }
                        ]
                    }
                };

                if(res.data.type_constraint.format_type_id) {
                    data.type_constraint = res.data.type_constraint;
                }
                if(res.data.spec_constraint.format_type_id) {
                    data.spec_constraint = res.data.spec_constraint;
                }
                this.setState({
                    basicAttrData: data
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //设置分类修改需要提交的参数;
    setParam(param) {
        this.setState({info: param});
    }

    //提交修改分类信息;
    updateGoodsClassSub() {
        let param = {
            type_id: this.state.info.parent_id,
            type_name: this.state.info.type_name,
            type_keywords: this.state.info.type_keywords,
            type_pic_url: this.state.info.type_pic_url
        };
        if(!param.type_name) {
            $('#goods_type_name')[0].focus();
            return;
        }
        if(!param.type_keywords) {
            $('#goods_type_keywords')[0].focus();
            return;
        }
        H.server.goods_type_update(param, (res) => {
            if(res.code == 0) {
                H.Modal('修改成功');
                this.setState({
                    modalState: 0
                });
                this.props.getGoodsClassData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //删除分类;
    delGoodsClass() {
        let param = {type_id: this.state.info.parent_id};
        H.Modal({
            title: '删除分类',
            content: '<p>确认要删除该分类吗，请先确认该分类下是否有商品，如果有商品则不能删除。成功删除之后不能恢复。</p>',
            cancel: true,
            height: '210',
            cancelText: '取消',
            okCallback: () => {
                H.server.goods_type_delete(param, (res) => {
                    if(res.code == 0) {
                        H.Modal('删除成功');
                        this.setState({
                            modalState: 0
                        });
                        this.props.getGoodsClassData();
                        this.props.setTYPE();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    //设置型号约束：
    setTypeConstraint(options) {
        let data = this.state.basicAttrData;
        data.type_constraint = options;
        this.setState({basicAttrData: data});
    }

    //设置规格约束：
    setSpecConstraint(options) {
        let data = this.state.basicAttrData;
        data.spec_constraint = options;
        this.setState({basicAttrData: data});
    }

    //保存基本属性;
    basicSave() {
        let param = this.state.basicAttrData;
        param.type_id = this.props._type.id;
        H.Modal({
            title: '保存基本属性',
            content: '<p>保存基本属性之后，该分类下面的商品都将变成待审核状态，请谨慎操作。</p>',
            cancel: true,
            height: '210',
            cancelText: '取消',
            okText: '保存',
            okCallback: () => {
                H.server.goods_type_basicAttr_update(JSON.stringify(param), (res) => {
                    if(res.code == 0) {
                        H.Modal('保存成功');
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });
            }
        });

    }

    render() {
        return (
            <div className="basic-attr">
                <div className="basic-info">
                    <div className="title">基本属性</div>
                    <AddClass
                        data={this.props.data}
                        param={this.state.info}
                        setParam={this.setParam}
                        _dataArr={this.props._type.typeDateArr}
                        typeId={this.props._type.id}
                        delGoodsClass={this.delGoodsClass}
                        disabled="1"
                    />
                    <div className="btn-group" style={{paddingLeft: '85px'}}>
                        <a className="btn btn-sm btn-default" onClick={this.updateGoodsClassSub.bind(this)}>保存</a>
                        <a className="btn btn-sm btn-orange" onClick={this.delGoodsClass.bind(this)}>删除</a>
                    </div>
                    {
                        !this.state.type.isHasChild ?
                            <div>
                                <div className="basic-item">
                                    <div className="item-title">型号约束</div>
                                    <ConstraintForm
                                        values={this.state.basicAttrData.type_constraint}
                                        rules={this.props.inputFormat}
                                        handler={this.setTypeConstraint}
                                    />
                                </div>
                                <div className="basic-item">
                                    <div className="item-title">规格约束</div>
                                    <ConstraintForm
                                        values={this.state.basicAttrData.spec_constraint}
                                        rules={this.props.inputFormat}
                                        handler={this.setSpecConstraint}
                                    />
                                </div>
                                <div style={{marginTop: '20px', textAlign: 'right'}}>
                                    <a className="btn btn-sm btn-default" onClick={this.basicSave.bind(this)}>保存</a>
                                </div>
                            </div>
                            : ''
                    }
                </div>
            </div>
        );
    }
}

export default BasicAttr;