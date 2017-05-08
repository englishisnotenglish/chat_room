/*
* 商品分类管理*/

import React from 'react';
import GoodsClassTree from './GoodsClassTree.js';
import Modal from '../../../components/modal/modal.js';
import AddClass from './AddClass.js';
import BasicAttr from './BasicAttr.js';
import SpecialAttr from './SpecialAttr.js';

class GoodsClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsClassData: null,   //商品分类数据;
            modalState: 0,   //弹窗类型;0表示没有弹窗;
            addParam: {   //添加商品时需要的参数;
                parent_id: 0,   //父级ID;
                type_name: '',   //分类名;
                type_keywords: '',  //关键名;
                type_pic_url: ''    //分类图标;
            },
            areaData: [],  //片区数据;
            _area: null,   //当前片区;
            _type: null,
            inputFormat: [],   //商品属性可输入格式;
            sortState: false,  //排序状态;
            sortParam: []    //排序字段;
        };
        this.setAddParam = this.setAddParam.bind(this);
        this.updateGoodsClass = this.updateGoodsClass.bind(this);
        this.getGoodsClassData = this.getGoodsClassData.bind(this);
        this.setTYPE = this.setTYPE.bind(this);
        this.getInputFormat = this.getInputFormat.bind(this);
        this.setTypeSortParam = this.setTypeSortParam.bind(this);
    }

    componentWillMount() {
        this.getInputFormat();
        this.getAreaData();
        if($('#mybase64').length <= 0){
            let scriptStr = '<script id="mybase64" src="/js/mybase64.js"></script>';
            $('body').append(scriptStr);
        }
    }

    //获取商品分类数据;
    getGoodsClassData() {
        H.server.goods_type_list({area_id: this.state._area}, (res) => {
            if(res.code == 0) {
                this.setState({goodsClassData: res.data});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //商品属性可输入格式获取;
    getInputFormat() {
        H.server.other_goods_type_attr_inputFormat_list({}, (res) => {
            if(res.code == 0) {
                this.setState({inputFormat: res.data});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //获取片区;
    getAreaData() {
        H.server.other_customArea_list({}, (res) => {
            if(res.code == 0) {
                this.setState({
                    areaData: res.data,
                    _area: res.data[0].area_id
                }, () => {
                    this.getGoodsClassData();
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //点击添加分类按钮;
    addGoodsClass() {
        this.setState({
            modalState: 1,
            addParam: {   //添加商品时需要的参数;
                parent_id: 0,   //父级ID;
                type_name: '',   //分类名;
                type_keywords: '',  //关键名;
                type_pic_url: ''    //分类图标;
            }
        });
    }

    //提交添加分类的接口;
    addGoodsClassSub() {
        let param = this.state.param;
        param.area_id = this.state._area;
        if(!param.type_name) {
            $('#goods_type_name')[0].focus();
            return;
        }
        if(!param.type_keywords) {
            $('#goods_type_keywords')[0].focus();
            return;
        }
        H.server.goods_type_add(param, (res) => {
            if(res.code == 0) {
                H.Modal('添加成功');
                this.setState({
                    modalState: 0
                });
                this.getGoodsClassData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //设置添加分类需要提交的参数;
    setAddParam(param) {
        this.setState({param: param});
    }

    //修改单个分类信息, id：点击某个分类的ID，arr： 点击某个分类的上面级别的ID(数组)，isHasChild: 是否有下级，true表示有下级（非最下级）;
    updateGoodsClass(id, arr, isHasChild) {
        this.setState({
            _type: {
                id: id,   //当前操作的分类ID;
                typeDateArr: arr,  //当前操作的分类;
                isHasChild: isHasChild //点击操作的当前分类是否有下级，为true表示有下级;
            }
        });
    }

    //如果执行了删除时需要把当前操作分类的信息设置成null;
    setTYPE() {
        this.setState({_type: null});
    }

    //切换大区;
    toggleArea(id, e) {
        if(id == this.state._area) return;
        this.setState({_area: id, _type: null}, () => {
            this.getGoodsClassData();
        });
        $(e.target).siblings().removeClass('btn-default"');
        $(e.target).addClass('btn-default"');
    }

    typeSort() {
        if(this.state.sortState) {
            this.typeSortSub();
        }else {
            this.setState({sortState: !this.state.sortState});
        }
    }

    typeSortSub() {
        H.server.goods_type_sort(JSON.stringify(this.state.sortParam), (res) => {
            if(res.code == 0) {
                H.Modal('修改排序成功');
                this.getGoodsClassData();
                this.setState({sortState: !this.state.sortState});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    setTypeSortParam (obj) {
        let param = this.state.sortParam,
            flag = false;
        for(let i = 0 ; i < param.length ; i++) {
            if(param[i].type_id == obj.type_id) {
                param[i].sort_value = obj.sort_value;
                flag = true;
            }
        }
        if(!flag) {
            param.push(obj);
        }
        this.setState({sortParam: param});
    }

    render() {
        let modalXml = '';
        switch (this.state.modalState) {
            case 1:  //添加商品分类;
                modalXml = (
                    <Modal
                        width="535"
                        header="添加分类"
                        confirm="保存"
                        cancel="取消"
                        confirmCallback={this.addGoodsClassSub.bind(this)}
                        cancelCallback={() => {
                                this.setState({modalState: 0});
                            }}
                    >
                        <AddClass data={this.state.goodsClassData} param={this.state.addParam} setParam={this.setAddParam} />
                    </Modal>
                );
                break;
        }

        return (
            <div className="section-warp">
                <div className="section-filter">
                    <div className="filter-row">
                        <div className="btn-group">
                            {
                                this.state.areaData.map((area, index) => {
                                    return (
                                        <btn key={index} className={this.state._area == area.area_id ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.toggleArea.bind(this, area.area_id)}>{area.area_name}</btn>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="section-table row">
                    <div className="col-lg-4">
                        <div className="class-tree">
                            <div className="class-tree-header"><span className="text">商品分类树</span>
                                <btn className="btn btn-sm" style={{float: 'right'}} onClick={this.addGoodsClass.bind(this)}>新增</btn>
                                {this.state.sortState ? <btn className="btn btn-sm" style={{float: 'right'}} onClick={this.typeSort.bind(this)}>完成</btn>
                                    :<btn className="btn btn-sm" style={{float: 'right'}} onClick={this.typeSort.bind(this)}>排序</btn>
                                }
                            </div>
                            <GoodsClassTree data={this.state.goodsClassData} updateGoodsClass={this.updateGoodsClass}
                                            setTypeSortParam={this.setTypeSortParam} sortState={this.state.sortState} />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        {
                            this.state._type ?
                                <BasicAttr
                                    data={this.state.goodsClassData}
                                    _type={this.state._type}
                                    getGoodsClassData={this.getGoodsClassData}
                                    setTYPE={this.setTYPE}
                                    inputFormat={this.state.inputFormat}
                                /> : ''
                        }
                    </div>
                    <div className="col-lg-4">
                        {
                            this.state._type && !this.state._type.isHasChild ?
                                <SpecialAttr
                                    inputFormat={this.state.inputFormat}
                                    _type={this.state._type}
                                /> : ''
                        }
                    </div>
                </div>
                {modalXml}
            </div>
        );
    }
}

export default GoodsClass;