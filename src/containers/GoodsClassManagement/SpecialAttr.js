/*
* 商品分类的特殊属性*/

import React from 'react';
import ConstraintForm from './ConstraintForm.js';

/*
* props参数说明:
 * _type {
 *   id: ,   //当前操作的分类ID;
 *   typeDateArr: [],  //当前操作的分类;
 *   isHasChild: bool //点击操作的当前分类是否有下级，为true表示有下级;
 * }
 * inputFormat: 商品属性可输入格式;
* */
class SpecialAttr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            specialData: {  //特殊属性数据;
                type_id: this.props._type.id,
                attributes: []
            },
            type: null   //当前操作的分类;
        };
        this.getSpecialAttr = this.getSpecialAttr.bind(this);
        this.CreateSpecialList = this.CreateSpecialList.bind(this);
        this.setData = this.setData.bind(this);
    }

    componentWillMount() {
        this.setState({type: this.props._type}, () => {
            this.getSpecialAttr();
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps._type && nextProps._type != this.state.type) {
            this.setState({type: nextProps._type}, () => {
                this.getSpecialAttr();
            });
        }
    }

    //获取特殊属性;
    getSpecialAttr() {
        let param = {type_id: this.state.type.id};
        H.server.goods_type_specialAttr_list(param, (res) => {
            if(res.code == 0) {
                this.setState({
                    specialData: res.data
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //添加特殊属性;
    addSpecialAttr() {
        let attrName = this.refs.addSpecialName.value;
        if(!attrName) {
            this.refs.addSpecialName.focus();
            return;
        }
        let data = this.state.specialData,
            obj = {
                'attribute_id': 0,
                'attribute_name': attrName,
                'format_type_id': 1,
                'must': false,
                'format_values':[
                    {
                        'value': '',
                        'unit': '',
                        'default': false,
                        'rule': 'string'
                    }
                ]
            };
        if(data.attributes.length > 0) {
            if(data.attributes[data.attributes.length-1].attribute_id) {
                data.attributes.push(obj);
                this.setState({specialData: data});
            }else {
                H.Modal('先把刚添加的保存之后再继续添加下一个特殊属性');
            }
        }else {
            data.attributes.push(obj);
            this.setState({specialData: data});
        }
        this.refs.addSpecialName.value = '';
    }

    //删除特殊属性;
    delSpecialAttr(index, name) {
        let data = this.state.specialData;
        if(data.attributes[index].attribute_id) {
            H.Modal({
                title: '删除特殊属性"'+name+'"',
                content: '<p>确认要删除该属性吗，请先确认该分类下是否有商品，如果有商品，成功删除之后不能恢复，并且该分类下面的商品将变成待审核。</p>',
                cancel: true,
                height: '210',
                cancelText: '取消',
                okCallback: () => {
                    H.server.goods_type_specialAttr_delete(JSON.stringify({attribute_ids: ''+data.attributes[index].attribute_id}), (res) => {
                        if(res.code == 0) {
                            H.Modal('删除成功');
                            data.attributes.splice(index, 1);
                            this.setState({specialData: data});
                        }else if(res.code == 10106) {
                            H.overdue();
                        }else {
                            H.Modal(res.message);
                        }
                    });
                }
            });
        }else {
            data.attributes.splice(index, 1);
            this.setState({specialData: data});
        }
    }

    //设置数据，添加或者修改时;
    setData(obj, index) {
        let data = this.state.specialData;
        data.attributes[parseInt(index)] = obj;
        this.setState({specialData: data});
    }

    //更改是否必填;
    radioChange(index, e) {
        let data = this.state.specialData;
        data.attributes[index].must = e.target.value === 'true' ? true : false;
        this.setState({specialData: data});
    }

    //更改特殊属性的属性名;
    setSpecialName(index, e) {
        let data = this.state.specialData;
        data.attributes[index].attribute_name = e.target.value;
        this.setState({specialData: data});
    }

    //创建特殊;
    CreateSpecialList() {
        let data = this.state.specialData.attributes,
            XML = [];
        if(!data) return XML;
        for(let i in data) {
            XML.push(
                <div className="special-list" key={i}>
                    <div className="form-inline form-group"><span className="labels">属性名：</span><input type="text" className="form-control name" value={data[i].attribute_name} onChange={this.setSpecialName.bind(this, i)} />
                        <a className="btn btn-sm btn-orange" onClick={this.delSpecialAttr.bind(this, i, data[i].attribute_name)}>删除</a>
                    </div>
                    <div className="form-group"><span className="labels">必填：</span>
                        <label className="radio-inline"><input type="radio" defaultChecked={data[i].must} value={true} onChange={this.radioChange.bind(this, i)} name={'must'+i}/>是</label>
                        <label className="radio-inline"><input type="radio" defaultChecked={!data[i].must} value={false} onChange={this.radioChange.bind(this, i)} name={'must'+i}/>否</label></div>
                    <ConstraintForm
                        values={data[i]}
                        rules={this.props.inputFormat}
                        handler={this.setData}
                        num={i}
                    />
                </div>
            );
        }
        return XML;
    }

    //保存特殊属性;
    specialSave() {
        if(this.state.specialData.attributes.length <= 0) return;
        H.Modal({
            title: '保存特殊属性',
            content: '<p>保存特殊属性之后，该分类下面的商品都将变成待审核状态，请谨慎操作。</p>',
            cancel: true,
            height: '210',
            cancelText: '取消',
            okText: '保存',
            okCallback: () => {
                H.server.goods_type_specialAttr_update(JSON.stringify(this.state.specialData), (res) => {
                    if(res.code == 0) {
                        H.Modal('保存成功');
                        this.getSpecialAttr();
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
            <div className="special-attr">
                <div className="special-info">
                    <div className="title">特殊属性</div>
                    {this.CreateSpecialList()}
                    <div className="form-inline form-group">
                        属性名：<input type="text" ref="addSpecialName" className="form-control name" /><a className="btn btn-sm btn-default" onClick={this.addSpecialAttr.bind(this)}>+添加</a>
                    </div>
                    <div style={{marginTop: '20px', textAlign: 'right'}}>
                        <a className="btn btn-sm btn-default" onClick={this.specialSave.bind(this)}>保存</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default SpecialAttr;